const express = require("express");
const router = express.Router();

router.post("/create-payment-intent", async (req, res) => {
  const { orderId, amountFiat } = req.body;

  if (!orderId || !amountFiat) {
    return res.status(400).json({ error: "Missing orderId or amountFiat" });
  }

  // Simulated ETH rate — replace with real-time fetch later
  const ethInINR = 300000;
  const ethAmount = (amountFiat / ethInINR).toFixed(6);

  res.json({
    orderId,
    amountFiat,
    ethAmount,
    walletAddress: process.env.TEST_WALLET || "0xYourWallet",
  });
});

module.exports = router;
