import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { generateFullTreatmentReport, getFullReportBase64 } from "./Generatereport";
import { FaFilePdf, FaEnvelope, FaArrowLeft, FaLayerGroup } from "react-icons/fa";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
ChartJS.register(ArcElement, Tooltip);

/* ─── Smart detector: is this item a remedy or precaution? ─── */
function detectType(items) {
  if (!items || items.length === 0) return "remedy";
  const precautionKeywords = [
    "apply", "do not", "don't", "refrain", "prevent", "stay away",
    "limit", "reduce", "stop", "never", "caution", "warning",
    "excessive", "cold", "chilled", "humid", "scratch",
  ];
  const combined = items.join(" ").toLowerCase();
  const hits = precautionKeywords.filter((k) => combined.includes(k)).length;
  return hits >= 2 ? "remedy" : "precaution";
}

export default function RemediesResult() {
  const location = useLocation();
  const data = location.state || {};
  const { remedies, temperament, result, imageUrl, fullParagraph } = data;

  const navigate = useNavigate();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 50);
    return () => clearTimeout(t);
  }, []);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const reportParams = {
    userName: user?.name || "Patient",
    disease: result?.disease,
    severity: result?.severity,
    layer: result?.layer,
    date: new Date().toLocaleDateString("en-PK", {
      year: "numeric", month: "long", day: "numeric",
    }),
    temperament,
    remedies,
  };

  const handleDownload = () => {
    setDownloading(true);
    try { generateFullTreatmentReport(reportParams); }
    catch (e) { console.error(e); alert("Failed to generate PDF."); }
    finally { setDownloading(false); }
  };

  const handleSendEmail = async () => {
    const toEmail = user?.email;
    if (!toEmail) { alert("No email found. Please make sure you are logged in."); return; }
    setSending(true);
    try {
      const base64 = getFullReportBase64(reportParams);
      const res = await fetch("http://localhost:5000/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          userName: user?.name || "Patient",
          disease: result?.disease,
          severity: result?.severity,
          layer: result?.layer,
          pdfBase64: base64,
        }),
      });
      if (res.ok) setSent(true);
      else alert("Failed to send email. Please try again.");
    } catch (e) { console.error(e); alert("Error sending email."); }
    finally { setSending(false); }
  };

  /* ── Data ── */
  const getSeverityPercent = (s) =>
    ({ Mild: 25, Moderate: 60, Severe: 90, Normal: 100 }[s] || 0);

  const getSeverityColor = (s) =>
    ({ Mild: "text-green-600", Moderate: "text-yellow-500", Severe: "text-red-600", Normal: "text-green-600" }[s] || "text-gray-600");

  const getSeverityMeaning = (s) =>
    ({ Mild: "Low risk condition requiring minor care.", Moderate: "Needs proper monitoring and treatment.", Severe: "Immediate dermatologist attention required.", Normal: "No skin issue detected." }[s] || "");

  const getSeverityChart = (s) => {
    const pct = getSeverityPercent(s);
    return {
      datasets: [{
        data: [pct, 100 - pct],
        backgroundColor: [
          s === "Mild" ? "#22c55e" : s === "Moderate" ? "#facc15" : s === "Severe" ? "#ef4444" : "#22c55e",
          "#e5e7eb",
        ],
        borderWidth: 0,
      }],
    };
  };

  /* ── Layer helpers ── */
  const getLayerText = (layer) => {
    if (!layer) return "—";
    const l = String(layer).toLowerCase();
    if (l.includes("epidermis") || l === "1") return "Epidermis (1st Layer)";
    if (l.includes("dermis") || l === "2") return "Dermis (2nd Layer)";
    if (l.includes("subcutaneous") || l === "3") return "Subcutaneous (3rd Layer)";
    return layer;
  };

  const getLayerMeaning = (layer) => {
    if (!layer) return "";
    const l = String(layer).toLowerCase();
    if (l.includes("epidermis") || l === "1") return "This condition affects the outermost skin layer.";
    if (l.includes("dermis") || l === "2") return "This condition affects deeper skin structure.";
    if (l.includes("subcutaneous") || l === "3") return "This condition affects the deepest fat layer.";
    return "Skin layer information not clearly available.";
  };

  /* ── Temperament meaning ── */
  const getTemperamentMeaning = (t) => {
    if (!t) return "";
    const tl = t.toLowerCase();
    if (tl.includes("sanguine") || tl.includes("dam")) return "Warm & moist nature. Active, social, and optimistic temperament.";
    if (tl.includes("choleric") || tl.includes("safra")) return "Warm & dry nature. Energetic, assertive, and quick-tempered.";
    if (tl.includes("melancholic") || tl.includes("sauda")) return "Cold & dry nature. Thoughtful, analytical, and sensitive.";
    if (tl.includes("phlegmatic") || tl.includes("balgham")) return "Cold & moist nature. Calm, steady, and slow to react.";
    return "Unani body constitution type affecting treatment response.";
  };

  const firstPlan = remedies?.[0];
  const remedyItems = firstPlan
    ? [1, 2, 3, 4, 5].map((n) => firstPlan[`Remedy/Precaution(${n})`]).filter(Boolean)
    : [];

  const contentType = detectType(remedyItems);

  const dietRows = firstPlan
    ? [
      { label: "Breakfast", key: "Diet(Breakfast)" },
      { label: "Lunch & Dinner", key: "Diet(Lunch and Dinner)" },
      { label: "Fruits", key: "Diet(Fruits)" },
      { label: "Salad", key: "Diet(Salad)" },
      { label: "Drinks", key: "Diet(Drinks)" },
      { label: "Qahwa", key: "Diet(Qahwa)" },
      { label: "Spices", key: "Diet(Spices)" },
    ].filter(({ key }) => firstPlan[key])
    : [];

  const isRemedy = contentType === "remedy";

  return (
    <div style={{ fontFamily: "'Outfit', 'Segoe UI', sans-serif" }} className="min-h-screen bg-white">

      {/* Simple heading + action buttons */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 pb-2 flex items-center justify-between gap-4 mt-10 sm-mt-14">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => navigate("/scan")}
            className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0
             bg-green-50 text-[#1B5E44] hover:bg-green-100 hover:scale-105
             transition-all duration-200"
            title="Go back"
          >
            <FaArrowLeft size={14} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#1B5E44] leading-tight">Result</h1>
            <p className="text-xs text-gray-400 mt-0.5">Herbalin · AI Skin Care</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownload}
            disabled={downloading}
            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                       bg-[#1B5E44] text-white hover:bg-[#14503a] hover:scale-105 active:scale-95
                       transition-all duration-200 disabled:opacity-50 shadow-sm"
          >
            {downloading ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2.5" strokeDasharray="28" strokeDashoffset="10" />
              </svg>
            ) : <FaFilePdf size={14} />}
            <span className="hidden sm:inline">{downloading ? "Generating..." : "Download"}</span>
          </button>

          <button
            onClick={handleSendEmail}
            disabled={sending || sent}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold
                       transition-all duration-200 hover:scale-105 active:scale-95
                       disabled:cursor-not-allowed shadow-sm border
                       ${sent
                ? "bg-green-50 text-green-700 border-green-200"
                : "bg-white text-[#1B5E44] border-[#1B5E44]/40 hover:border-[#1B5E44] hover:bg-green-50"
              }`}
          >
            {sending ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle cx="12" cy="12" r="9" stroke="#1B5E44" strokeWidth="2.5" strokeDasharray="28" strokeDashoffset="10" />
              </svg>
            ) : sent ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : <FaEnvelope size={14} />}
            <span className="hidden sm:inline">{sent ? "Sent!" : "Send Report"}</span>
          </button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-5">

        {/* ═══ HERO CARD ═══ */}
        <div
          className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row"
          style={{
            opacity: mounted ? 1 : 0,
            transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: "opacity 0.5s ease, transform 0.5s ease",
          }}
        >
          {/* Image */}
          <div className="md:w-64 lg:w-72 flex-shrink-0 relative">
            {imageUrl ? (
              <img src={imageUrl} alt="Skin" className="w-full h-full object-cover" style={{ minHeight: 260 }} />
            ) : (
              <div className="w-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center" style={{ minHeight: 260 }}>
                <span className="text-7xl opacity-20">🩺</span>
              </div>
            )}
            <div className="absolute bottom-3 left-3">
              <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">
                AI Analysis
              </span>
            </div>
          </div>

          {/* Info */}
          <div className="flex-1 p-6 sm:p-7">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">
              {result?.disease || "Skin Condition"}
            </h2>

            {fullParagraph && (
              <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-5 pb-5 border-b border-dashed border-gray-200">
                {fullParagraph}
              </p>
            )}

            {/* ── 3 Stat Cards ── */}
            <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-5">

              {/* Severity */}
              <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1">
                <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                  <Pie
                    data={getSeverityChart(result?.severity)}
                    options={{ cutout: "70%", plugins: { legend: { display: false }, tooltip: { enabled: false } } }}
                  />
                  <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm">
                    {getSeverityPercent(result?.severity)}%
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Severity</p>
                  <p className={`text-base sm:text-lg font-bold ${getSeverityColor(result?.severity)}`}>
                    {result?.severity || "—"}
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                    {getSeverityMeaning(result?.severity)}
                  </p>
                </div>
              </div>

              {/* Skin Layer */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-[#1B5E44] mb-1">
                  <FaLayerGroup size={14} />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skin Layer</p>
                </div>
                <p className="font-bold text-sm sm:text-base text-gray-800">
                  {getLayerText(result?.layer)}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {getLayerMeaning(result?.layer)}
                </p>
              </div>

              {/* Body Temperament */}
              <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1 flex flex-col justify-center">
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Body Temperament</p>
                <p className="font-bold text-base sm:text-lg text-[#1B5E44]">
                  {temperament || "—"}
                </p>
                <p className="text-xs text-gray-500 mt-1 leading-snug">
                  {getTemperamentMeaning(temperament)}
                </p>
              </div>

            </div>
          </div>
        </div>

        {/* ═══ BOTTOM GRID ═══ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

          {/* ── LEFT: Remedies OR Precautions ── */}
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s",
            }}
          >
            <div className={`px-6 py-4 flex items-center gap-3 ${isRemedy ? "bg-emerald-50 border-b border-emerald-100" : "bg-amber-50 border-b border-amber-100"}`}>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRemedy ? "bg-emerald-100" : "bg-amber-100"}`}>
                {isRemedy ? (
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#059669" opacity="0.15" />
                    <path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" stroke="#059669" strokeWidth="2" strokeLinecap="round" />
                    <circle cx="12" cy="12" r="1.5" fill="#059669" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2L2 19h20L12 2z" fill="#d97706" opacity="0.15" />
                    <path d="M12 9v5M12 16.5v.5" stroke="#d97706" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className={`font-bold text-base ${isRemedy ? "text-emerald-800" : "text-amber-800"}`}>
                  {isRemedy ? "Herbal Remedies" : "Precautions"}
                </h3>
                <p className={`text-xs ${isRemedy ? "text-emerald-600" : "text-amber-600"}`}>
                  {isRemedy ? "Natural treatment recommendations" : "Important things to avoid"}
                </p>
              </div>
            </div>

            <div className="p-5 space-y-3">
              {remedyItems.length > 0 ? remedyItems.map((item, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 p-3 rounded-2xl transition-all duration-200 hover:scale-[1.015] hover:shadow-sm
                              ${isRemedy ? "bg-emerald-50/60 border border-emerald-100" : "bg-amber-50/60 border border-amber-100"}`}
                >
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold
                                  ${isRemedy ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                    {idx + 1}
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-6">No data available.</p>
              )}
            </div>
          </div>

          {/* ── RIGHT: Diet Plan ── */}
          <div
            className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
            style={{
              opacity: mounted ? 1 : 0,
              transform: mounted ? "translateY(0)" : "translateY(24px)",
              transition: "opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s",
            }}
          >
            <div className="px-6 py-4 flex items-center gap-3 bg-sky-50 border-b border-sky-100">
              <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-4-7-8-7z" fill="#0ea5e9" opacity="0.2" />
                  <path d="M9 12l2 2 4-4" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-base text-sky-800">Recommended Diet</h3>
                <p className="text-xs text-sky-600">Tailored to your temperament</p>
              </div>
            </div>

            <div className="p-5 space-y-2.5">
              {dietRows.length > 0 ? dietRows.map(({ label, key }) => (
                <div
                  key={key}
                  className="flex gap-3 items-start p-3 rounded-2xl bg-sky-50/40 border border-sky-100/60
                             transition-all duration-200 hover:scale-[1.015] hover:shadow-sm"
                >
                  <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider
                                   bg-sky-100 px-2 py-1.5 rounded-lg flex-shrink-0 min-w-[76px]
                                   text-center leading-tight">
                    {label}
                  </span>
                  <p className="text-sm text-gray-700 leading-relaxed">{firstPlan[key]}</p>
                </div>
              )) : (
                <p className="text-sm text-gray-400 text-center py-6">No diet plan available.</p>
              )}
            </div>
          </div>
        </div>

        {/* ═══ FOOTER ═══ */}
        <div className="text-center py-5">
          <p className="text-xs text-gray-400 tracking-widest uppercase">
            Herbalin · AI Skin Care · Personalized Treatment Report
          </p>
        </div>
      </div>
    </div>
  );
}