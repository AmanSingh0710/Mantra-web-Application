require("dotenv").config();
//backend/server.js
const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");
const app = require("./app");

connectDB();

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});



const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});