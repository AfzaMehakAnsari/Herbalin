import React, { useState } from "react";

export default function ResultView({ currentUser, result, onGetResult, loading, onTreatment }) {
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const sendReportEmail = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.email) {
      // User not logged in, just return silently
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
        setSent(true); // Show "Sent" on button
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
          <button
            onClick={sendReportEmail}
            disabled={sending || sent}
            className={`px-6 py-2 rounded-full text-white ${
              sent ? "bg-green-600 cursor-default" : "bg-blue-600 hover:bg-blue-500 transition"
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
          className="bg-green-900 hover:bg-green-800 text-white px-6 py-2 rounded-full"
        >
          {loading ? "Analyzing..." : "Get Result"}
        </button>
      )}
    </div>
  );
}
