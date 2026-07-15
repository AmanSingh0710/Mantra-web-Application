//BACKEND/tests/setup.js

const mongoose = require("mongoose");
const connectDB = require("../config/db");

beforeAll(async () => {
  console.log("Connecting to DB...");
  await connectDB();
  console.log("DB State:", mongoose.connection.readyState);
});

afterAll(async () => {
  await mongoose.connection.close();
});