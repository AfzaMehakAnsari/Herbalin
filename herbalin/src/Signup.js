import React, { useState } from "react";
import axios from "axios";
import loginPic from "./assets/loginpic.png";
import logo from "./assets/herbalin_logo.png";
import { GoogleLogin } from "@react-oauth/google";

const Signup = ({ onClose, onLoginClick, onLoginSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/signup", {
        name,
        email,
        password,
      });
      setMessage(res.data.message);

      // Optional: reset form
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/google", {
        token: credentialResponse.credential,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) onLoginSuccess(res.data.user);
      onClose();
    } catch (err) {
      setMessage("Google signup failed");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google signup failed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-[900px] max-w-full grid grid-cols-2 overflow-hidden relative">
        {/* RIGHT IMAGE */}
        <div className="bg-white relative flex items-center justify-end h-screen px-6 order-last">
          <img
            src={loginPic}
            alt="Herbal pic"
            className="h-[550px] w-[500px] object-contain mt-6"
          />

          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>
        </div>

        {/* LEFT FORM */}
        <div className="p-8 flex flex-col justify-center relative order-first">
          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-5">
            <img
              src={logo}
              alt="Herbalin Logo"
              className="rounded-full h-14 w-auto"
            />
          </div>

          <div className="flex flex-col items-center text-center mb-5">
            <h2 className="text-2xl font-bold mb-1">Create Account</h2>
            <p className="text-gray-500">Sign up to get started</p>
          </div>

          {/* Inputs */}
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            type="text"
            placeholder="Full Name"
            className="mb-3 px-3 py-2 rounded-lg bg-gray-100 outline-none text-sm"
          />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="mb-3 px-3 py-2 rounded-lg bg-gray-100 outline-none text-sm"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="mb-3 px-3 py-2 rounded-lg bg-gray-100 outline-none text-sm"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            placeholder="Confirm Password"
            className="mb-3 px-3 py-2 rounded-lg bg-gray-100 outline-none text-sm"
          />

          {/* Terms */}
          <label className="flex items-center gap-2 mb-5 text-xs text-gray-500">
            <input type="checkbox" className="accent-[#1B5E44]" />
            I agree to the{" "}
            <span className="text-[#1B5E44] hover:text-[#154635] font-semibold cursor-pointer transition">
              Terms & Conditions
            </span>
          </label>

          {/* Signup Button */}
          <button
            onClick={handleSignup}
            className="bg-[#1B5E44] hover:bg-[#154635] text-white py-2.5 rounded-lg font-semibold mb-3 transition-colors w-full"
          >
            Signup
          </button>

          {message && (
            <p className="text-sm text-center text-red-600 mb-3">{message}</p>
          )}

          {/* Or signup with */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-400">Or Signup with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Signup */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
          />

          {/* Login link */}
          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={onLoginClick}
              className="text-[#1B5E44] font-semibold cursor-pointer hover:underline hover:text-[#154635] transition"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;