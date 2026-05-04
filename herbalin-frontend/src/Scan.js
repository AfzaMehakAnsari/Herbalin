import { useState } from "react";
import Result from "./Result";
import { useToast } from "./Toast";
import { getPDFBase64 } from "./Generatereport";

export default function ScanPage() {

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState("upload");
  const [imageUrl, setImageUrl] = useState(null);

  const { showToast, ToastComponent } = useToast();

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
    setStep("suitable");
  };

  const analyzeImage = async () => {
    if (!image) return;
    setLoading(true);

    try {
      const uploadData = new FormData();
      uploadData.append("image", image);
      const uploadRes = await fetch("http://localhost:5000/api/upload", { method: "POST", body: uploadData });
      const uploadResult = await uploadRes.json();
      if (!uploadRes.ok) throw new Error("Image upload failed");
      const uploadedUrl = uploadResult.imageUrl;
      setImageUrl(uploadedUrl);

      const formData = new FormData();
      formData.append("image", image);
      const res = await fetch("http://localhost:8000/analyze", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error("AI analysis failed");

      setResult(data);
      setStep("result");

      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.id) { showToast("Please login to save your analysis.", "warning"); return; }

      const diseaseDescription = data.disease === "Acne"
        ? "Acne is a common skin condition that occurs when hair follicles become clogged with oil, dead skin cells, and bacteria. It can cause a variety of blemishes, including pimples, blackheads, whiteheads, and sometimes painful cysts or nodules. Acne often appears on the face, chest, back, and shoulders, where oil glands are most active. Hormonal changes, stress, diet, and genetics can all contribute to its development. While it is most common during adolescence, acne can affect adults as well. Proper skincare, topical treatments, and medical guidance can help reduce flare-ups and prevent scarring."
        : data.disease === "Eczema"
        ? "Eczema is a chronic skin condition that causes red, itchy, and inflamed patches of skin. It can appear on various parts of the body and may flare up periodically, often triggered by allergens, irritants, or stress. The affected skin can become dry, cracked, and sometimes prone to infection due to constant scratching. Symptoms may vary in severity from mild irritation to intense discomfort. Proper skincare, moisturizing, and avoiding triggers are key to managing flare-ups. Consulting a dermatologist can help in controlling symptoms and preventing complications."
        : "No disease detected";

      const saveRes = await fetch("http://localhost:5000/api/analysis", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id, image: uploadedUrl,
          disease: data.disease || "Normal", diseaseDescription,
          severity: data.severity || "Normal", layer: data.layer || "Not Detected",
        }),
      });
      const savedData = await saveRes.json();
      localStorage.setItem("analysisId", savedData?.data?._id);

    } catch (error) {
      console.error("Analyze Error:", error);
      showToast(error.message || "Something went wrong.", "error");
    } finally {
      setLoading(false);
    }
  };

  // ── SEND EMAIL WITH PDF ATTACHMENT ─────────────────────────────
  const sendReportEmail = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user?.email) {
      showToast("Please login to receive the report.", "warning");
      return;
    }

    // Generate PDF as base64
    const pdfBase64 = getPDFBase64({
      userName: user.name,
      disease: result?.disease,
      severity: result?.severity,
      layer: result?.layer,
      date: new Date().toLocaleDateString("en-PK", { year: "numeric", month: "long", day: "numeric" }),
    });

    const res = await fetch("http://localhost:5000/api/send-report", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        toEmail: user.email,
        userName: user.name,
        disease: result?.disease,
        severity: result?.severity || "Normal",
        layer: result?.layer || "None",
        pdfBase64,
      }),
    });

    const data = await res.json();
    if (data.success) {
      showToast("Report sent to your email successfully!", "success");
    } else {
      showToast("Failed to send email. Please try again.", "error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">

      {step === "upload" && (
        <div className="w-full max-w-md text-center">
          <h1 className="text-3xl font-bold mb-2">Let's start!</h1>
          <label className="block bg-[#1B5E44] hover:bg-[#154635] text-white py-4 rounded-xl cursor-pointer mb-4">
            Take Photo
            <input type="file" name="image" accept="image/*" capture="environment" hidden onChange={handleImage} />
          </label>
          <label className="block bg-[#1B5E44] hover:bg-[#154635] text-white py-4 rounded-xl cursor-pointer">
            Upload Photo
            <input type="file" name="image" accept="image/*" hidden onChange={handleImage} />
          </label>
        </div>
      )}

      {step === "result" && (
  <Result
    preview={preview}
    result={result}
    imageUrl={imageUrl}
    sendReportEmail={sendReportEmail}
    onBack={() => setStep("upload")}
  />
)}

{step === "suitable" && (
  <Result
    preview={preview}
    loading={loading}
    onGetResult={analyzeImage}
    onBack={() => setStep("upload")}
  />
)}

      {ToastComponent}
    </div>
  );
}