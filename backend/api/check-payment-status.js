const express = require("express");
const router = express.Router();
const Payment = require("../models/Payment");

router.post("/check-payment-status", async (req, res) => {
  const { orderId } = req.body;

  if (!orderId) {
    return res.status(400).json({ error: "Missing orderId" });
  }

  try {
    const payment = await Payment.findOne({ orderId });
    if (payment) {
      return res.json({ paid: true, payment });
    } else {
      return res.json({ paid: false });
    }
  } catch (err) {
    console.error("❌ Error checking payment status:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
