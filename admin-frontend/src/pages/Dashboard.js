import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import Calendar from "../components/Calendar";
import RecentUsers from "../components/RecentUsers";
import DiseaseCard from "../components/DiseaseCard";

import { FaUsers, FaSearch, FaCalendarAlt } from "react-icons/fa";
import { getUsersWithScans, getDashboardStats, getAppointments } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();

  const [users, setUsers]               = useState([]);
  const [stats, setStats]               = useState(null);
  const [appointments, setAppointments] = useState([]);

  // AUTH GUARD
  useEffect(() => {
    if (!localStorage.getItem("adminAuth")) navigate("/login");
  }, [navigate]);

  // DATA FETCH — sab ek saath
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [userRes, statsRes, apptRes] = await Promise.all([
        getUsersWithScans(),
        getDashboardStats(),
        getAppointments(),
      ]);

      setUsers(userRes || []);
      setStats(statsRes);

      // array ya {appointments:[]} dono handle
      if (Array.isArray(apptRes))            setAppointments(apptRes);
      else if (apptRes?.appointments)        setAppointments(apptRes.appointments);
      else                                   setAppointments([]);

    } catch (err) {
      console.error("Dashboard Error:", err);
    }
  };

  // DISEASE COUNTS
  const acneCount    = stats?.diseaseStats?.find(d => d._id === "Acne")?.count   || 0;
  const eczemaCount  = stats?.diseaseStats?.find(d => d._id === "Eczema")?.count || 0;
  const totalDisease = acneCount + eczemaCount;
  const acnePercent   = totalDisease ? Math.round((acneCount   / totalDisease) * 100) : 0;
  const eczemaPercent = totalDisease ? Math.round((eczemaCount / totalDisease) * 100) : 0;

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 w-full p-6 bg-gray-50 min-h-screen">

        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-gray-500 mb-6">Welcome back! Here's your overview.</p>

        {/* TOP CARDS */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <StatCard
            title="Total Users"
            value={stats?.totalUsers ?? 0}
            icon={<FaUsers />}
            route="/users"
          />
          <StatCard
            title="Total Scans"
            value={stats?.totalScans ?? 0}
            icon={<FaSearch />}
            route="/scans"
          />
          <StatCard
            title="Appointments"
            value={appointments.length}
            icon={<FaCalendarAlt />}
            route="/appointments"
          />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-3 gap-6">

          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-bold mb-3 border-l-4 border-[#1B5E44] pl-2">
                Disease Statistics
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <DiseaseCard
                  title="Acne Cases"
                  value={acneCount}
                  percent={`${acnePercent}%`}
                  subtitle="Detected from scans"
                  type="acne"
                />
                <DiseaseCard
                  title="Eczema Cases"
                  value={eczemaCount}
                  percent={`${eczemaPercent}%`}
                  subtitle="Detected from scans"
                  type="eczema"
                />
              </div>
            </div>

            <RecentUsers users={users} />
          </div>

          <Calendar appointments={appointments} />

        </div>
      </div>
    </div>
  );
}