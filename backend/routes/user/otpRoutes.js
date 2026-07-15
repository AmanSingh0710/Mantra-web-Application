//routes/otpRoutes.js

const express = require("express");
const router = express.Router();
const otpController = require("../../controllers/user/otpController");
const authLimiter = require("../../middleware/authLimiter");
const otpLimiter = require("../../middleware/otpLimiter");

router.post("/verify-email", authLimiter, otpLimiter, otpController.verifyEmailOTP);

router.post("/verify-mobile", authLimiter, otpLimiter, otpController.verifyMobileOTP);

router.post("/resend-email-otp", authLimiter, otpLimiter,otpController.resendEmailOTP);

router.post("/resend-mobile-otp", authLimiter, otpLimiter,otpController.resendMobileOTP);

router.post("/send-login-otp", authLimiter, otpLimiter,otpController.sendLoginOTP);

router.post("/login-with-otp", authLimiter, otpLimiter,otpController.loginWithOTP);

module.exports = router;