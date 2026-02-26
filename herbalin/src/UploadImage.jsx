import React, { useState } from "react";

function UploadImage() {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState("");

  const handleSubmit = async () => {
    if (!file) return alert("Select image");

    const formData = new FormData();
    formData.append("image", file);

    const res = await fetch("http://localhost:8000/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.prediction);
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleSubmit}>Analyze</button>

      {result && <h2>Result: {result}</h2>}
    </div>
  );
}

export default UploadImage;
