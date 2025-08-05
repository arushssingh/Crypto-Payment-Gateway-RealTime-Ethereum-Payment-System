const express = require("express");
const axios = require("axios");
const cors = require("cors");
require("dotenv").config();

const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  cors: {
    origin: "*"
  }
});

// Attach io to app for use in other files
app.set("io", io);

io.on("connection", (socket) => {
  console.log("📡 New WebSocket connection:", socket.id);
});

app.use(cors());
app.use(express.json()); // allows POST JSON body
app.use(express.static(__dirname + '/public'));

// Load wallet from .env
const WALLET_ADDRESS = process.env.TEST_WALLET || "0x2Ea2Bc226DbDf89c7F44bd7a2E3e7E0A51BA4428";

// API routes
app.use("/api", require("./api/check-payment-status"));
app.use("/api", require("./api/create-payment-intent"));
app.use("/api", require("./api/merchant-dashboard"));
app.use("/auth", require("./routes/merchant-auth"));
app.use("/api/auth", require("./api/auth"));
app.use("/api/dev-register", require("./routes/dev-register"));

// GET endpoint to return ETH equivalent of fixed INR price
app.get("/get-price", async (req, res) => {
  const INR_PRICE = 9;

  try {
    const priceRes = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=inr"
    );

    const ethInINR = priceRes.data.ethereum.inr;
    const ethAmount = (INR_PRICE / ethInINR).toFixed(6);

    res.json({
      ethInINR,
      ethAmount,
      walletAddress: WALLET_ADDRESS,
    });
  } catch (err) {
    console.error("❌ Error fetching ETH price:", err.message);
    res.status(500).json({ error: "Failed to fetch ETH price" });
  }
});

server.listen(3000, () => console.log("🚀 Server running on port 3000"));