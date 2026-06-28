const rateLimit = require("express-rate-limit");

const otpLimiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 3,

    standardHeaders: true,
    legacyHeaders: false,

    message: {
        success: false,
        message: "Too many OTP requests. Please try again after 10 minutes."
    }
});

module.exports = otpLimiter;