// backend/models/PaymentIntent.js
const mongoose = require("mongoose");

const paymentIntentSchema = new mongoose.Schema({
  orderId: String,
  amountFiat: Number,
  fiatCurrency: String,
  expectedEth: String,
  walletAddress: String,
  status: {
    type: String,
    enum: ["PENDING", "PAID"],
    default: "PENDING"
  },
  txHash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("PaymentIntent", paymentIntentSchema);
