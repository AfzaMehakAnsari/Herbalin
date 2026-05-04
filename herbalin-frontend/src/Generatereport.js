import jsPDF from "jspdf";

/* ═══════════════════════════════════════════════════════════════
   SHARED: Build the complete PDF doc object (analysis + treatment)
   Returns a jsPDF instance — caller decides save() vs output()
═══════════════════════════════════════════════════════════════ */
function buildFullReport({ userName, disease, severity, layer, date, temperament, remedies }) {
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const W = 210;
  const H = 297;
  const margin = 18;
  const reportId = "RPT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  const dateStr =
    date ||
    new Date().toLocaleDateString("en-PK", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  let y = 0;

  /* ── helper: section header ── */
  const sectionHeader = (title) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(30, 30, 30);
    doc.text(title, margin, y);
    y += 2;
    doc.setDrawColor(11, 93, 59);
    doc.setLineWidth(0.5);
    doc.line(margin, y, W - margin, y);
    y += 8;
  };

  /* ── helper: check page overflow ── */
  const checkPage = (neededHeight = 20) => {
    if (y + neededHeight > H - 50) {
      doc.addPage();
      y = 20;
    }
  };

  /* ════════════════════════════════
     1.  HEADER BANNER
  ════════════════════════════════ */
  doc.setFillColor(11, 93, 59);
  doc.rect(0, 0, W, 42, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("HERBALIN", margin + 13, 17);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Skin Analysis & Treatment Report", margin + 13, 25);

  doc.setFontSize(9);
  doc.text(`Generated: ${dateStr}`, margin + 13, 33);
  doc.text(`Report ID: ${reportId}`, W - margin - 38, 33);

  y = 55;

  /* ════════════════════════════════
     2.  PATIENT INFO
  ════════════════════════════════ */
  sectionHeader("Patient Information");

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(60, 60, 60);
  doc.text("Patient Name:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(userName || "N/A", margin + 38, y);

  y += 7;
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  doc.text("Analysis Date:", margin, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30, 30, 30);
  doc.text(dateStr, margin + 38, y);

  if (temperament) {
    y += 7;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.text("Temperament (Mizaj):", margin, y);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(11, 93, 59);
    doc.text(temperament, margin + 52, y);
  }

  y += 18;

  /* ════════════════════════════════
     3.  DIAGNOSIS RESULT
  ════════════════════════════════ */
  checkPage(60);
  sectionHeader("Diagnosis Result");

  // Disease banner
  const diseaseColor =
    disease === "Normal"
      ? [22, 163, 74]
      : disease === "Acne"
        ? [220, 38, 38]
        : disease === "Eczema"
          ? [234, 88, 12]
          : [107, 114, 128];

  doc.setFillColor(...diseaseColor);
  doc.roundedRect(margin, y - 5, W - margin * 2, 14, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(13);
  doc.text(
    disease === "Normal" ? "NO DISEASE DETECTED" : (disease?.toUpperCase() || "UNKNOWN"),
    W / 2,
    y + 4,
    { align: "center" }
  );
  y += 22;

  // Severity + Layer boxes
  const boxW = (W - margin * 2 - 8) / 2;

  // Severity
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y, boxW, 28, 3, 3, "F");
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.3);
  doc.roundedRect(margin, y, boxW, 28, 3, 3, "S");
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("SEVERITY LEVEL", margin + 4, y + 8);
  const sevColor =
    severity === "Mild"
      ? [22, 163, 74]
      : severity === "Moderate"
        ? [202, 138, 4]
        : severity === "Severe"
          ? [220, 38, 38]
          : [22, 163, 74];
  doc.setTextColor(...sevColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(14);
  doc.text(severity || "Normal", margin + 4, y + 20);

  // Layer
  const box2X = margin + boxW + 8;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(box2X, y, boxW, 28, 3, 3, "F");
  doc.setDrawColor(220, 220, 220);
  doc.roundedRect(box2X, y, boxW, 28, 3, 3, "S");
  doc.setTextColor(100, 100, 100);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("SKIN LAYER AFFECTED", box2X + 4, y + 8);
  doc.setTextColor(11, 93, 59);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(12);
  const layerText =
    !layer || layer === "Not Detected"
      ? "None"
      : layer.toLowerCase().includes("epidermis")
        ? "Epidermis (1st Layer)"
        : layer.toLowerCase().includes("dermis")
          ? "Dermis (2nd Layer)"
          : layer;
  doc.text(layerText, box2X + 4, y + 20);

  y += 38;

  /* ════════════════════════════════
     4.  ABOUT THE CONDITION
  ════════════════════════════════ */
  if (disease && disease !== "Normal") {
    checkPage(40);
    sectionHeader("About the Condition");

    const description =
      disease === "Acne"
        ? "Acne is a common skin condition that occurs when hair follicles become clogged with oil, dead skin cells, and bacteria. It can cause a variety of blemishes, including pimples, blackheads, whiteheads, and sometimes painful cysts or nodules. Acne often appears on the face, chest, back, and shoulders, where oil glands are most active. Hormonal changes, stress, diet, and genetics can all contribute to its development. While it is most common during adolescence, acne can affect adults as well. Proper skincare, topical treatments, and medical guidance can help reduce flare-ups and prevent scarring."
        : disease === "Eczema"
          ? "Eczema is a chronic skin condition that causes red, itchy, and inflamed patches of skin. It can appear on various parts of the body and may flare up periodically, often triggered by allergens, irritants, or stress. The affected skin can become dry, cracked, and sometimes prone to infection due to constant scratching. Symptoms may vary in severity from mild irritation to intense discomfort. Proper skincare, moisturizing, and avoiding triggers are key to managing flare-ups. Consulting a dermatologist can help in controlling symptoms and preventing complications."
          : "Condition details are not available at this time.";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    const descLines = doc.splitTextToSize(description, W - margin * 2);
    doc.text(descLines, margin, y);
    y += descLines.length * 5.5 + 10;
  }

  /* ════════════════════════════════
     5.  CLINICAL GUIDANCE
  ════════════════════════════════ */
  if (severity && severity !== "Normal") {
    checkPage(40);
    sectionHeader("Clinical Guidance");

    const guidance =
      severity === "Mild"
        ? "This is a low-risk condition requiring minor care. Maintain a consistent skincare routine, use gentle cleansers, and apply appropriate topical treatments. Monitor for any changes in the condition."
        : severity === "Moderate"
          ? "This condition requires proper monitoring and treatment. We recommend consulting a dermatologist for a tailored treatment plan. Avoid known triggers and maintain skin hydration."
          : "Immediate dermatologist attention is required. Do not self-medicate. Seek professional medical advice as soon as possible to prevent complications and further skin damage.";

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    const gLines = doc.splitTextToSize(guidance, W - margin * 2);
    doc.text(gLines, margin, y);
    y += gLines.length * 5.5 + 10;
  }

  /* ════════════════════════════════
     6.  TREATMENT PLAN
         (remedies + diet — only when treatment was done)
  ════════════════════════════════ */
  if (remedies && remedies.length > 0) {
    const plan = remedies[0];

    const remedyItems = [1, 2, 3, 4, 5]
      .map((n) => plan[`Remedy/Precaution(${n})`])
      .filter(Boolean);

    const dietRows = [
      { label: "Breakfast", key: "Diet(Breakfast)" },
      { label: "Lunch & Dinner", key: "Diet(Lunch and Dinner)" },
      { label: "Fruits", key: "Diet(Fruits)" },
      { label: "Salad", key: "Diet(Salad)" },
      { label: "Drinks", key: "Diet(Drinks)" },
      { label: "Qahwa", key: "Diet(Qahwa)" },
      { label: "Spices", key: "Diet(Spices)" },
    ].filter(({ key }) => plan[key]);

    /* ── 6a. Herbal Remedies / Precautions ── */
    if (remedyItems.length > 0) {
      checkPage(30);
      sectionHeader("Herbal Remedies & Precautions");

      remedyItems.forEach((item, idx) => {
        const bullet = `${idx + 1}.  ${item}`;
        const lines = doc.splitTextToSize(bullet, W - margin * 2 - 6);
        checkPage(lines.length * 6 + 4);

        doc.setFont("helvetica", "normal");
        doc.setFontSize(10);
        doc.setTextColor(50, 50, 50);
        doc.text(lines, margin + 3, y);
        y += lines.length * 6 + 3;
      });

      y += 6;
    }

    /* ── 6b. Diet Plan ── */
    if (dietRows.length > 0) {
      checkPage(30);
      sectionHeader("Recommended Diet Plan");

      dietRows.forEach(({ label, key }) => {
        const val = plan[key];
        const fullLine = `${label}:  ${val}`;
        const lines = doc.splitTextToSize(fullLine, W - margin * 2 - 6);
        checkPage(lines.length * 6 + 6);

        // Label in bold green, rest normal
        doc.setFont("helvetica", "bold");
        doc.setFontSize(10);
        doc.setTextColor(11, 93, 59);
        doc.text(`${label}:`, margin + 3, y);

        doc.setFont("helvetica", "normal");
        doc.setTextColor(60, 60, 60);
        const valLines = doc.splitTextToSize(val, W - margin * 2 - 38);
        doc.text(valLines, margin + 38, y);
        y += Math.max(lines.length, valLines.length) * 6 + 4;
      });

      y += 4;
    }
  }

  /* ════════════════════════════════
     7.  FOOTER (every page)
  ════════════════════════════════ */
  const totalPages = doc.internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);

    const footerY = H - 40;
    doc.setFillColor(248, 249, 250);
    doc.rect(0, footerY, W, 40, "F");
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.3);
    doc.line(0, footerY, W, footerY);

    doc.setFont("helvetica", "bolditalic");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text("⚕  Medical Disclaimer", margin, footerY + 9);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(7.5);
    const disclaimer =
      "This report is generated by an AI-powered skin analysis tool and is intended for informational purposes only. It does not constitute a medical diagnosis. Please consult a qualified dermatologist for professional advice.";
    const dLines = doc.splitTextToSize(disclaimer, W - margin * 2);
    doc.text(dLines, margin, footerY + 16);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(8);
    doc.setTextColor(11, 93, 59);
    doc.text("Herbalin — AI Skin Analyzer", margin, footerY + 34);

    doc.setFont("helvetica", "normal");
    doc.setTextColor(150, 150, 150);
    doc.text(`Page ${i} of ${totalPages}`, W / 2, footerY + 34, { align: "center" });
    doc.text("www.herbalin.app", W - margin - 28, footerY + 34);
  }

  return doc;
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT 1 — Original analysis-only report (no treatment)
             Used by Result.js "Download PDF" button
