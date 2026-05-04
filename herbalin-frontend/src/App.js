import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ResetPassword from "./ResetPassword";
import Login from "./Login";
import Signup from "./Signup";
import Navbar from "./Navbar";
import ScanPage from "./Scan";
import SliderScreen from "./SliderScreen";
import ScanHistory from "./ScanHistory";
import BookAppointment from "./BookAppointment";
import ChatbotFloatingButton from "./ChatbotFloatingButton";
import Preloader from "./Preloader";
import TemperamentPopup from "./TemperamentPopup";
import RemediesResult from "./RemediesResult";
import Footer from "./Footer";
import BlogGrid from "./Blog";
import About from "./About";
import Home from "./Home";
/* ---------------- SLIDER FLOW ---------------- */
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

/* ---------------- APP LAYOUT ---------------- */
function AppLayout() {
  const location = useLocation();

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (err) {
      console.error(err);
      localStorage.removeItem("user");
      return null;
    }
  };
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  useEffect(() => {
    const user = getStoredUser();
    const publicRoutes = ["/reset-password"];

    const isPublicRoute = publicRoutes.some((route) =>
      location.pathname.startsWith(route),
    );

    if (!user && !isPublicRoute) {
      setShowLogin(true);
    }
  }, [location.pathname]);
  return (
    <div style={{ position: "relative" }}>
      {/* NAVBAR */}
      {location.pathname !== "/history" && (
        <Navbar
          currentUser={currentUser}
          onLoginClick={() => setShowLogin(true)}
        />
      )}

      <ChatbotFloatingButton />

      {/* LOGIN MODAL */}
      {showLogin && (
        <Login
          onClose={() => setShowLogin(false)}
          onSignupClick={() => {
            setShowLogin(false);
            setShowSignup(true);
          }}
          onLoginSuccess={(user) => {
            localStorage.setItem("user", JSON.stringify(user));
            setCurrentUser(user);
            setShowLogin(false);
            window.dispatchEvent(new Event("storage"));
            navigate("/slider-flow");
          }}
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

      {/* ROUTES */}
      <main className={location.pathname === "/history" ? "" : "pt-24"}>
        <Routes>
          <Route
            path="/"
            element={<Home onLoginOpen={() => setShowLogin(true)} />}
          />
          <Route path="/history" element={<ScanHistory />} />
          <Route path="/book-appointment" element={<BookAppointment />} />
          <Route
            path="/scan"
            element={<ScanPage currentUser={currentUser} />}
          />
          <Route
            path="/slider-flow"
            element={<SliderFlow currentUser={currentUser} />}
          />
          <Route path="/temperamentpopup" element={<TemperamentPopup />} />
          <Route path="/remediesresult" element={<RemediesResult />} />
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/blog" element={<BlogGrid />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>

      {/* FOOTER */}
      {location.pathname !== "/history" && <Footer />}
    </div>
  );
}

/* ---------------- MAIN APP ---------------- */
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 2500);
  }, []);

  return loading ? <Preloader /> : <AppLayout />;
}

export default App;