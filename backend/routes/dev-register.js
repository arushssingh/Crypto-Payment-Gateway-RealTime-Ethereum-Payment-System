// routes/dev-register.js
const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const Merchant = require("../models/Merchant");

router.post("/", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password required" });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await Merchant.create({ email, passwordHash });

    res.json({ success: true, message: "Merchant created successfully" });
  } catch (err) {
    console.error("❌ Error in dev-register:", err);
    res.status(500).json({ success: false, error: "Registration failed" });
  }
});

module.exports = router;