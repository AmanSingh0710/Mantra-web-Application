const rateLimit = require("express-rate-limit");

const deliveryLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute

  max: process.env.NODE_ENV === "development"
    ? 1000
    : 120,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many requests. Please try again in a minute."
  }
});

module.exports = deliveryLimiter;