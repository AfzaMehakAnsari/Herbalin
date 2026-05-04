import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import AcneDetails from "./pages/AcneDetails";
import EczemaDetails from "./pages/EczemaDetails";
import Scans from "./pages/Scans";
import ScanDetails from "./pages/ScanDetail";
import UserDetails from "./pages/UserDetails";
import Appointment from "./pages/Appointment";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/login" element={<AdminLogin />} />

        {/* DASHBOARD */}
        <Route path="/" element={<Dashboard />} />

        {/* USERS */}
        <Route path="/users" element={<Users />} />
        <Route path="/users/:id" element={<UserDetails />} />

        {/* DISEASE */}
        <Route path="/acne" element={<AcneDetails />} />
        <Route path="/eczema" element={<EczemaDetails />} />

        {/* SCANS */}
        <Route path="/scans" element={<Scans />} />
        <Route path="/scans/:id" element={<ScanDetails />} />

        {/* APPOINTMENTS */}
        <Route path="/appointments" element={<Appointment />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;