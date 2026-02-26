import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";

import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import TipsList from "./TipsList";
import KeyFeatures from "./KeyFeatures";
import WhyAISkinScanner from "./WhyAISkinScanner";
import HerbalistSection from "./HerbalistSection";
import ScanPage from "./Scan";
import SliderScreen from "./SliderScreen"; // Slider page
import Login from "./Login";
import BookAppointment from "./BookAppointment";

/* ---------------- HOME PAGE ---------------- */
function Home() {
  return (
    <>
      <HeroSection />
      <TipsList />
      <KeyFeatures />
      <WhyAISkinScanner />
      <HerbalistSection />
    </>
  );
}

/* ---------------- APP ---------------- */
function App() {
  // 🔐 Logged-in user state
  const [currentUser, setCurrentUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  // 🪟 Login modal control
  const [showLogin, setShowLogin] = useState(false);

  return (
    <>
      {/* Navbar ko user + login opener pass karo */}
      <Navbar
        currentUser={currentUser}
        onLoginClick={() => setShowLogin(true)}
      />

      {/* Login Modal */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            setShowLogin(false);
          }}
        />
      )}

      {/* Routes */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route
          path="/scan"
          element={<ScanPage currentUser={currentUser} />}
        />
        {/* New Slider → Scan Flow page */}
        <Route
          path="/slider-flow"
          element={<SliderFlow currentUser={currentUser} />}
        />
      </Routes>
    </>
  );
}

/* ---------------- SLIDER → SCAN FLOW COMPONENT ---------------- */
function SliderFlow({ currentUser }) {
  const [showUploadScreen, setShowUploadScreen] = useState(false);

  return (
    <>
      {!showUploadScreen ? (
        <SliderScreen onNext={() => setShowUploadScreen(true)} />
      ) : (
        <ScanPage currentUser={currentUser} />
      )}
    </>
  );
}

export default App;
