const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    // Normal signup users
    password: {
      type: String,
      default: null,
    },

    // Google login users
    googleId: {
      type: String,
      default: null,
    },

    // OTP verification (signup ke liye)
    otp: {
      type: String,
      default: null,
    },

    otpExpiry: {
      type: Date,
      default: null,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    // OTP resend protection
    lastOtpSent: {
      type: Date,
      default: null,
    },

    /* ================= PASSWORD RESET ================= */

    resetPasswordToken: {
      type: String,
      default: null,
    },

    resetPasswordExpire: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);