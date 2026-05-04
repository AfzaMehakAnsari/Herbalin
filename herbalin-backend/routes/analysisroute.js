const express = require("express");
const router = express.Router();
const Analysis = require("../models/Analysis");

// ================= SAVE ANALYSIS =================
router.post("/analysis", async (req, res) => {
  try {
    const newAnalysis = new Analysis(req.body);
    const saved = await newAnalysis.save();

    res.status(201).json({
      success: true,
      data: saved
    });

  } catch (err) {
    console.error("DB SAVE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= UPDATE ANALYSIS =================
router.put("/analysis/:id", async (req, res) => {
  try {

    const updated = await Analysis.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({
        success: false,
        message: "Analysis not found"
      });
    }

    res.json({
      success: true,
      data: updated
    });

  } catch (err) {
    console.error("UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= GET USER HISTORY =================
router.get("/analysis/user/:userId", async (req, res) => {
  try {
    const history = await Analysis.find({
      userId: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: history
    });

  } catch (err) {
    console.error("Fetch Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// ================= DELETE =================
router.delete("/analysis/:id", async (req, res) => {
  try {
    await Analysis.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: "Deleted successfully"
    });

  } catch (err) {
    console.error("Delete Error:", err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

module.exports = router;