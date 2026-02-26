import React, { useState } from "react";
import axios from "axios";
import loginPic from "./assets/loginpic.png";
import logo from "./assets/herbalin_logo.png";
import { GoogleLogin, googleLogout } from "@react-oauth/google";
import jwt_decode from 'jwt-decode';
const Login = ({ onClose, onSignupClick, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    if (!email || !password) {
      setMessage("Please enter email and password");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      onLoginSuccess(res.data.user);
      onClose();
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

      onLoginSuccess(res.data.user);
      onClose();
    } catch (err) {
      setMessage("Google login failed");
    }
  };

  const handleGoogleError = () => {
    setMessage("Google login failed");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-[900px] max-w-full grid grid-cols-2 overflow-hidden relative">

        {/* LEFT IMAGE */}
        <div className="bg-white relative flex items-center justify-center h-full">
          <img
            src={loginPic}
            alt="Herbal pic"
            className="h-[550px] w-[500px] object-contain "
          />
        </div>

        {/* RIGHT FORM */}
        <div className="p-10 flex flex-col justify-center relative">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-black text-xl"
          >
            ✕
          </button>

          {/* Logo */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <img
              src={logo}
              alt="Herbalin Logo"
              className="rounded-full h-14 w-auto"
            />
          </div>

          {/* Heading */}
          <div className="flex flex-col items-center text-center mb-6">
            <h2 className="text-2xl font-bold mb-1">Welcome Back</h2>
            <p className="text-gray-500">Please login to your account</p>
          </div>

          {/* Inputs */}
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email address"
            className="mb-4 px-4 py-3 rounded-xl bg-gray-100 outline-none"
          />

          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="mb-2 px-4 py-3 rounded-xl bg-gray-100 outline-none"
          />

          <p className="text-sm text-right text-gray-400 mb-6 cursor-pointer">
            Forgot password?
          </p>

          {/* Login Button */}
          <button
            onClick={handleLogin}
            className="bg-[#1B5E44] hover:bg-[#154635] text-white py-3 rounded-xl font-semibold mb-6 transition-colors w-full"
          >
            Login
          </button>

          {message && (
            <p className="text-sm text-center text-red-600 mb-3">{message}</p>
          )}

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-400">Or Login with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          {/* Google Login */}
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
          />

          {/* Signup text only */}
          <p className="text-sm text-center mt-6">
            Don’t have an account?{" "}
            <span
              onClick={onSignupClick}
              className="text-[#1B5E44] font-semibold cursor-pointer hover:underline hover:text-[#154635] transition"
            >
              Signup
            </span>
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;