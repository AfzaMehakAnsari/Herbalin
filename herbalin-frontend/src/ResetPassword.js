import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [messageType, setMessageType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async () => {
    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    try {
      const res = await axios.post(
        `http://localhost:5000/api/auth/reset-password/${token}`,
        { password }
      );

      // Save token and user
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Password reset successful!");
      setMessageType("success");
    } catch (err) {
      setMessage(err.response?.data?.message || "Server error");
      setMessageType("error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-white to-gray-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 sm:p-8">
        {/* Title */}
        <h2 className="text-2xl sm:text-3xl font-bold text-center text-[#1B5E44] mb-2">
          Reset Password
        </h2>

        <p className="text-center text-gray-500 text-sm mb-6">
          Enter your new password below
        </p>

        {/* Message */}
        {message && (
          <div
            className={`mb-4 text-center text-sm p-2 rounded-lg ${messageType === "success"
                ? "text-green-600 bg-green-50"
                : "text-red-600 bg-red-50"
              }`}
          >
            {message}
          </div>
        )}

        {/* Inputs */}
        <div className="space-y-3">
          <input
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B5E44] transition"
          />

          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 border rounded-lg outline-none focus:ring-2 focus:ring-[#1B5E44] transition"
          />
        </div>

        {/* Button */}
        <button
          onClick={handleReset}
          className="w-full mt-5 bg-[#1B5E44] text-white py-3 rounded-lg font-semibold hover:bg-[#154635] transition transform hover:scale-[1.02]"
        >
          Reset Password
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;