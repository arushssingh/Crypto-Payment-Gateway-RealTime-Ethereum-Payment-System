const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Merchant = require("../models/Merchant");

const JWT_SECRET = process.env.JWT_SECRET || "your_fallback_secret_key";

// Register merchant
router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingMerchant = await Merchant.findOne({ email });
    if (existingMerchant) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const newMerchant = new Merchant({ email, passwordHash });
    await newMerchant.save();

    res.status(201).json({ success: true, message: "Merchant registered successfully" });
  } catch (err) {
    console.error("❌ Registration error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Login merchant
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const merchant = await Merchant.findOne({ email });
    if (!merchant) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const isMatch = await merchant.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }

    const token = jwt.sign({ merchantId: merchant._id }, JWT_SECRET, { expiresIn: "2d" });

    res.json({ success: true, token });
  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;