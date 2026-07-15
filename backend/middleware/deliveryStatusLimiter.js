const rateLimit = require("express-rate-limit");

const deliveryStatusLimiter = rateLimit({
  windowMs: 5 * 60 * 1000,

  max: 30,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    success: false,
    message: "Too many status updates. Please try again later."
  }
});

module.exports = deliveryStatusLimiter;