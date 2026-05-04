const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

router.post("/upload", upload.single("image"), async (req, res) => {
  try {

    res.json({
      imageUrl: req.file.path
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;