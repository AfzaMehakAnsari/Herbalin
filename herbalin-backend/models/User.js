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

    // Normal signup users ke liye
    password: {
      type: String,
      default: null, // Google users ke liye null rahega
    },

    // Google login users ke liye
    googleId: {
      type: String,
      default: null,
    },

    avatar: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);