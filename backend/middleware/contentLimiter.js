const rateLimit = require("express-rate-limit");

const contentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "development"
      ? 50000
      : 2000,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Content API request limit exceeded."
  }
});

module.exports = contentLimiter;