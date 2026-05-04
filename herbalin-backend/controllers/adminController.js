const Analysis = require("../models/Analysis");

exports.getDiseaseStats = async (req, res) => {
  try {
    const scans = await Analysis.find();

    if (!scans.length) {
      return res.json({
        acne: { total: 0, mild: 0, moderate: 0, severe: 0, monthly: Array(12).fill(0) },
        eczema: { total: 0, mild: 0, moderate: 0, severe: 0, monthly: Array(12).fill(0) }
      });
    }

    let acne = scans.filter(s => s.disease === "Acne");
    let eczema = scans.filter(s => s.disease === "Eczema");

    const getStats = (data) => {
      let mild = 0, moderate = 0, severe = 0;
      let monthly = Array(12).fill(0);

      data.forEach((item) => {
        if (item.severity === "Mild") mild++;
        else if (item.severity === "Moderate") moderate++;
        else if (item.severity === "Severe") severe++;

        if (item.createdAt) {
          const month = new Date(item.createdAt).getMonth();
          monthly[month]++;
        }
      });

      return {
        total: data.length,
        mild,
        moderate,
        severe,
        monthly,
      };
    };

    res.json({
      acne: getStats(acne),
      eczema: getStats(eczema),
    });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};