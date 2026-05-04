const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
const axios = require("axios");

dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */

app.use(
  cors({
    origin: [
    "http://localhost:3000",  // user panel
    "http://localhost:3001"   // admin panel
  ],
    credentials: true
  })
);

// app.js / server.js / index.js

app.use(express.json({ limit: "10mb" }));       // ← yeh add/update karo
app.use(express.urlencoded({ limit: "10mb", extended: true }));

const authRoutes = require("./routes/Auth"); // filename check karo
app.use("/api/auth", authRoutes);

/* ===================== DATABASE ===================== */

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

/* ===================== EMAIL TRANSPORT ===================== */

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/* ===================== CHATBOT AI (PRIMARY + BACKUP) ===================== */

const SKIN_SYSTEM_PROMPT = `
You are Herbalin Skin Assistant — a friendly, warm, and helpful assistant.

STRICT RULES:
- ONLY answer questions related to skin diseases and herbal/natural remedies for skin.
- Topics you CAN discuss: acne, eczema, psoriasis, dermatitis, rosacea, vitiligo, ringworm, hyperpigmentation, dark spots, dry skin, oily skin, sunburn, skin rashes, skin allergies, herbal skincare tips (aloe vera, neem, turmeric, tea tree oil, etc.).
- NEVER prescribe any medicine, dosage, or treatment plan.
- NEVER discuss: heart disease, cancer, pregnancy, diabetes, blood pressure, tumor, COVID, mental health, or any non-skin medical topic.
- If user asks anything unrelated to skin, politely and warmly say you are only a skin and herbal remedy guide.
- Keep responses friendly, simple, and easy to understand.
- Do not recommend visiting a doctor repeatedly — mention it only once if truly necessary.
- NEVER make exceptions. NEVER be helpful outside skin disease identification.
- Do NOT answer questions about math, exams, cars, food, logistics, or ANY other topic.
- Do NOT give study tips, life advice, or general health tips.
- Do NOT recommend any products, websites, or resources.
`;

const RESTRICTED_WORDS = [
  "heart", "cancer", "pregnancy", "pregnant", "diabetes",
  "bp", "blood pressure", "tumor", "covid", "corona",
  "mental", "depression", "anxiety", "kidney", "liver",
  "thyroid", "fever", "cough", "flu", "cholesterol", "hiv", "aids"
];

