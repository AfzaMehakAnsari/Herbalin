import React, { useState } from "react";

export default function ResultView({ currentUser, result, onGetResult, loading, onTreatment }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReportEmail = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.email) {
      return;
    }

    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail: user.email,
          userName: user.name,
          disease: result?.disease,
          severity: result?.severity || "Normal",
          layer: result?.layer || "None",
        }),
      });

      if (res.ok) {
        setSent(true);
      }
    } catch (err) {
      console.error("Failed to send report:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h1>Scan Result</h1>
      {result ? (
        <div>
          <p>Disease: {result.disease}</p>
          <p>Severity: {result.severity}</p>
          <p>Layer: {result.layer}</p>

          {/* Send Report Button */}
  

          {/* Treatment Button */}
          <button
            onClick={onTreatment}
            className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-full ml-4"
          >
            Treatment
          </button>
        </div>
      ) : (
        <button
          onClick={onGetResult}
          className="block bg-[#1B5E44] hover:bg-[#154635] text-white px-6 py-2 rounded-full"
        >
          {loading ? "Analyzing..." : "Get Result"}
        </button>
      )}
    </div>
  );
}
