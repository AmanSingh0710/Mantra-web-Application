const rateLimit = require("express-rate-limit");

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour

  max:
    process.env.NODE_ENV === "development"
      ? 1000
      : 100,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message:
      "Upload limit exceeded. Please try again later."
  }
});

module.exports = uploadLimiter;