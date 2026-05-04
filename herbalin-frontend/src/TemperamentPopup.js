import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function TemperamentPopup({
  onClose,
  disease,
  severity,
  layer,
  user,
  imageUrl,
  fullParagraph,
  analysisId,
  onTreatmentComplete,
}) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    bodyAppearance: null,
    bodyFeel: null,
    complexion: null,
    pulse: null,
    behavior: null,
    thirst: null,
    appetite: null,
    sleep: null,
    stool: null,
    urine: null,
  });

  const [loading, setLoading] = useState(false);

  const questions = [
    {
      label: "1. Body Appearance",
      name: "bodyAppearance",
      options: [
        "Muscular, Robust, veins are prominent",
        "Loose musculature, fatty/obese",
        "Average musculature",
        "Thin, weak musculature",
      ],
    },
    {
      label: "2. Feel of Body",
      name: "bodyFeel",
      options: ["Hot", "Cold", "Dry", "Rough"],
    },
    {
      label: "3. Complexion",
      name: "complexion",
      options: ["Reddish", "Dusky", "Pale", "Dark"],
    },
    {
      label: "4. Pulse",
      name: "pulse",
      options: ["Strong", "Slow", "Rapid", "Soft"],
    },
    {
      label: "5. Behavior",
      name: "behavior",
      options: ["Angry", "Calm", "Irritative", "Different"],
    },
    {
      label: "6. Thirst",
      name: "thirst",
      options: ["Normal", "Less", "High", "False"],
    },
    {
      label: "7. Appetite",
      name: "appetite",
      options: ["Normal", "Less", "High", "Low"],
    },
    {
      label: "8. Sleep",
      name: "sleep",
      options: ["Sound", "Excessive", "Less", "Disturbed"],
    },
    {
      label: "9. Stool",
      name: "stool",
      options: ["Normal", "Sticky", "Loose", "Hard"],
    },
    {
      label: "10. Urine",
      name: "urine",
      options: ["Reddish", "White", "Pale", "Dark"],
    },
  ];

  const handleChange = (field, index) => {
    setFormData((prev) => ({ ...prev, [field]: index }));
  };

  const handleSubmit = async () => {
    const unanswered = Object.values(formData).some((v) => v === null);
    if (unanswered) {
      alert("Please answer all questions");
      return;
    }
    if (!analysisId) {
      alert("Analysis ID missing");
      return;
    }

    setLoading(true);
    try {
      // 1. Predict temperament
      const tempRes = await fetch("http://localhost:8000/predict-temperament", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const tempData = await tempRes.json();
      const temperament = tempData.temperament;

      // 2. Get recommendations
      const recRes = await fetch("http://localhost:8000/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ disease, severity, temperament }),
      });
      const recData = await recRes.json();

      // 3. Save to DB
      await fetch(`http://localhost:5000/api/analysis/${analysisId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          temperament,
          temperamentAnswers: formData,
          remedies: recData,
        }),
      });

      // 4. Fire treatment-complete callback
      if (typeof onTreatmentComplete === "function") {
        await onTreatmentComplete({ temperament, remedies: recData });
      }

      // 5. Navigate to result page
      navigate("/remediesresult", {
        state: {
          remedies: recData,
          temperament,
          result: { disease, severity, layer },
          imageUrl,
          fullParagraph,
        },
      });

      onClose();
    } catch (error) {
      console.error(error);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 px-4">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl max-h-[95vh] flex flex-col overflow-hidden">

        {/* HEADER */}
        <div className="p-5 border-b flex justify-between items-center">
          <h2 className="text-2xl font-bold text-[#1B5E44]">Temperament Assessment</h2>
          <button onClick={onClose} className="text-2xl font-bold">✕</button>
        </div>

        {/* BODY */}
        <div className="p-6 overflow-y-auto space-y-5">
          {questions.map((q) => (
            <div key={q.name} className="bg-green-50 p-5 rounded-2xl">
              <p className="font-semibold mb-3 text-[#1B5E44]">{q.label}</p>
              <div className="grid md:grid-cols-2 gap-3">
                {q.options.map((opt, idx) => (
                  <label
                    key={idx}
                    className={`flex gap-3 items-start p-3 rounded-xl border cursor-pointer transition ${
                      formData[q.name] === idx
                        ? "border-green-600 bg-white"
                        : "border-gray-200 bg-white/60"
                    }`}
                  >
                    <input
                      type="radio"
                      checked={formData[q.name] === idx}
                      onChange={() => handleChange(q.name, idx)}
                    />
                    <span className="text-sm text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="p-5 border-t flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-gray-400 text-white"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="px-8 py-2 rounded-full bg-[#1B5E44] text-white"
          >
            {loading ? "Processing..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}