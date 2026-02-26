import { useState } from "react";
import Result from "./Result";

export default function ScanPage() {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("upload");

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
    setStep("suitable");
  };

  const analyzeImage = async () => {
    setLoading(true);

    const formData = new FormData();
    formData.append("image", image);

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data);
    setLoading(false);
    setStep("result");
  };

  // ✅ EMAIL FUNCTION (HERE – CORRECT PLACE)
  const sendReportEmail = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.email) {
      alert("Please login to receive report");
      return;
    }

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

    const data = await res.json();
    data.success
      ? alert("Email sent successfully")
      : alert("Email failed");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      {/* STEP 1 */}
      {step === "upload" && (
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">Let’s start!</h1>

          <label className="block bg-[#0B5D3B] text-white py-4 rounded-xl cursor-pointer mb-4">
            Take Photo
            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </label>

          <label className="block bg-[#0B5D3B] text-white py-4 rounded-xl cursor-pointer">
            Upload Photo
            <input type="file" accept="image/*" hidden onChange={handleImage} />
          </label>
        </div>
      )}

      {/* STEP 2 */}
      {step === "suitable" && (
        <Result preview={preview} loading={loading} onGetResult={analyzeImage} />
      )}

      {/* STEP 3 */}
      {step === "result" && (
        <Result
          preview={preview}
          result={result}
          sendReportEmail={sendReportEmail} // ✅ PASS HERE
        />
      )}
    </div>
  );
}
