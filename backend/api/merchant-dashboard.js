const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");
const authMiddleware = require("../middleware/authMiddleware");

// Protected dashboard route
router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const payments = await Payment.find().sort({ timestamp: -1 }).limit(20);
    res.json({ success: true, payments });
  } catch (err) {
    console.error("Error fetching payments:", err);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;