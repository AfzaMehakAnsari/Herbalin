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

  const [otp, setOtp] = useState(new Array(6).fill(""));

  const [showOtp, setShowOtp] = useState(false);
  const [message, setMessage] = useState("");

  const [timer, setTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);
  const [verified, setVerified] = useState(false);

  /* ================= TIMER ================= */

  const startTimer = () => {

    setTimer(60);
    setCanResend(false);

    const interval = setInterval(() => {

      setTimer((prev) => {

        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }

        return prev - 1;

      });

    }, 1000);

  };

  /* ================= SIGNUP CLICK ================= */

  const handleSignup = () => {

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill all fields");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setShowOtp(true);

  };

  /* ================= SEND OTP ================= */

  const sendOtp = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      setMessage("OTP sent to your email");
      setOtp(new Array(6).fill(""));
      startTimer();

    } catch (err) {

      setMessage(err.response?.data?.message || "Failed to send OTP");

    }

  };

  /* ================= RESEND OTP ================= */

  const resendOtp = async () => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/signup",
        { name, email, password }
      );

      setMessage("New OTP sent");
      setOtp(new Array(6).fill(""));
      startTimer();

    } catch (err) {

      setMessage(err.response?.data?.message || "Failed to resend OTP");

    }

  };

  /* ================= OTP INPUT ================= */

  const handleOtpChange = (element, index) => {

    if (isNaN(element.value)) return;

    const newOtp = [...otp];
    newOtp[index] = element.value;

    setOtp(newOtp);

    if (element.value && element.nextSibling) {
      element.nextSibling.focus();
    }

    const finalOtp = newOtp.join("");

    if (finalOtp.length === 6) {
      verifyOtp(finalOtp);
    }

  };

  const handleKeyDown = (e, index) => {

    if (e.key === "Backspace" && !otp[index] && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }

  };

  const handlePaste = (e) => {

    const paste = e.clipboardData.getData("text").slice(0, 6);

    if (!/^\d+$/.test(paste)) return;

    const pasteArray = paste.split("");
    const newOtp = [...otp];

    pasteArray.forEach((num, i) => {
      newOtp[i] = num;
    });

    setOtp(newOtp);

    if (paste.length === 6) {
      verifyOtp(paste);
    }

  };

  /* ================= VERIFY OTP ================= */

  const verifyOtp = async (finalOtp) => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/verify-otp",
        {
          email: email,
          otp: finalOtp
        }
      );

      setVerified(true);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setTimeout(() => {
        window.location.href = "/";
      }, 800);

    } catch (err) {

      setMessage("Wrong or Invalid OTP");
      setOtp(new Array(6).fill(""));

    }

  };

  /* ================= GOOGLE SIGNUP ================= */

  const handleGoogleSuccess = async (credentialResponse) => {

    try {

      const res = await axios.post(
        "http://localhost:5000/api/auth/google",
        { token: credentialResponse.credential }
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      if (onLoginSuccess) {
        onLoginSuccess(res.data.user);
      }

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

          <div className="flex items-center justify-center gap-2 mb-5">
            <img
              src={logo}
              alt="Herbalin Logo"
              className="rounded-full h-14 w-auto"
            />
          </div>

          <div className="flex flex-col items-center text-center mb-5">
            <h2 className="text-2xl font-bold mb-1">
              {!showOtp ? "Create Account" : "Verify your account"}
            </h2>
            <p className="text-gray-500">
              {!showOtp ? "Sign up to get started" : `Code will be sent to ${email}`}
            </p>
          </div>

          {/* SIGNUP FORM */}

          {!showOtp && (
            <>
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

              <button
                onClick={handleSignup}
                className="bg-[#1B5E44] hover:bg-[#154635] text-white py-2.5 rounded-lg font-semibold mb-3 w-full"
              >
                Signup
              </button>
            </>
          )}

          {/* OTP SCREEN */}

          {showOtp && (
            <>
              <button
                onClick={canResend ? resendOtp : sendOtp}
                disabled={timer > 0}
                className="bg-[#1B5E44] text-white py-2 rounded-lg mb-2 w-full"
              >
                {timer > 0
                  ? `Send Code (${timer}s)`
                  : canResend
                  ? "Resend Code"
                  : "Send Code"}
              </button>

              {timer > 0 && (
                <p className="text-center text-sm text-gray-500 mb-4">
                  Code expires in {timer}s
                </p>
              )}

              <div
                className="flex justify-center gap-3 mb-4"
                onPaste={handlePaste}
              >
                {otp.map((data, index) => (
                  <input
                    key={index}
                    type="text"
                    maxLength="1"
                    value={data}
                    onChange={(e) => handleOtpChange(e.target, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center border rounded-lg text-lg font-semibold"
                  />
                ))}

                {verified && (
                  <span className="text-green-600 text-2xl ml-2">✔</span>
                )}
              </div>
            </>
          )}

          {message && (
            <p className="text-sm text-center text-red-600 mb-3">
              {message}
            </p>
          )}

          <div className="flex items-center gap-2 mb-3">
            <div className="flex-1 h-px bg-gray-300" />
            <span className="text-sm text-gray-400">Or Signup with</span>
            <div className="flex-1 h-px bg-gray-300" />
          </div>

          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={handleGoogleError}
            width="100%"
          />

          <p className="text-sm text-center mt-6">
            Already have an account?{" "}
            <span
              onClick={onLoginClick}
              className="text-[#1B5E44] font-semibold cursor-pointer hover:underline"
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