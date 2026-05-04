import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import TemperamentPopup from "./TemperamentPopup";
import { FaLayerGroup, FaArrowLeft, FaEnvelope } from "react-icons/fa";
import { generateSkinReport, getFullReportBase64 } from "./Generatereport";

ChartJS.register(ArcElement, Tooltip);

export default function Result({
  preview,
  result,
  onGetResult,
  loading,
  sendReportEmail,
  imageUrl,
  onBack,
}) {
  const [sending, setSending] = React.useState(false);
  const [sent, setSent] = React.useState(false);
  const [showTemperament, setShowTemperament] = React.useState(false);

  const navigate = useNavigate();

  const analysisId = localStorage.getItem("analysisId");

  const getSeverityPercent = (severity) => {
    switch (severity) {
      case "Mild": return 25;
      case "Moderate": return 60;
      case "Severe": return 90;
      case "Normal": return 100;
      default: return 0;
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

  const getSeverityMeaning = (severity) => {
    switch (severity) {
      case "Mild": return "Low risk condition requiring minor care.";
      case "Moderate": return "Needs proper monitoring and treatment.";
      case "Severe": return "Immediate dermatologist attention required.";
      case "Normal": return "No skin issue detected.";
      default: return "";
    }
  };

  const getSeverityChart = (severity) => {
    const percent = getSeverityPercent(severity);
    return {
      datasets: [{
        data: [percent, 100 - percent],
        backgroundColor: [
          severity === "Mild" ? "#22c55e"
            : severity === "Moderate" ? "#facc15"
              : severity === "Severe" ? "#ef4444"
                : "#22c55e",
          "#e5e7eb",
        ],
        borderWidth: 0,
      }],
    };
  };

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
    if (l.includes("epidermis")) return "This condition affects the outermost skin layer.";
    if (l.includes("dermis")) return "This condition affects deeper skin structure.";
    return "Skin layer information not clearly available.";
  };

  const isNotSkin =
    !result?.disease ||
    result?.disease?.toLowerCase() === "other" ||
    result?.disease?.toLowerCase() === "xyz" ||
    result?.disease?.toLowerCase().includes("not skin") ||
    result?.disease?.toLowerCase().includes("not a skin");

  const fullParagraph =
    result?.disease === "Acne"
      ? "Acne is a common skin condition that occurs when hair follicles become clogged with oil, dead skin cells, and bacteria. It can cause a variety of blemishes, including pimples, blackheads, whiteheads, and sometimes painful cysts or nodules. Acne often appears on the face, chest, back, and shoulders, where oil glands are most active. Hormonal changes, stress, diet, and genetics can all contribute to its development. While it is most common during adolescence, acne can affect adults as well. Proper skincare, topical treatments, and medical guidance can help reduce flare-ups and prevent scarring."
      : result?.disease === "Eczema"
        ? "Eczema is a chronic skin condition that causes red, itchy, and inflamed patches of skin. It can appear on various parts of the body and may flare up periodically, often triggered by allergens, irritants, or stress. The affected skin can become dry, cracked, and sometimes prone to infection due to constant scratching. Symptoms may vary in severity from mild irritation to intense discomfort. Proper skincare, moisturizing, and avoiding triggers are key to managing flare-ups. Consulting a dermatologist can help in controlling symptoms and preventing complications."
        : "";

  /* ── PDF download── */
  const handleDownloadPDF = () => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    generateSkinReport({
      userName: user?.name || "Patient",
      disease: result?.disease,
      severity: result?.severity,
      layer: result?.layer,
      date: new Date().toLocaleDateString("en-PK", {
        year: "numeric", month: "long", day: "numeric",
      }),
    });
  };

  /* ── Send basic analysis email ── */
  const handleSendEmail = async () => {
    setSending(true);
    try {
      await sendReportEmail();
      setSent(true);
    } finally {
      setSending(false);
    }
  };

  /* ─────────────────────────────────────────────────────────────
     Called by TemperamentPopup AFTER it navigates to /remediesresult
     We intercept navigate so we can also fire the email here.

     HOW TO USE:
       Pass  onTreatmentComplete={handleTreatmentComplete}
       to TemperamentPopup.  Inside TemperamentPopup, after
       getting recData call: props.onTreatmentComplete({ temperament, remedies: recData })
       BEFORE navigate().
  ───────────────────────────────────────────────────────────── */
  const handleTreatmentComplete = async ({ temperament, remedies }) => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    const userEmail = user?.email;

    if (!userEmail) return; // no email saved — skip silently

    try {
      const base64 = getFullReportBase64({
        userName: user?.name || "Patient",
        disease: result?.disease,
        severity: result?.severity,
        layer: result?.layer,
        date: new Date().toLocaleDateString("en-PK", {
          year: "numeric", month: "long", day: "numeric",
        }),
        temperament,
        remedies,
      });

      await fetch("http://localhost:5000/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: userEmail,
          pdfBase64: base64,
          disease: result?.disease,
          patientName: user?.name || "Patient",
        }),
      });
      // silently succeeds — user sees the RemediesResult page
    } catch (e) {
      console.error("Auto-email after treatment failed:", e);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 sm:px-6 pb-20">

      {/* ── UPLOAD STATE ── */}
      {!result && (
        <>
          <div className="flex items-center gap-3 mb-2">
            <button
              onClick={onBack}
              className="flex items-center justify-center w-9 h-9 rounded-full flex-shrink-0
             bg-green-50 text-[#1B5E44] hover:bg-green-100 hover:scale-105
             transition-all duration-200"
              title="Go back"
            >
              <FaArrowLeft size={14} />
            </button>
            <h1 className="text-2xl sm:text-4xl font-bold">Upload photo</h1>
          </div>

          <p className="text-gray-500 mb-8 text-center text-sm sm:text-base">
            Your photo is ready. Click the button to see the scan result.
          </p>

          <div className="flex items-center gap-4 border rounded-xl px-4 sm:px-5 py-4 w-full max-w-md mb-8">
            <img
              src={preview}
              alt="preview"
              className="w-10 h-10 sm:w-11 sm:h-11 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 flex justify-between items-center min-w-0">
              <p className="text-[#1B5E44]-600 font-medium text-sm sm:text-base truncate">
                The photo is suitable
              </p>
              <span className="text-[#1B5E44]-600 font-bold text-lg ml-2">✔</span>
            </div>
          </div>

          <button
            onClick={onGetResult}
            className="bg-[#1B5E44] hover:bg-green transition text-white px-10 sm:px-12 py-3 rounded-full text-base sm:text-lg w-full max-w-xs"
          >
            {loading ? "Analyzing..." : "Get Result"}
          </button>
        </>
      )}

      {/* ── RESULT STATE ── */}
      {result && (
        <div className="max-w-5xl w-full mt-6 sm:mt-10">

          <div className="flex items-center gap-3 min-w-0 mt-4">
            <button
              onClick={onBack}
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
          <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 flex flex-col md:flex-row gap-5 sm:gap-6">

            <img
              src={preview}
              alt="skin"
              className="w-full h-56 sm:h-64 md:w-72 md:h-auto rounded-xl object-cover shadow flex-shrink-0"
            />

            <div className="flex-1 min-w-0">

              {/* NORMAL */}
              {result.disease === "Normal" && (
                <>
                  <h1 className="text-2xl sm:text-3xl font-bold text-green-600">NO DISEASE FOUND</h1>
                  <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-5">
                    <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow flex-1">
                      <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
                        <Pie
                          data={{ datasets: [{ data: [100, 0], backgroundColor: ["#22c55e", "#e5e7eb"], borderWidth: 0 }] }}
                          options={{ cutout: "70%", plugins: { legend: { display: false } } }}
                        />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm">100%</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-base sm:text-lg font-bold text-green-600">Normal</p>
                        <p className="text-xs sm:text-sm text-gray-600">No skin issue detected.</p>
                      </div>
                    </div>
                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-[#1B5E44]">
                        <FaLayerGroup />
                        <p className="text-sm sm:text-base">Skin Layer</p>
                      </div>
                      <p className="font-bold mt-1 text-sm sm:text-base text-gray-400">No Layer Detected</p>
                      <p className="text-xs text-gray-500 mt-2">Skin appears healthy with no affected layer.</p>
                    </div>
                  </div>
                </>
              )}

              {/* NOT SKIN */}
              {isNotSkin && (
                <div className="flex flex-col items-start gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-yellow-500">Not a Skin Image</h1>
                  <p className="text-gray-500 text-sm sm:text-base mt-1">
                    The uploaded photo does not appear to be a skin image. Please upload a clear photo of the affected skin area.
                  </p>
                </div>
              )}

              {/* ACNE */}
              {result.disease === "Acne" && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-red-600">Acne</h1>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">{fullParagraph}</p>
                </>
              )}

              {/* ECZEMA */}
              {result.disease === "Eczema" && (
                <>
                  <h1 className="text-xl sm:text-2xl font-bold text-orange-600">Eczema</h1>
                  <p className="text-gray-700 mt-2 text-sm sm:text-base">{fullParagraph}</p>
                </>
              )}

              {/* Severity + Layer */}
              {!isNotSkin && result.disease !== "Normal" && (
                <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-5">
                  <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow flex-1">
                    <div className="relative w-16 h-16 sm:w-24 sm:h-24 flex-shrink-0">
                      <Pie
                        data={getSeverityChart(result.severity)}
                        options={{ cutout: "70%", plugins: { legend: { display: false } } }}
                      />
                      <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm">
                        {getSeverityPercent(result.severity)}%
                      </span>
                    </div>
                    <div className="min-w-0">
                      <p className={`text-base sm:text-lg font-bold ${getSeverityColor(result.severity)}`}>
                        {result.severity}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-600">
                        {getSeverityMeaning(result.severity)}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white p-4 sm:p-5 rounded-2xl shadow flex-1 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-[#1B5E44]">
                      <FaLayerGroup />
                      <p className="text-sm sm:text-base">Skin Layer</p>
                    </div>
                    <p className="font-bold mt-1 text-sm sm:text-base">{getLayerText(result.layer)}</p>
                    <p className="text-xs text-gray-500 mt-2">{getLayerMeaning(result.layer)}</p>
                  </div>
                </div>
              )}

              {result.severity === "Severe" && (
                <p className="text-red-600 font-bold mt-3 text-sm sm:text-base">
                  Please consult a dermatologist immediately.
                </p>
              )}

              {/* ── ACTION BUTTONS ── */}
              {result.disease !== "Normal" && !isNotSkin && (
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-6 items-stretch sm:items-center">

                  <button
                    onClick={handleSendEmail}
                    className="flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gray-100 hover:bg-gray-200 transition text-sm sm:text-base text-green-900 font-medium border border-gray-300"
                  >
                    <FaEnvelope size={15} />
                    {sent ? "Sent ✓" : sending ? "Sending..." : "Send to Email"}
                  </button>

                  {result.severity !== "Severe" && (
                    <button
                      onClick={() => setShowTemperament(true)}
                      className="flex items-center justify-center block bg-[#1B5E44] hover:bg-[#154635] transition text-white px-6 py-3 rounded-full text-sm sm:text-base font-medium"
                    >
                      Do you want treatment?
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* POPUP */}
      {showTemperament && result && (
        <TemperamentPopup
          onClose={() => setShowTemperament(false)}
          disease={result.disease}
          severity={result.severity}
          user={null}
          preview={preview}
          imageUrl={imageUrl}
          fullParagraph={fullParagraph}
          layer={result.layer}
          analysisId={analysisId}
          onTreatmentComplete={handleTreatmentComplete}
        />
      )}
    </div>
  );
}