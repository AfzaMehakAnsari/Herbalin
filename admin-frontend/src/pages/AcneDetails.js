import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getDiseaseStats } from "../services/api";
import Sidebar from "../components/Sidebar";
import { FaArrowLeft } from "react-icons/fa";

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

import { Pie, Bar } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
);

const useCountUp = (target, duration = 1200) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const step = target / (duration / 16);

    const counter = setInterval(() => {
      start += step;
      if (start >= target) {
        setValue(target);
        clearInterval(counter);
      } else {
        setValue(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(counter);
  }, [target]);

  return value;
};

export default function AcneDetails() {
  const [data, setData] = useState(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const res = await getDiseaseStats();
      setData(res.acne);
      setTimeout(() => setProgress(75), 300);
    };
    fetchData();
  }, []);

  const animatedTotal = useCountUp(data?.total || 0, 1000);

  if (!data)
    return <p className="ml-64 p-6 text-gray-500">Loading...</p>;

  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const pieData = {
    labels: ["Mild", "Moderate", "Severe"],
    datasets: [
      {
        data: [data.mild, data.moderate, data.severe],
        backgroundColor: ["#22c55e", "#facc15", "#ef4444"],
        borderWidth: 2,
        borderColor: "#fff",
      },
    ],
  };

  const barData = {
    labels: months,
    datasets: [
      {
        label: "Cases",
        data: data.monthly,
        backgroundColor: "#1B5E44",
        borderRadius: 10,
        barThickness: 18,
      },
    ],
  };

  return (
    <div className="flex bg-gray-50 min-h-screen">
      <Sidebar />

      <div className="ml-64 w-full p-6">

<Link
  to="/"
  className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
>
  <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

  <span>
    Back to Dashboard
  </span>
</Link>

        <h1 className="text-3xl font-bold text-[#1B5E44]">
          Acne Statistics
        </h1>

        <p className="text-gray-500 mb-6">
          Detailed analysis of acne cases detected by the system
        </p>

        {/* TOP CARD */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-6 shadow-sm mb-6 transition-all duration-300 hover:shadow-lg hover:scale-[1.01]">

          <div className="flex justify-between items-center mb-4">
            <p className="text-sm font-semibold text-[#1B5E44] uppercase">
              Acne Overview
            </p>

            <span className="text-xs px-3 py-1 bg-[#1B5E44]/10 text-[#1B5E44] rounded-full">
              Live Data
            </span>
          </div>

          <h1 className="text-5xl font-bold text-[#1B5E44]">
            {animatedTotal}
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Total detected acne cases
          </p>

          <div className="mt-4 w-full bg-gray-200 h-2 rounded-full overflow-hidden">
            <div
              className="bg-[#1B5E44] h-2 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* CHARTS */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

          {/* PIE CHART */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">

            <h2 className="font-semibold text-[#1B5E44] mb-4">
              Severity Distribution
            </h2>

            <div className="h-72 flex justify-center items-center transition-transform duration-500 hover:scale-[1.03]">
              <Pie
                data={pieData}
                options={{
                  animation: {
                    duration: 1800,
                    easing: "easeOutQuart",
                  },
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        usePointStyle: true,
                        padding: 20,
                      },
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* BAR CHART */}
          <div className="bg-white p-6 rounded-2xl border shadow-sm transition-all duration-300 hover:shadow-lg hover:scale-[1.02]">

            <h2 className="font-semibold text-[#1B5E44] mb-4">
              Monthly Cases
            </h2>

            <div className="h-72 transition-transform duration-500 hover:scale-[1.03]">
              <Bar
                data={barData}
                options={{
                  animation: {
                    duration: 1800,
                    easing: "easeOutQuart",
                  },
                  plugins: {
                    legend: { display: false },
                  },
                  scales: {
                    x: { grid: { display: false } },
                    y: { grid: { color: "#eee" } },
                  },
                }}
              />
            </div>
          </div>
        </div>

        {/* BREAKDOWN */}
        <div className="bg-white rounded-2xl border shadow-sm p-5 transition-all duration-300 hover:shadow-lg">

          <h2 className="font-semibold text-[#1B5E44] mb-4">
            Severity Breakdown
          </h2>

          <div className="space-y-4">

            {[
              { label: "Mild", color: "bg-green-500", value: data.mild },
              { label: "Moderate", color: "bg-yellow-500", value: data.moderate },
              { label: "Severe", color: "bg-red-500", value: data.severe },
            ].map((item, i) => (
              <div
                key={i}
                className="flex justify-between transition-all duration-300 hover:scale-[1.02] hover:bg-gray-50 p-2 rounded-lg"
              >
                <span className="flex items-center gap-2">
                  <span className={`w-3 h-3 ${item.color} rounded-full`}></span>
                  {item.label}
                </span>

                <span className="font-semibold">
                  {item.value} (
                  {((item.value / data.total) * 100).toFixed(1)}%)
                </span>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}