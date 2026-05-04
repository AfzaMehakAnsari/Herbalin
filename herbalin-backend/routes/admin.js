const express = require("express");
const router = express.Router();
const nodemailer = require("nodemailer");
const Analysis = require("../models/Analysis");
const User = require("../models/User");
const Appointment = require("../models/Appointment");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.get("/stats", async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalScans = await Analysis.countDocuments();
    const diseaseStats = await Analysis.aggregate([
      { $group: { _id: "$disease", count: { $sum: 1 } } },
    ]);
    const severityStats = await Analysis.aggregate([
      { $group: { _id: { disease: "$disease", severity: "$severity" }, count: { $sum: 1 } } },
    ]);
    res.json({ totalUsers, totalScans, diseaseStats, severityStats });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/disease-stats", async (req, res) => {
  try {
    const scans = await Analysis.find();
    const getStats = (diseaseName) => {
      const filtered = scans.filter((s) => s.disease === diseaseName);
      let mild = 0, moderate = 0, severe = 0;
      let monthly = Array(12).fill(0);
      filtered.forEach((item) => {
        if (item.severity === "Mild") mild++;
        else if (item.severity === "Moderate") moderate++;
        else if (item.severity === "Severe") severe++;
        monthly[new Date(item.createdAt).getMonth()]++;
      });
      return { total: filtered.length, mild, moderate, severe, monthly };
    };
    res.json({ acne: getStats("Acne"), eczema: getStats("Eczema") });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/users-with-scans", async (req, res) => {
  try {
    const users = await User.aggregate([
      {
        $lookup: {
          from: "analyses",
          localField: "_id",
          foreignField: "userId",
          as: "scans",
        },
      },
      { $addFields: { totalScans: { $size: "$scans" } } },
      { $project: { name: 1, email: 1, createdAt: 1, totalScans: 1 } },
    ]);
    res.json({ data: users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/all-scans", async (req, res) => {
  try {
    const data = await Analysis.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });
    res.json({ success: true, data });
  } catch (err) {
    console.error("Fetch Scans Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── GET all appointments ──
router.get("/appointments", async (req, res) => {
  try {
    const appointments = await Appointment.find().sort({ date: 1 });
    res.json({ success: true, appointments });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
});

// ── CREATE appointment ──
router.post("/appointments", async (req, res) => {
  try {
    const { firstName, lastName, contact, email, date, day, time } = req.body;
    if (!firstName || !lastName || !email || !date || !time)
      return res.status(400).json({ success: false, message: "Missing required fields" });
    const existing = await Appointment.findOne({ date, time, status: { $ne: "cancelled" } });
    if (existing)
      return res.status(409).json({ success: false, message: "This slot is already booked. Please choose another time." });
    const appt = await Appointment.create({
      firstName, lastName, contact, email, date, day, time, status: "pending",
    });
    res.json({ success: true, appointment: appt });
  } catch (err) {
    console.error("Book Appointment Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── GET booked slots ──
router.get("/appointments/slots", async (req, res) => {
  try {
    const { date } = req.query;
    if (!date)
      return res.status(400).json({ success: false, message: "Date required" });
    const booked = await Appointment.find({ date, status: { $ne: "cancelled" } }).select("time");
    const bookedTimes = booked.map((a) => a.time);
    res.json({ success: true, bookedTimes });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── CONFIRM ──
router.patch("/appointments/:id/confirm", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    const appt = await Appointment.findByIdAndUpdate(id, { status: "confirmed" }, { new: true });
    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── COMPLETE ──  ← path fix kiya, try/catch add kiya, validation add kiya
router.patch("/appointments/:id/complete", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });

    const appt = await Appointment.findByIdAndUpdate(
      id,
      { status: "completed" },
      { new: true }
    );

    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    res.json({ success: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── CANCEL ──
router.patch("/appointments/:id/cancel", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });

    const appt = await Appointment.findByIdAndUpdate(id, { status: "cancelled" }, { new: true });
    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });

    transporter.sendMail({
      from: `"Dr. Hafsa Abbasi Clinic" <${process.env.EMAIL_USER}>`,
      to: appt.email,
      subject: "Your Appointment Has Been Cancelled",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;border:1px solid #E0E0E0;border-radius:12px;overflow:hidden;">
          <div style="background:#4A4A4A;padding:22px 26px;">
            <h2 style="color:#fff;margin:0;font-size:18px;">Appointment Cancelled</h2>
            <p style="color:#CCC;margin:5px 0 0;font-size:13px;">Dr. Hafsa Abbasi – Dermatology and Skin Wellness</p>
          </div>
          <div style="padding:24px 26px;background:#FAFAFA;">
            <p style="font-size:14px;color:#333;margin:0 0 8px;">Dear <strong>${appt.firstName} ${appt.lastName}</strong>,</p>
            <p style="font-size:13px;color:#666;margin:0 0 18px;">We regret to inform you that your appointment has been <strong style="color:#C0392B;">cancelled</strong>.</p>
            <table style="width:100%;font-size:13px;border-collapse:collapse;border:1px solid #E8E8E8;border-radius:8px;overflow:hidden;">
              <tr style="background:#F5F5F5;">
                <td style="padding:10px 14px;color:#555;font-weight:600;width:35%;">Date</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;">${appt.day}, ${appt.date}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;color:#555;font-weight:600;border-top:1px solid #EEE;">Time</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;border-top:1px solid #EEE;">${appt.time}</td>
              </tr>
              <tr style="background:#F5F5F5;">
                <td style="padding:10px 14px;color:#555;font-weight:600;border-top:1px solid #EEE;">Contact</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;border-top:1px solid #EEE;">${appt.contact}</td>
              </tr>
            </table>
            <p style="font-size:13px;color:#1B5E44;font-weight:700;margin:20px 0 0;">We apologize for any inconvenience caused.</p>
          </div>
          <div style="background:#F0F0F0;padding:12px 26px;text-align:center;">
            <p style="font-size:11px;color:#AAA;margin:0;">This is an automated message. Please do not reply.</p>
          </div>
        </div>
      `,
    }).catch(err => console.error("Cancellation email failed:", err.message));

    res.json({ success: true, appointment: appt });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── DELETE ──
router.delete("/appointments/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    const appt = await Appointment.findByIdAndDelete(id);
    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });
    res.json({ success: true, message: "Appointment deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ── SEND CONFIRMATION EMAIL ──
router.post("/appointments/:id/send-email", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined")
      return res.status(400).json({ success: false, message: "Invalid appointment ID" });
    const appt = await Appointment.findById(id);
    if (!appt)
      return res.status(404).json({ success: false, message: "Appointment not found" });
    if (appt.status === "cancelled")
      return res.status(400).json({ success: false, message: "Cannot send email for a cancelled appointment" });

    if (appt.status !== "confirmed") {
      appt.status = "confirmed";
      await appt.save();
    }

    await transporter.sendMail({
      from: `"Dr. Hafsa Abbasi Clinic" <${process.env.EMAIL_USER}>`,
      to: appt.email,
      subject: "Your Appointment is Confirmed ✅",
      html: `
        <div style="font-family:sans-serif;max-width:520px;margin:auto;border:1px solid #E0E0E0;border-radius:12px;overflow:hidden;">
          <div style="background:#1B5E44;padding:22px 26px;">
            <h2 style="color:#fff;margin:0;font-size:18px;">Appointment Confirmed</h2>
            <p style="color:#A8D5C2;margin:5px 0 0;font-size:13px;">Dr. Hafsa Abbasi – Dermatology & Skin Wellness</p>
          </div>
          <div style="padding:24px 26px;background:#F9FAF9;">
            <p style="font-size:14px;color:#333;margin:0 0 8px;">Dear <strong>${appt.firstName} ${appt.lastName}</strong>,</p>
            <p style="font-size:13px;color:#666;margin:0 0 18px;">Your appointment has been confirmed. Here are your booking details:</p>
            <table style="width:100%;font-size:13px;border-collapse:collapse;border:1px solid #E8E8E8;border-radius:8px;overflow:hidden;">
              <tr style="background:#EDF7F2;">
                <td style="padding:10px 14px;color:#555;font-weight:600;width:35%;">Date</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;">${appt.day}, ${appt.date}</td>
              </tr>
              <tr>
                <td style="padding:10px 14px;color:#555;font-weight:600;border-top:1px solid #EEE;">Time</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;border-top:1px solid #EEE;">${appt.time}</td>
              </tr>
              <tr style="background:#EDF7F2;">
                <td style="padding:10px 14px;color:#555;font-weight:600;border-top:1px solid #EEE;">Contact</td>
                <td style="padding:10px 14px;color:#111;font-weight:700;border-top:1px solid #EEE;">${appt.contact}</td>
              </tr>
            </table>
            <p style="font-size:12px;color:#AAA;margin:20px 0 4px;">Please arrive <strong>10 minutes early</strong>.</p>
            <p style="font-size:13px;color:#1B5E44;font-weight:700;margin:0;">Thank you for choosing our clinic.</p>
          </div>
          <div style="background:#F0F0F0;padding:12px 26px;text-align:center;">
            <p style="font-size:11px;color:#AAA;margin:0;">This is an automated message. Please do not reply.</p>
          </div>
        </div>
      `,
    });

    res.json({ success: true, message: "Confirmation email sent", appointment: appt });
  } catch (err) {
    console.error("Send Email Error:", err);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

module.exports = router;