const GRCCounter = require("../models/GRCCounter");

// Get current GRC number
exports.getCounter = async (req, res) => {
  try {
    const counterName = 'grcNo_zoox';
    let counter = await GRCCounter.findOne({ name: counterName });
    if (!counter) {
      counter = new GRCCounter({ name: counterName, sequence_value: 1 });
      await counter.save();
    }
    res.json({ sequence_value: counter.sequence_value });
  } catch (error) {
    console.error("GRC Error:", error);
    res.status(500).json({ error: error.message });
  }
};

// Increment GRC number
exports.incrementCounter = async (req, res) => {
  try {
    const counterName = 'grcNo_zoox';
    let counter = await GRCCounter.findOneAndUpdate(
      { name: counterName },
      { $inc: { sequence_value: 1 }, $setOnInsert: { name: counterName } },
      { new: true, upsert: true }
    );
    res.json({ sequence_value: counter.sequence_value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Reset GRC number
exports.resetCounter = async (req, res) => {
  try {
    const counterName = 'grcNo_zoox';
    const { sequence_value } = req.body;
    const val = sequence_value || 1;
    let counter = await GRCCounter.findOneAndUpdate(
      { name: counterName },
      { sequence_value: val, $setOnInsert: { name: counterName } },
      { new: true, upsert: true }
    );
    res.json({ sequence_value: counter.sequence_value, message: "GRC Number reset successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
