const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

router.post("/", async (req, res) => {
  console.log("📩 Appointment request received:", req.body);

  const { firstName, lastName, contact, email, day, date, time } = req.body;

  if (!firstName || !contact || !email || !date) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Herbalin Appointments" <${process.env.EMAIL_USER}>`,
      to: "lunapatrick321@gmail.com", // hard-coded doctor email
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
  message: "Appointment request sent successfully. Doctor will contact you soon.",
});

  } catch (err) {
    console.error("Appointment email error:", err);
    res.status(500).json({
      success: false,
      message: "Email sending failed",
    });
  }
});

module.exports = router;
