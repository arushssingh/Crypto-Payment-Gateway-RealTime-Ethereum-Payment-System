const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  from: String,
  to: String,
  valueEth: String,
  valueFiat: String,
  fiatCurrency: String,
  txHash: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Payment', paymentSchema);
