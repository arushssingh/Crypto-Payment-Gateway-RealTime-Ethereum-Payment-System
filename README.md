# 🚀 Crypto Payment Gateway

A secure, real-time Ethereum (Sepolia) payment gateway for merchants to receive crypto payments in INR or USD, featuring a modern merchant dashboard with live payment notifications, automatic transaction updates, and standard security measures.

⸻

✨ Features
	•	💳 Ethereum Payments – Receive ETH on Sepolia testnet with live INR/USD conversion.  
	•	⚡ Real-time Dashboard – Merchants see payments instantly via Socket.IO notifications.  
	•	🔒 Secure Authentication – Merchant login with JWT-based auth and password hashing.  
	•	🔔 Live Payment Alerts – Dashboard updates instantly when a customer pays.  
	•	📜 Transaction History – View recent payments with transaction hashes linked to Etherscan.  
	•	🛡 Security – .env secrets, input validation, and secure password storage with bcrypt.  

⸻

🛠 Tech Stack

Frontend: HTML, CSS, JavaScript  
Backend: Node.js, Express.js  
Blockchain: Ethereum (Sepolia Testnet), Ethers.js  
Database: MongoDB (Mongoose)  
Realtime: Socket.IO  
API: CoinGecko (live ETH price conversion)  
Auth: JWT, bcrypt.js  
Environment: dotenv  

⸻

📂 Project Structure

crypto-gateway/  
│-- backend/  
│   │-- models/       # Mongoose models (Merchant, Payment, Order)  
│   │-- routes/       # API routes  
│   │-- listener.js   # Blockchain payment listener  
│   │-- server.js     # Express server setup  
│-- public/           # Frontend HTML, CSS, JS  
│-- .env              # Environment variables (not in repo)  
│-- .gitignore  
│-- package.json  



⸻

🔮 Future Improvements  
	•	Support multiple blockchains (Polygon, BSC, etc.)  
	•	Email/SMS notifications for merchants  
	•	Payment refund system  
	•	Multi-currency wallet support  

