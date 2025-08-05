// backend/routes/paymentIntentRoutes.js
const express = require("express");
const axios = require("axios");
const { ethers } = require("ethers");
const PaymentIntent = require("../models/PaymentIntent");

const router = express.Router();
const FIAT = "inr";
const WALLET_ADDRESS = process.env.TEST_WALLET;

router.post("/create-payment-intent", async (req, res) => {
  try {
    const { orderId, amountFiat } = req.body;

    const { data } = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=${FIAT}`
    );
    const rate = data.ethereum[FIAT];
    const expectedEth = (amountFiat / rate).toFixed(8);

    const paymentIntent = await PaymentIntent.create({
      orderId,
      amountFiat,
      fiatCurrency: FIAT.toUpperCase(),
      expectedEth,
      walletAddress: WALLET_ADDRESS,
    });

    res.status(201).json({
      message: "Payment intent created",
      walletAddress: WALLET_ADDRESS,
      expectedEth,
    });
  } catch (err) {
    console.error("❌ Failed to create payment intent:", err.message);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
