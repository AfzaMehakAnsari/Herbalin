const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// SAVE REVIEW
router.post("/contact", async (req, res) => {
  try {
    const { name, email, company, phone, message, rating } = req.body;

    const newReview = new Review({
      name,
      email,
      profession: company,
      phone,
      message,
      rating
    });

    await newReview.save();

    res.json({ success: true });
  } catch (err) {
    res.json({ success: false, message: "Error saving review" });
  }
});

// GET REVIEWS
router.get("/reviews", async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: "Error fetching reviews" });
  }
});

module.exports = router;