const express = require("express");
const nodemailer = require("nodemailer");
const PDFDocument = require("pdfkit");
const path = require("path");

const router = express.Router();

router.post("/", async (req, res) => {
  const { toEmail, userName, disease, severity, layer } = req.body;

  try {
    const doc = new PDFDocument({ margin: 30 });
    let buffers = [];

    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfData = Buffer.concat(buffers);

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: toEmail,
        subject: "Herbalin – AI Skin Scan Medical Report",
        text: "Your skin scan medical report is attached as a PDF.",
        attachments: [
          {
            filename: "Herbalin_Skin_Scan_Report.pdf",
            content: pdfData,
          },
        ],
      };

      await transporter.sendMail(mailOptions);
      res.json({ success: true });
    });

    /* ================= HEADER ================= */
    doc.rect(0, 0, 612, 90).fill("#1B5E44");

    const logoPath = path.join(__dirname, "../assets/herbalin_logo.png");
    doc.image(logoPath, 50, 20, { width: 100 });

    doc
      .fillColor("white")
      .fontSize(22)
      .text("Herbalin AI Skin Scan Report", 130, 35);

    doc.moveDown(4);

    /* ================= USER INFO ================= */
    doc.fillColor("#000");
    doc.fontSize(14).text(`Patient Name: ${userName}`);
    doc.text(`Report Date: ${new Date().toDateString()}`);
    doc.moveDown();

    /* ================= DIAGNOSIS ================= */
    doc.fontSize(16).fillColor("#1B5E44").text("Clinical Assessment");
    doc.moveDown(0.5);

    doc.fontSize(13).fillColor("#000").text(
      `Based on the AI-powered skin image analysis, the detected condition is ${disease} with a severity level classified as ${severity}. The affected skin layer identified during the analysis is the ${layer}.`
    );

    doc.moveDown();

    /* ================= DESCRIPTION ================= */
    doc.fontSize(16).fillColor("#1B5E44").text("Condition Overview");
    doc.moveDown(0.5);

    doc.fontSize(13).fillColor("#000").text(
      `${disease} is a dermatological condition that affects the skin's normal structure and barrier function. In moderate stages, symptoms may include redness, irritation, inflammation, dryness, and discomfort. If left unmanaged, the condition may worsen over time and impact overall skin health. Early identification allows timely care and preventive measures.`
    );

    doc.moveDown();

    /* ================= RECOMMENDATION ================= */
    doc.fontSize(16).fillColor("#1B5E44").text("General Recommendations");
    doc.moveDown(0.5);

    doc.fontSize(13).fillColor("#000").list([
      "Maintain proper skin hygiene and moisturization",
      "Avoid known irritants or allergens",
      "Use dermatologist-recommended skincare products",
      "Consult a certified dermatologist for medical treatment",
    ]);

    doc.moveDown();

    /* ================= DISCLAIMER ================= */
    doc.fontSize(12).fillColor("gray").text(
      "Disclaimer: This report is generated using an AI-based system and is intended for informational purposes only. It should not be considered a substitute for professional medical advice, diagnosis, or treatment.",
      { align: "justify" }
    );

    /* ================= FOOTER ================= */
    doc.rect(0, 750, 612, 50).fill("#1B5E44");
    doc
      .fillColor("black")
      .fontSize(11)
      .text(
        "Thank you for choosing Herbalin – Your AI Skin Care Partner",
        50,
        765,
        { align: "center" }
      );

    doc.end();

  } catch (err) {
    console.error("PDF Email Error:", err);
    res.json({ success: false, error: err.message });
  }
});

module.exports = router;
