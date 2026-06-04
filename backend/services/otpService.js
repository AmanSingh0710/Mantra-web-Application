//services/otpService.js

const Otp = require("../models/Otp");

exports.saveOTP = async (userId, otp, type) => {
  await Otp.create({
    userId,
    otp,
    type,
    expiresAt: Date.now() + 5 * 60 * 1000
  });
};