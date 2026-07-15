const rateLimit = require("express-rate-limit");

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,

  max:
    process.env.NODE_ENV === "development"
      ? 5000
      : 500,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Admin request limit exceeded."
  }
});

module.exports = adminLimiter;