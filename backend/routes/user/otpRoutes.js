//routes/otpRoutes.js

const express = require("express");
const router = express.Router();

const otpController = require("../../controllers/user/otpController");

router.post("/verify-email", otpController.verifyEmailOTP);
router.post("/verify-mobile", otpController.verifyMobileOTP);

router.post("/resend-email-otp", otpController.resendEmailOTP);

router.post("/resend-mobile-otp", otpController.resendMobileOTP);

router.post("/send-login-otp", otpController.sendLoginOTP);

router.post("/login-with-otp", otpController.loginWithOTP);

module.exports = router;