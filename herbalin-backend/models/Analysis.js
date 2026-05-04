const mongoose = require("mongoose");

const analysisSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  image: {
    type: String,
    required: true
  },

  disease: {
    type: String,
    required: true
  },

  diseaseDescription: {
    type: String
  },

  severity: {
    type: String,
    default: "Normal"
  },

  layer: {
    type: String,
    default: "Not Detected"
  },

  temperament: {
    type: String
  },

  temperamentAnswers: {
    type: Object
  },

  remedies: {
    type: Array
  }

}, { timestamps: true });

module.exports = mongoose.model("Analysis", analysisSchema);