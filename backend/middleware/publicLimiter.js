const rateLimit = require("express-rate-limit");

const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "development"
      ? 50000
      : 1000,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Public API request limit exceeded."
  }
});

module.exports = publicLimiter;