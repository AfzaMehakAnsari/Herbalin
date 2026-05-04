import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { FaArrowLeft, FaLeaf, FaUtensils, FaUser, FaLayerGroup } from "react-icons/fa";
import Sidebar from "../components/Sidebar";

import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

export default function ScanDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [scan, setScan] = useState(null);

  useEffect(() => {
  const fetchScan = async () => {
    const res = await fetch("http://localhost:5000/api/admin/all-scans");
    const data = await res.json();

    // SAFE FIX
    const found = data?.data?.find((s) => s._id === id);

    setScan(found);
  };

  fetchScan();
}, [id]);

  if (!scan) return <p className="ml-64 p-10">Loading...</p>;

  // ================= SEVERITY =================
  const getSeverityPercent = (severity) => {
    switch (severity) {
      case "Mild": return 25;
      case "Moderate": return 60;
      case "Severe": return 90;
      case "Normal": return 100;
      default: return 0;
    }
  };

  const getSeverityMeaning = (severity) => {
    switch (severity) {
      case "Mild":
        return "Low risk condition requiring minor care.";
      case "Moderate":
        return "Needs proper monitoring and treatment.";
      case "Severe":
        return "Immediate dermatologist attention required.";
      case "Normal":
        return "No skin issue detected.";
      default:
        return "";
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Mild": return "text-green-600";
      case "Moderate": return "text-yellow-500";
      case "Severe": return "text-red-600";
      case "Normal": return "text-green-600";
      default: return "text-gray-600";
    }
  };

  const getSeverityChart = (severity) => {
    const percent = getSeverityPercent(severity);

    return {
      datasets: [
        {
          data: [percent, 100 - percent],
          backgroundColor: [
            severity === "Mild"
              ? "#22c55e"
              : severity === "Moderate"
              ? "#facc15"
              : severity === "Severe"
              ? "#ef4444"
              : "#22c55e",
            "#e5e7eb",
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  // ================= LAYER =================
  const getLayerText = (layer) => {
    if (!layer) return "";

    const l = layer.toLowerCase();

    if (l.includes("epidermis")) return "Epidermis (1st Layer)";
    if (l.includes("dermis")) return "Dermis (2nd Layer)";
    return layer;
  };

  const getLayerMeaning = (layer) => {
    if (!layer) return "";

    const l = layer.toLowerCase();

    if (l.includes("epidermis"))
      return "This condition affects the outermost skin layer.";
    if (l.includes("dermis"))
      return "This condition affects deeper skin structure.";

    return "Skin layer information not clearly available.";
  };

  // ================= DB CHECKS (IMPORTANT FIX) =================
  const hasRemedies =
    Array.isArray(scan.remedies) &&
    scan.remedies.some(r =>
      [
        r["Remedy/Precaution(1)"],
        r["Remedy/Precaution(2)"],
        r["Remedy/Precaution(3)"],
        r["Remedy/Precaution(4)"],
        r["Remedy/Precaution(5)"],
      ].some(Boolean)
    );

  const hasDiet =
    Array.isArray(scan.remedies) &&
    scan.remedies.some(r =>
      [
        r["Diet(Breakfast)"],
        r["Diet(Lunch and Dinner)"],
        r["Diet(Fruits)"],
        r["Diet(Salad)"],
      ].some(Boolean)
    );

  return (
    <div className="flex">

      <Sidebar />

      <div className="ml-64 w-full p-8 bg-gray-50 min-h-screen">

        {/* BACK */}
        <Link
  to="/scans"
  className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
>
  <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

  <span>
    Back to Scan
  </span>
</Link>

        {/* USER + DATE */}
        <div className="p-4 flex justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500 flex items-center gap-1">
              <FaUser /> User
            </p>
            <p className="font-bold">{scan.userId?.name || "Unknown"}</p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-bold">
              {new Date(scan.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>

        {/* MAIN */}
        <div className="grid grid-cols-3 gap-6">

          <img
            src={scan.image}
            className="rounded-2xl shadow col-span-1 w-full h-full object-cover"
          />

          <div className="col-span-2 space-y-6">

            <h1 className="text-3xl font-bold text-[#1B5E44]">
              {scan.disease}
            </h1>

            <p className="text-gray-600">{scan.diseaseDescription}</p>

            {/* SEVERITY + LAYER */}
            <div className="flex items-stretch gap-4">

              {/* SEVERITY */}
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow w-1/2">

                <div className="relative w-24 h-24">
                  <Pie
                    data={getSeverityChart(scan.severity)}
                    options={{
                      cutout: "70%",
                      plugins: { legend: { display: false } },
                    }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                    {getSeverityPercent(scan.severity)}%
                  </span>
                </div>

                <div>
                  <p className={`text-lg font-bold ${getSeverityColor(scan.severity)}`}>
                    {scan.severity}
                  </p>
                  <p className="text-sm text-gray-600">
                    {getSeverityMeaning(scan.severity)}
                  </p>
                </div>
              </div>

              {/* LAYER */}
              <div className="bg-white p-5 rounded-2xl shadow w-1/2 flex flex-col justify-center">

                <div className="flex items-center gap-2 text-[#1B5E44]">
                  <FaLayerGroup />
                  <p>Skin Layer</p>
                </div>

                <p className="font-bold mt-1">
                  {getLayerText(scan.layer)}
                </p>

                <p className="text-xs text-gray-500 mt-2">
                  {getLayerMeaning(scan.layer)}
                </p>

              </div>

            </div>

            {/* TEMPERAMENT */}
            {(scan.temperament || scan.Temperament) && (
              <div className="p-4 bg-[#EAF5F0] border-l-4 border-[#1B5E44] rounded-xl">
                <p className="font-bold text-[#1B5E44]">Temperament</p>
                <p>{scan.temperament || scan.Temperament}</p>
              </div>
            )}

          </div>
        </div>

        {/* BOTTOM SECTION */}
        <div className="grid grid-cols-2 gap-6 mt-8">

          {/* REMEDIES (ONLY IF DATA EXISTS) */}
          {hasRemedies && (
            <div className="bg-[#EAF5F0] p-5 rounded-2xl shadow">
              <h3 className="flex items-center gap-2 font-bold text-[#1B5E44] mb-4">
                <FaLeaf /> Herbal Remedies
              </h3>

              <div className="space-y-3">
                {scan.remedies.map((r, i) =>
                  [
                    r["Remedy/Precaution(1)"],
                    r["Remedy/Precaution(2)"],
                    r["Remedy/Precaution(3)"],
                    r["Remedy/Precaution(4)"],
                    r["Remedy/Precaution(5)"],
                  ]
                    .filter(Boolean)
                    .map((item, idx) => (
                      <div key={`${i}-${idx}`} className="bg-white p-3 rounded-xl">
                        {item}
                      </div>
                    ))
                )}
              </div>
            </div>
          )}

          {/* DIET (ONLY IF DATA EXISTS) */}
          {hasDiet && (
            <div className="bg-[#EAF5F0] p-5 rounded-2xl shadow">
              <h3 className="flex items-center gap-2 font-bold text-[#1B5E44] mb-4">
                <FaUtensils /> Diet Plan
              </h3>

              <div className="space-y-3">
                {scan.remedies.map((r, i) =>
                  Object.entries({
                    Breakfast: r["Diet(Breakfast)"],
                    "Lunch & Dinner": r["Diet(Lunch and Dinner)"],
                    Fruits: r["Diet(Fruits)"],
                    Salad: r["Diet(Salad)"],
                  }).map(([k, v], idx) =>
                    v ? (
                      <div key={`${i}-${idx}`} className="bg-white p-3 rounded-xl">
                        <b>{k}:</b> {v}
                      </div>
                    ) : null
                  )
                )}
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}