═══════════════════════════════════════════════════════════════ */
export function generateSkinReport({ userName, disease, severity, layer, date }) {
  const doc = buildFullReport({ userName, disease, severity, layer, date });
  const reportId = "RPT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  doc.save(`Herbalin_Report_${userName || "Patient"}_${reportId}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT 2 — Full report WITH treatment (remedies + diet)
             Download version — used after temperament popup
═══════════════════════════════════════════════════════════════ */
export function generateFullTreatmentReport({ userName, disease, severity, layer, date, temperament, remedies }) {
  const doc = buildFullReport({ userName, disease, severity, layer, date, temperament, remedies });
  const reportId = "RPT-" + Math.random().toString(36).substring(2, 8).toUpperCase();
  doc.save(`Herbalin_TreatmentReport_${userName || "Patient"}_${reportId}.pdf`);
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT 3 — Full report base64 (no download) — for email
             Used by both Result.js and RemediesResult.js
═══════════════════════════════════════════════════════════════ */
export function getFullReportBase64({ userName, disease, severity, layer, date, temperament, remedies }) {
  const doc = buildFullReport({ userName, disease, severity, layer, date, temperament, remedies });
  return doc.output("datauristring").split(",")[1];
}

/* ═══════════════════════════════════════════════════════════════
   EXPORT 4 — Original base64 analysis-only (backward compat)
═══════════════════════════════════════════════════════════════ */
export function getPDFBase64({ userName, disease, severity, layer, date }) {
  return getFullReportBase64({ userName, disease, severity, layer, date });
}