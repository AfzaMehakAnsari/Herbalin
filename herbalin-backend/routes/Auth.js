const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/User");

const router = express.Router();
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

/* ===================== EMAIL TRANSPORT ===================== */

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/* ===================== SIGNUP / SEND OTP ===================== */

router.post("/signup", async (req, res) => {

  const { name, email, password } = req.body;

  try {

    let user = await User.findOne({ email });

    if (user && user.isVerified) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (user && user.lastOtpSent && Date.now() - user.lastOtpSent < 60000) {
      return res
        .status(429)
        .json({ message: "Please wait before requesting another OTP" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    if (!user) {

      user = await User.create({
        name,
        email,
        password: hashedPassword,
        otp,
        otpExpiry: Date.now() + 60 * 1000,
        isVerified: false,
        lastOtpSent: Date.now(),
      });

    } else {

      user.password = hashedPassword;
      user.otp = otp;
      user.otpExpiry = Date.now() + 60 * 1000;
      user.lastOtpSent = Date.now();

      await user.save();

    }

    await transporter.sendMail({
      from: `"Herbalin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Herbalin Email Verification OTP",
      html: `
      <div style="font-family:sans-serif;text-align:center">
      <h2>Email Verification</h2>
      <p>Your OTP is:</p>
      <h1 style="letter-spacing:4px">${otp}</h1>
      <p>This OTP will expire in 1 minute.</p>
      </div>
      `,
    });

    res.json({ message: "OTP sent to your email", email });

  } catch (err) {

    console.log(err);
    res.status(500).json({ message: "Server error" });

  }

});

/* ===================== VERIFY OTP + DIRECT LOGIN ===================== */

router.post("/verify-otp", async (req, res) => {

  const { email, otp } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    if (!user.otp || user.otp !== otp || user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    user.isVerified = true;
    user.otp = null;
    user.otpExpiry = null;

    await user.save();

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Account verified & logged in",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});

/* ===================== LOGIN ===================== */

router.post("/login", async (req, res) => {

  const { email, password } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }

    if (!user.password) {
      return res.status(400).json({ message: "Please login with Google" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    res.status(500).json({ message: "Server error" });

  }

});

/* ===================== GOOGLE LOGIN ===================== */

router.post("/google", async (req, res) => {

  const { token } = req.body;

  try {

    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { name, email, sub } = payload;

    let user = await User.findOne({ email });

    if (!user) {

      user = await User.create({
        name,
        email,
        googleId: sub,
        isVerified: true,
      });

    }

    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Google login successful",
      token: jwtToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });

  } catch (err) {

    res.status(401).json({ message: "Google authentication failed" });

  }

});

/* ===================== FORGOT PASSWORD ===================== */

router.post("/forgot-password", async (req, res) => {

  const { email } = req.body;

  try {

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;

    user.resetPasswordExpire = Date.now() + 2 * 60 * 60 * 1000;

    await user.save();

    const resetLink =
      `http://localhost:3000/reset-password/${resetToken}?email=${email}`;

    await transporter.sendMail({
      from: `"Herbalin" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Password",
      html: `
      <h2>Reset Password</h2>

      <p>A password reset event has been triggered.</p>

      <p>The password reset window is limited to two hours.</p>

      <p>If you do not reset your password within two hours, you will need to submit a new request.</p>

      <p>To complete the password reset process, visit the following link:</p>

      <a href="${resetLink}">${resetLink}</a>

      <br/><br/>

      <b>Username:</b> ${email}<br/>
      <b>Request Timestamp:</b> ${new Date().toUTCString()}
      `,
    });

    res.json({
      message:
        "Please check your email inbox for a link to complete the reset.",
    });

  } catch (err) {
    console.log("FORGOT PASSWORD ERROR:", err);
    res.status(500).json({ message: "Server error" });
    console.log("EMAIL:", process.env.EMAIL_USER);
  }

});

/* ===================== RESET PASSWORD ===================== */

// reset-password route (Auth.js)
router.post("/reset-password/:token", async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired reset token" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpire = null;

    await user.save();

    // ✅ Return login token after reset
    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.json({
      message: "Password reset successful",
      token: jwtToken,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;