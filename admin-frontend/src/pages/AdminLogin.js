import { useState } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/icon.png";

export default function AdminLogin() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const validEmails = ["admin@gmail.com", "manager@gmail.com"];
    const validPassword = "Admin@123";

    if (!validEmails.includes(email) || password !== validPassword) {
      setError("Invalid email or password");
      return;
    }

    localStorage.setItem("adminAuth", "true");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">

      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow">

        {/* HEADER (LOGO + TITLE) */}
<div className="flex flex-col items-center justify-center mb-8">

  <div className="flex items-center gap-4">

    <img src={logo} className="w-12 h-12" alt="logo" />

    <h1 className="text-2xl font-bold text-[#1B5E44]">
      Admin Panel
    </h1>

  </div>

</div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-4">

          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E44]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1B5E44]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button className="w-full bg-[#1B5E44] text-white py-3 rounded-lg hover:bg-[#0c3f27] transition">
            Login
          </button>

        </form>

      </div>
    </div>
  );
}