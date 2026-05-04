const express = require("express");
const nodemailer = require("nodemailer");
const Appointment = require("../models/Appointment");
const router = express.Router();

//  GET booked slots for a date
router.get("/slots", async (req, res) => {
  try {
    const { date } = req.query;
    const appointments = await Appointment.find({ date }, "time");
    const bookedTimes = appointments.map(a => a.time);
    res.json({ success: true, bookedTimes });
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

//  POST — book appointment
router.post("/", async (req, res) => {
  console.log("📩 Appointment request received:", req.body);

  const { firstName, lastName, contact, email, day, date, time } = req.body;

  if (!firstName || !contact || !email || !date) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    //  PEHLE check karo — save se pehle
    const existing = await Appointment.findOne({ date, time });
    if (existing) {
      return res.status(409).json({
        success: false,
        message: "This time slot is already booked. Please choose another.",
      });
    }

    // Ab save karo
    const appointment = new Appointment({ firstName, lastName, contact, email, day, date, time });
    await appointment.save();
    console.log("Appointment saved to DB:", appointment._id);

    // Email bhejo
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
    });

    await transporter.sendMail({
      from: `"Herbalin Appointments" <${process.env.EMAIL_USER}>`,
      to: "lunapatrick321@gmail.com",
      subject: "New Appointment Booked",
      html: `
        <h2>New Appointment Request</h2>
        <p><b>Name:</b> ${firstName} ${lastName}</p>
        <p><b>Contact:</b> ${contact}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Day:</b> ${day}</p>
        <p><b>Date:</b> ${date}</p>
        <p><b>Time:</b> ${time}</p>
      `,
    });

    res.status(200).json({
      success: true,
      message: "Appointment booked successfully. Doctor will contact you soon.",
    });

  } catch (err) {
    console.error("Appointment error:", err);
    res.status(500).json({ success: false, message: "Something went wrong. Please try again." });
  }
});

module.exports = router;