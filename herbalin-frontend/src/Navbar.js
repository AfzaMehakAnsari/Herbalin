import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "./assets/herbalin_logo.png";
import Login from "./Login";
import Signup from "./Signup";
import { FaSignOutAlt, FaHistory, FaBars, FaTimes } from "react-icons/fa";

export default function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [user, setUser] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const handleStorageChange = () => {
      const updatedUser = localStorage.getItem("user");
      setUser(updatedUser ? JSON.parse(updatedUser) : null);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setOpenDropdown(false);
  };

  const handleLoginSuccess = (loggedInUser) => {
    localStorage.setItem("user", JSON.stringify(loggedInUser));
    setUser(loggedInUser);
    setShowLogin(false);
  };

  const handleScanClick = () => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      setShowLogin(true);
    } else {
      navigate("/slider-flow");
    }
    setMenuOpen(false);
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "text-[#154635] text-[17px]"
      : "text-[#1B5E44] text-[17px] hover:text-[#154635] transition-colors duration-200";

  const buttonLinkClass =
    "text-[#1B5E44] text-[17px] hover:text-[#154635] transition-colors duration-200";

  return (
    <>
      {/* NAVBAR */}
      <div className="w-full mt-3 relative">
        <nav className="fixed top-3 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl bg-[#E7E7E7] rounded-full py-3 px-4 md:px-8 flex items-center justify-between shadow-sm z-50">

          {/* LOGO */}
          <img src={logo} alt="logo" className="h-10 md:h-14 flex-shrink-0" />

          {/* DESKTOP MENU */}
          <ul className="hidden md:flex items-center gap-10 lg:gap-16 font-bold">
            <li><NavLink to="/" className={linkClass}>Home</NavLink></li>
            <li><NavLink to="/about" className={linkClass}>About</NavLink></li>
            <li>
              <button onClick={handleScanClick} className={buttonLinkClass}>
                Scan Skin
              </button>
            </li>
            <li><NavLink to="/blog" className={linkClass}>Skincare Tips</NavLink></li>
            <li><NavLink to="/book-appointment" className={linkClass}>Book Appointment</NavLink></li>
          </ul>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-3">

            {/* USER DROPDOWN */}
            {user && (
              <div className="relative" ref={dropdownRef}>
                <div
                  onClick={() => setOpenDropdown(!openDropdown)}
                  className="w-11 h-11 rounded-full bg-white ring-2 ring-[#1B5E44]/20 hover:ring-[#1B5E44]/50 flex items-center justify-center cursor-pointer transition-all duration-300 shadow-sm"
                >
                  <div className="w-9 h-9 rounded-full bg-[#A8D5C2] flex items-center justify-center">
                    <span className="text-[#1B5E44] font-bold text-xs tracking-wide">
                      {user.name
                        ? user.name.trim().split(" ").slice(0, 2).map((n) => n.charAt(0).toUpperCase()).join("")
                        : user.email.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {openDropdown && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-lg rounded-lg border py-2 z-50">
                    <p className="px-4 py-2 font-medium">{user.name}</p>

                    <div
                      onClick={() => {
                        navigate("/history");
                        setOpenDropdown(false);
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                      <FaHistory /> History
                    </div>

                    <div
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer transition-colors duration-200"
                    >
                      <FaSignOutAlt /> Logout
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* LOGIN BUTTON */}
            {!user && (
              <button
                onClick={() => setShowLogin(true)}
                className="hidden md:block border border-[#1B5E44] text-[#1B5E44] px-5 py-1 rounded-full font-bold hover:bg-[#154635] hover:text-white transition-all duration-300 hover:scale-105 hover:shadow-md"
              >
                Log In
              </button>
            )}

            {/* HAMBURGER */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden text-[#1B5E44] z-50"
            >
              {menuOpen ? <FaTimes size={24} /> : <FaBars size={22} />}
            </button>
          </div>

          {/* MOBILE MENU */}
          {menuOpen && (
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-3 w-[85%] bg-white rounded-2xl shadow-xl z-50 py-6">
              <ul className="flex flex-col items-center gap-6 font-bold text-center">
                <li><NavLink to="/" onClick={() => setMenuOpen(false)} className={linkClass}>Home</NavLink></li>
                <li><NavLink to="/about" onClick={() => setMenuOpen(false)} className={linkClass}>About</NavLink></li>
                <li>
                  <button onClick={handleScanClick} className={buttonLinkClass}>
                    Scan Skin
                  </button>
                </li>
                <li><NavLink to="/blog" onClick={() => setMenuOpen(false)} className={linkClass}>Skincare Tips</NavLink></li>
                <li><NavLink to="/book-appointment" onClick={() => setMenuOpen(false)} className={linkClass}>Book Appointment</NavLink></li>
              </ul>

              {/* MOBILE LOGIN */}
              {!user && (
                <div className="mt-6 px-6">
                  <button
                    onClick={() => {
                      setShowLogin(true);
                      setMenuOpen(false);
                    }}
                    className="w-full border border-[#1B5E44] text-[#1B5E44] py-2 rounded-full font-bold hover:bg-[#154635] hover:text-white transition-all duration-300"
                  >
                    Log In
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      {/* OVERLAY */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-20 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* LOGIN MODAL */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={handleLoginSuccess}
        />
      )}

      {/* SIGNUP MODAL */}
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