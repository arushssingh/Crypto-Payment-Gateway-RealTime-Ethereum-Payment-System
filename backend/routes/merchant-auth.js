const express = require("express");
const router = express.Router();
const Merchant = require("../models/Merchant");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Merchant Signup
router.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existing = await Merchant.findOne({ email });
    if (existing) return res.status(400).json({ error: "Merchant already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const merchant = await Merchant.create({ email, passwordHash });

    res.json({ message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ error: "Signup failed" });
  }
});

// Merchant Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const merchant = await Merchant.findOne({ email });
    if (!merchant) return res.status(400).json({ error: "Invalid credentials" });

    const match = await merchant.comparePassword(password);
    if (!match) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ merchantId: merchant._id }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: "Login failed" });
  }
});

module.exports = router;