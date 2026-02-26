import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";

ChartJS.register(ArcElement, Tooltip);


export default function Result({
  preview,
  result,
  onGetResult,
  loading,
  sendReportEmail,   // ✅ THIS MUST EXIST
  onTreatment,
}) 


{

  const [sending, setSending] = React.useState(false);
const [sent, setSent] = React.useState(false);

  const getSeverityPercent = (severity) => {
    switch (severity) {
      case "Mild":
        return 25;
      case "Moderate":
        return 60;
      case "Severe":
        return 90;
      case "Normal":
        return 100; // Normal = full green
      default:
        return 0;
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Mild":
        return "text-green-600";
      case "Moderate":
        return "text-yellow-500";
      case "Severe":
        return "text-red-600";
      case "Normal":
        return "text-green-600";
      default:
        return "text-gray-600";
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
              : "#22c55e", // Normal = green
            "#e5e7eb",
          ],
          borderWidth: 0,
        },
      ],
    };
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4">

      {/* UPLOAD / PREVIEW */}
      {!result && (
        <>
          <h1 className="text-4xl font-bold mb-2">Upload photo</h1>
          <p className="text-gray-500 mb-8 text-center">
            Your photo is ready. Click the button to see the scan result.
          </p>

          <div className="flex items-center gap-4 border rounded-xl px-5 py-4 w-full max-w-md mb-8">
            <img
              src={preview}
              alt="preview"
              className="w-11 h-11 rounded-lg object-cover"
            />
            <div className="flex-1 flex justify-between items-center">
              <p className="text-green-600 font-medium">
                The photo is suitable
              </p>
              <span className="text-green-600 font-bold text-lg">✔</span>
            </div>
          </div>

          <button
            onClick={onGetResult}
            className="bg-green-900 hover:bg-green-800 transition text-white px-12 py-3 rounded-full text-lg"
          >
            {loading ? "Analyzing..." : "Get Result"}
          </button>
        </>
      )}

      {/* RESULT */}
      {result && (
        <div className="max-w-5xl w-full mt-10">

          <h1 className="text-3xl font-bold text-center mb-8">
            Result is ready!
          </h1>

          <div className="bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row gap-6">

            {/* IMAGE */}
            <img
              src={preview}
              alt="skin"
              className="w-full md:w-72 rounded-xl object-cover shadow"
            />

            {/* CONTENT */}
            <div className="flex-1">

              {/* NORMAL SKIN */}
              {result.disease === "Normal" && (
                <h1 className="text-3xl font-bold text-green-600 mt-6">
                  NO DISEASE FOUND
                </h1>
              )}

              {/* NOT SKIN IMAGE */}
              {result.disease === "Xyz" && (
                <h1 className="text-3xl font-bold text-yellow-500 mt-6">
                  NOT A SKIN IMAGE
                </h1>
              )}

              {/* ACNE */}
              {result.disease === "Acne" && (
                <>
                  <h1 className="text-2xl font-bold mb-2 text-red-600">Acne</h1>
                  <p className="mb-2">
                    Acne is a common skin condition that occurs when hair follicles become clogged with oil, dead skin cells, and bacteria. 
It can cause a variety of blemishes, including pimples, blackheads, whiteheads, and sometimes painful cysts or nodules. 
Acne often appears on the face, chest, back, and shoulders, where oil glands are most active. 
Hormonal changes, stress, diet, and genetics can all contribute to its development. 
While it is most common during adolescence, acne can affect adults as well. 
Proper skincare, topical treatments, and medical guidance can help reduce flare-ups and prevent scarring.

                  </p>
                  <p className="mb-3">
                    <b>Layer affected:</b> {result.layer}
                  </p>
                </>
              )}

              {/* ECZEMA */}
              {result.disease === "Eczema" && (
                <>
                  <h1 className="text-2xl font-bold mb-2 text-orange-600">Eczema</h1>
                  <p className="mb-2">
                    Eczema is a chronic skin condition that causes red, itchy, and inflamed patches of skin. 
It can appear on various parts of the body and may flare up periodically, often triggered by allergens, irritants, or stress. 
The affected skin can become dry, cracked, and sometimes prone to infection due to constant scratching. 
Symptoms may vary in severity from mild irritation to intense discomfort. 
Proper skincare, moisturizing, and avoiding triggers are key to managing flare-ups. 
Consulting a dermatologist can help in controlling symptoms and preventing complications.

                  </p>
                  <p className="mb-3">
                    <b>Layer affected:</b> {result.layer}
                  </p>
                </>
              )}

              {/* SEVERITY CARD (ALSO FOR NORMAL) */}
              {result.disease !== "Xyz" && (
                <div className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl shadow-inner w-fit mt-4">
                  <div className="relative w-20 h-20">
                    <Pie
                      data={getSeverityChart(
                        result.disease === "Normal" ? "Normal" : result.severity
                      )}
                      options={{
                        cutout: "70%",
                        plugins: { legend: { display: false } },
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-bold text-sm">
                      {result.disease === "Normal"
                        ? "100%"
                        : getSeverityPercent(result.severity) + "%"}
                    </span>
                  </div>

                  <div>
                    <p
                      className={`text-lg font-bold ${
                        result.disease === "Normal"
                          ? "text-green-600"
                          : getSeverityColor(result.severity)
                      }`}
                    >
                      {result.disease === "Normal" ? "Normal" : result.severity}
                    </p>
                    <p className="text-sm text-gray-600">
                      Affected layer: <b>{result.layer || "None"}</b>
                    </p>
                  </div>
                </div>
              )}

              {/* SEVERE WARNING */}
              {result.severity === "Severe" && (
                <p className="text-red-600 font-semibold mt-3">
                  Please consult a dermatologist immediately.
                </p>
              )}

              {/* BUTTONS (ONLY IF DISEASE) */}
              {result.disease !== "Normal" && result.disease !== "Xyz" && (
  <div className="flex gap-4 mt-6">
    <button
      onClick={async () => {
        setSending(true);
        try {
          await sendReportEmail(); // your async function
          setSent(true);
        } catch (err) {
          console.error("Failed to send report:", err);
        } finally {
          setSending(false);
        }
      }}
      disabled={sending || sent}
      className={`px-6 py-3 rounded-full text-white ${
        sent
          ? "bg-green-600 cursor-default"
          : "bg-blue-600 hover:bg-blue-500 transition"
      } flex items-center gap-2`}
    >
      {sending && (
        <svg
          className="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
      )}
      {sent ? "Sent" : sending ? "Sending..." : "Send Report"}
    </button>

    <button
      onClick={onTreatment}
      className="bg-green-900 hover:bg-green-800 text-white px-6 py-3 rounded-full shadow-lg"
    >
      Do you want treatment?
    </button>
  </div>
)}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
