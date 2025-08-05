// listener.js
const { ethers, formatEther } = require("ethers");
const axios = require("axios");
require("dotenv").config();
const { io } = require("socket.io-client");
const socket = io("http://localhost:3000"); // change port if needed

// MongoDB
const connectDB = require("./db");
const Payment = require("./models/Payment");
const Order = require("./models/Order");
connectDB();

const RPC_URL = process.env.SEPOLIA_RPC_URL;
const WALLET_ADDRESS = process.env.TEST_WALLET.toLowerCase();
const FIAT = 'inr'; // Change to 'usd' if needed

const provider = new ethers.JsonRpcProvider(RPC_URL);

console.log(`🔄 Listening for incoming payments to ${WALLET_ADDRESS}...\n`);

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms)); // ✅ Delay function

// CoinGecko conversion function
async function getEthToFiatRate(fiat = 'inr') {
  try {
    const url = `https://api.coingecko.com/api/v3/simple/price`;
    const response = await axios.get(url, {
      params: {
        ids: 'ethereum',
        vs_currencies: fiat.toLowerCase()
      }
    });

    return response.data.ethereum[fiat.toLowerCase()];
  } catch (err) {
    console.error("❌ Failed to fetch ETH price from CoinGecko:", err.message);
    return null;
  }
}

// Block listener
provider.on("block", async (blockNumber) => {
  console.log(`🧱 New block: ${blockNumber}`);

  try {
    const block = await provider.getBlock(blockNumber);
    if (!block?.transactions?.length) {
      return console.log("📭 No transactions in this block.\n");
    }

    for (const txHash of block.transactions) {
      try {
        await sleep(100); // ✅ Add delay between each call

        const tx = await provider.getTransaction(txHash);
        const to = tx.to ? tx.to.toLowerCase() : null;

        if (to === WALLET_ADDRESS && typeof tx.value === 'bigint' && tx.value > 0n) {
          const valueEth = formatEther(tx.value);
          const rate = await getEthToFiatRate(FIAT);

          if (rate) {
            const fiatAmount = (parseFloat(valueEth) * rate).toFixed(8);

            console.log("\n✅ Payment received!");
            console.log(`🪙 Amount: ${valueEth} ETH`);
            console.log(`💱 ≈ ${fiatAmount} ${FIAT.toUpperCase()}`);
            console.log(`📨 From: ${tx.from}`);
            console.log(`🔗 TX Hash: ${tx.hash}\n`);

            // ✅ Find matching pending order
            const matchingOrder = await Order.findOne({
              status: "pending",
              amountFiat: { $lte: parseFloat(fiatAmount) }
            });

            // ✅ Save payment
            await Payment.create({
              from: tx.from,
              to: tx.to,
              valueEth,
              valueFiat: fiatAmount,
              fiatCurrency: FIAT.toUpperCase(),
              txHash: tx.hash,
              orderId: matchingOrder?.orderId || null,
            });

            // ✅ Mark order as paid
            if (matchingOrder) {
              matchingOrder.status = "paid";
              await matchingOrder.save();

              // ✅ Emit real-time update to dashboard
              socket.emit("newPayment", {
                orderId: matchingOrder.orderId,
                from: tx.from,
                amountEth: valueEth,
                amountInr: fiatAmount,
                txHash: tx.hash,
                timestamp: new Date().toISOString()
              });
            }
          }
        }

      } catch (err) {
        console.error("⚠️ Failed to process transaction:", err.message);
      }
    }
  } catch (err) {
    console.error("❌ Error reading block:", err.message);
  }
});
