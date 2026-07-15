const rateLimit = require("express-rate-limit");

const locationLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,

  max: process.env.NODE_ENV === "development"
    ? 5000
    : 300,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Location update limit exceeded."
  }
});

module.exports = locationLimiter;