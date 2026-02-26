import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import logo from "./assets/herbalin_logo.png";
import Login from "./Login";
import Signup from "./Signup";
import { FaSignOutAlt } from "react-icons/fa";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null); // Logged in user
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef();

  useEffect(() => {
    // Load user from localStorage on page load
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    // Close dropdown when clicking outside
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpenDropdown(false);
  };

  // Called after successful login from modal
  const handleLoginSuccess = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setShowLogin(false);
  };

  return (
    <>
      <div className="w-full flex justify-center mt-3">
        <nav className="w-[95%] bg-[#E7E7E7] rounded-full py-3 px-8 flex items-center justify-between shadow-sm">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Herbalin Logo"
              className="rounded-full h-14 w-auto"
            />
          </div>

          {/* Menu */}
          <ul className="flex gap-20 text-[#1B5E44] font-bold">
            <li><Link to="/" className="relative font-bold text-[#1B5E44] hover:text-[#154635] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#154635] after:transition-all after:duration-300 hover:after:w-full">Home</Link></li>
            <li>About</li>
            <li><Link to="/slider-flow" className="relative font-bold text-[#1B5E44] hover:text-[#154635] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#154635] after:transition-all after:duration-300 hover:after:w-full">Scan Skin</Link></li>
            <li>Skincare Tips</li>
            <li><Link to="/book-appointment" className="relative font-bold text-[#1B5E44] hover:text-[#154635] after:absolute after:left-0 after:-bottom-1 after:w-0 after:h-[2px] after:bg-[#154635] after:transition-all after:duration-300 hover:after:w-full">Book Appointment</Link></li>
          </ul>

          {/* Login / User Circle */}
          {!user ? (
            <button
              onClick={() => setShowLogin(true)}
              className="border border-[#1B5E44] text-[#1B5E44] px-6 py-1.5 rounded-full font-bold hover:bg-[#154635] hover:text-white transition"
            >
              Log In
            </button>
          ) : (
            <div className="relative" ref={dropdownRef}>
              {/* User Circle */}
              <div
                onClick={() => setOpenDropdown(!openDropdown)}
                className="w-10 h-10 rounded-full bg-[#1B5E44] text-white flex items-center justify-center cursor-pointer font-bold text-lg hover:bg-[#154635] transition-colors"
              >
                {user.email.charAt(0).toUpperCase()}
              </div>

              {/* Dropdown */}
              {openDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg border border-gray-200 py-2 z-50">
                  <p className="px-4 py-2 text-gray-700 font-medium">
                    {user.name}
                  </p>
                  <div
                    onClick={handleLogout}
                    className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
                  >
                    <FaSignOutAlt />
                    Logout
                  </div>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* MODALS */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={handleLoginSuccess} // Pass success callback
        />
      )}

      {showSignup && (
        <Signup
          onClose={() => setShowSignup(false)}
          onLoginClick={() => {
            setShowSignup(false);
            setShowLogin(true);
          }}
        />
      )}
    </>
  );
}
