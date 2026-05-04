import {
  FaTachometerAlt,
  FaUsers,
  FaCalendarAlt,
  FaSignOutAlt,
  FaHeartbeat,
  FaSearch,
  FaChevronDown,
} from "react-icons/fa";

import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import logo from "../assets/herbalin_logo.png";

export default function Sidebar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const path = location.pathname;

  // ROUTE CHECKERS
  const isDashboard = path === "/";
  const isUsers = path.startsWith("/users");
  const isScans = path.startsWith("/scans");

  const isAcne = path.startsWith("/acne");
  const isEczema = path.startsWith("/eczema");

  const isDisease = isAcne || isEczema;

  // AUTO OPEN DROPDOWN WHEN ON DISEASE PAGE
  useEffect(() => {
    if (isDisease) {
      setOpen(true);
    }
  }, [isDisease]);

  return (
    <div className="w-64 h-screen bg-white shadow-lg fixed left-0 top-0 flex flex-col justify-between">

      {/* TOP */}
      <div>

        {/* LOGO */}
        <div className="p-6">
          <Link to="/" className="flex items-center gap-3 border-b border-gray-200">
            <img src={logo} alt="logo" />
          </Link>
        </div>


        {/* MENU */}
        <div className="px-4 space-y-2">

          {/* DASHBOARD */}
          <Link
            to="/"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isDashboard
                ? "bg-[#1B5E44] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaTachometerAlt /> Dashboard
          </Link>

          {/* USERS */}
          <Link
            to="/users"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isUsers
                ? "bg-[#1B5E44] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaUsers /> Users
          </Link>

          {/* SCANS */}
          <Link
            to="/scans"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              isScans
                ? "bg-[#1B5E44] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaSearch /> Scans
          </Link>

          {/* APPOINTMENTS */}
          <Link
            to="/appointments"
            className={`flex items-center gap-3 p-3 rounded-lg transition ${
              path === "/appointments"
                ? "bg-[#1B5E44] text-white"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            <FaCalendarAlt /> Appointments
          </Link>

          {/* ========================= */}
          {/* DISEASE DROPDOWN */}
          {/* ========================= */}

          <div>

            {/* MAIN BUTTON */}
            <div
              onClick={() => setOpen(!open)}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition ${
                isDisease
                  ? "bg-[#1B5E44] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <div className="flex items-center gap-3">
                <FaHeartbeat /> Disease Stats
              </div>

              <FaChevronDown
                className={`text-xs transition-transform duration-300 ${
                  open ? "rotate-180" : ""
                }`}
              />
            </div>

            {/* DROPDOWN (auto open on disease pages) */}
            {open && (
              <div className="ml-8 mt-2 space-y-2">

                {/* ACNE */}
                <Link
                  to="/acne"
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    isAcne
                      ? "bg-green-100 text-[#1B5E44] font-semibold"
                      : "text-gray-600 hover:text-[#1B5E44]"
                  }`}
                >
                  ● Acne
                </Link>

                {/* ECZEMA */}
                <Link
                  to="/eczema"
                  className={`block px-3 py-2 rounded-md text-sm transition ${
                    isEczema
                      ? "bg-green-100 text-[#1B5E44] font-semibold"
                      : "text-gray-600 hover:text-[#1B5E44]"
                  }`}
                >
                  ● Eczema
                </Link>

              </div>
            )}

          </div>

        </div>
      </div>

      {/* LOGOUT */}
      <div className=" border-t border-gray-200 px-10 py-2">
        <button
  onClick={() => {
    localStorage.removeItem("adminAuth");
    window.location.href = "/login";
  }}
  className="w-full flex items-center gap-3 text-gray-600 hover:bg-gray-100 p-3 rounded-lg transition"
>
  <FaSignOutAlt /> Logout
</button>
      </div>

    </div>
  );
}