app.post("/api/chat", async (req, res) => {
  try {
    console.log("CHAT API HIT");

    const contents = req.body.contents;

    if (!contents || !Array.isArray(contents)) {
      return res.json({ reply: "Invalid chat format." });
    }

    // Extract last user message
    const lastUserMessage =
      contents.filter(c => c.role === "user").slice(-1)[0]?.parts?.[0]?.text || "";

    // Hard block restricted topics
    if (
      RESTRICTED_WORDS.some(word =>
        lastUserMessage.toLowerCase().includes(word)
      )
    ) {
      return res.json({
        reply:
          "I appreciate you reaching out! 🌿 However, I'm designed only to help with skin diseases and herbal remedies for skin. For other medical concerns, please consult a healthcare professional."
      });
    }

    // Gemini system instruction (injected as first user turn)
    const systemInstruction = {
      role: "user",
      parts: [{ text: SKIN_SYSTEM_PROMPT }]
    };

    // Gemini needs an ack turn after system instruction
    const systemAck = {
      role: "model",
      parts: [{ text: "Understood! I am Herbalin Skin Assistant. I will only guide about skin diseases and herbal remedies. How can I help you today?" }]
    };

    /* ===================== TRY GEMINI ===================== */
    try {
      const geminiResponse = await axios.post(
        `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
        {
          contents: [
            systemInstruction,
            systemAck,
            ...contents.slice(-10)
          ]
        }
      );

      const reply =
        geminiResponse.data.candidates[0].content.parts[0].text;

      return res.json({ reply });

    } catch (geminiError) {
      console.log("❌ Gemini failed → switching to backup");
    }

    /* ===================== BACKUP (GROQ) ===================== */
    try {
      const groqResponse = await axios.post(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          model: "llama-3.1-8b-instant",
          messages: [
            // System prompt inject in GROQ too
            { role: "system", content: SKIN_SYSTEM_PROMPT },
            ...contents.slice(-10).map(c => ({
              role: c.role === "model" ? "assistant" : "user",
              content: c.parts[0].text
            }))
          ]
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
            "Content-Type": "application/json"
          }
        }
      );

      const reply = groqResponse.data.choices[0].message.content;
      return res.json({ reply });

    } catch (err) {
      console.log("GROQ ERROR:", err.response?.data || err.message);
    }

    /* ===================== FINAL FALLBACK ===================== */
    return res.json({
      reply: "AI is currently busy. Please try again in a moment. 🌿"
    });

  } catch (error) {
    console.error("Chatbot Error:", error);
    res.status(500).json({ reply: "Chatbot service error." });
  }
});

// ===================== REPORT EMAIL WITH PDF =====================
// Replace your existing /api/send-report route with this in server.js

app.post("/api/send-report", async (req, res) => {
  try {
    const { toEmail, userName, disease, severity, layer, pdfBase64 } = req.body;

    if (!toEmail || !userName || !disease) {
      return res.json({ success: false, message: "Missing required fields." });
    }

    // Build attachments array — attach PDF if provided
    const attachments = pdfBase64
      ? [
          {
            filename: `Herbalin_Report_${userName}.pdf`,
            content: pdfBase64,
            encoding: "base64",
            contentType: "application/pdf",
          },
        ]
      : [];

    await transporter.sendMail({
      from: `"Herbalin Skin Analyzer" <${process.env.EMAIL_USER}>`,
      to: toEmail,
      subject: "Your Herbalin Skin Analysis Report",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 520px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
          
          <!-- Header -->
          <div style="background-color: #0B5D3B; padding: 24px 28px;">
            <h2 style="color: white; margin: 0; font-size: 22px;">Herbalin</h2>
            <p style="color: #a7f3d0; margin: 4px 0 0; font-size: 13px;">AI Skin Analyzer Report</p>
          </div>

          <!-- Body -->
          <div style="padding: 24px 28px;">
            <p style="font-size: 15px; color: #374151;">Hello <strong>${userName}</strong>,</p>
            <p style="font-size: 14px; color: #6b7280;">Your skin analysis report is ready. Please find the detailed PDF report attached to this email.</p>

            <!-- Summary Box -->
            <div style="background: #f9fafb; border-radius: 10px; padding: 16px 20px; margin: 20px 0; border: 1px solid #e5e7eb;">
              <p style="margin: 0 0 8px; font-size: 13px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.05em;">Summary</p>
              <table style="width: 100%; font-size: 14px; color: #374151;">
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Disease</td>
                  <td style="padding: 4px 0; font-weight: bold;">${disease}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Severity</td>
                  <td style="padding: 4px 0; font-weight: bold;">${severity || "Normal"}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #6b7280;">Skin Layer</td>
                  <td style="padding: 4px 0; font-weight: bold;">${layer || "None"}</td>
                </tr>
              </table>
            </div>

            <p style="font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; padding-top: 16px;">
              This report is for informational purposes only and does not constitute a medical diagnosis. Please consult a qualified dermatologist for professional advice.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f3f4f6; padding: 14px 28px; text-align: center;">
            <p style="margin: 0; font-size: 12px; color: #9ca3af;">Herbalin AI Skin Analyzer &nbsp;|&nbsp; www.herbalin.app</p>
          </div>

        </div>
      `,
      attachments,
    });

    res.json({ success: true, message: "Report sent successfully" });

  } catch (err) {
    console.log("Email Error:", err);
    res.status(500).json({ success: false, message: "Email sending failed" });
  }
});

/* ===================== HEALTH CHECK ===================== */

app.get("/", (req, res) => {
  res.send("Herbalin API is running 🚀");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static("uploads"));

const uploadRoutes = require("./routes/upload");
app.use("/api", uploadRoutes);

const analysisRoutes = require("./routes/analysisroute");
app.use("/api", analysisRoutes);

const admin = require("./routes/admin");
app.use("/api/admin", admin);

const userRoutes = require("./routes/user");
app.use("/api", userRoutes);

const contactRoutes = require("./routes/contact");
app.use("/api", contactRoutes);

const appointmentRoutes = require("./routes/book-appointment");
app.use("/api/book-appointment", appointmentRoutes);

// const adminRoutes = require("./routes/adminRoutes");
// app.use("/api/admin", adminRoutes);

/* ===================== SERVER START ===================== */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});

