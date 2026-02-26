const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(
  cors({
    origin: "http://localhost:3000", // React frontend
    credentials: true,
  })
);

app.use(express.json());

/* ===================== MONGODB ===================== */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB error:", err));

/* ===================== ROUTES ===================== */
app.use("/api/auth", require("./routes/auth"));
app.use("/api/send-report", require("./routes/send-report"));
app.use("/api/book-appointment", require("./routes/book-appointment"));


/* ===================== SEND REPORT ROUTE ===================== */
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com", // Gmail SMTP
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER, // your email in .env
    pass: process.env.EMAIL_PASS, // your app password
  },
});

app.post("/api/send-report", async (req, res) => {
  const { toEmail, userName, disease, severity, layer } = req.body;

  if (!toEmail || !userName || !disease) {
    return res.status(400).json({ success: false, message: "Missing required fields." });
  }

  try {
    await transporter.sendMail({
      from: `"Herbalin Skin Analyzer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Skin Analysis Report",
      html: `
        <h2>Hello ${userName},</h2>
        <p>Here is your skin analysis report:</p>
        <ul>
          <li><b>Disease:</b> ${disease}</li>
          <li><b>Severity:</b> ${severity || "Normal"}</li>
          <li><b>Layer affected:</b> ${layer || "None"}</li>
        </ul>
        <p>Stay safe and consult a dermatologist if needed!</p>
      `,
    });

    res.json({ success: true, message: "Report sent successfully!" });
  } catch (err) {
    console.error("Email sending error:", err);
    res.status(500).json({ success: false, message: "Failed to send email." });
  }
});

/* ===================== HEALTH CHECK ===================== */
app.get("/", (req, res) => {
  res.send("Herbalin API is running 🚀");
});

/* ===================== SERVER ===================== */
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
