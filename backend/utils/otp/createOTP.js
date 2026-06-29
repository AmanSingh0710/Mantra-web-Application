
//utils/otp/createOTP.js
const bcrypt = require("bcryptjs");
const Otp = require("../../models/Otp");
const generateOTP = require("../generateOTP");
const { sendOTPEmail } = require("../mailer");
const { sendMobileOTP } = require("../sendMobileOTP");

const createOTP = async ({
    userId,
    userModel = "User",
    type,
    destination
}) => {

    const otp = generateOTP();

    const hashedOtp = await bcrypt.hash(otp, 10);

    await Otp.deleteMany({
        userId,
        type
    });

    await Otp.create({
        userId,
        userModel,
        otp: hashedOtp,
        type,
        destination,
        expiresAt: Date.now() + 5 * 60 * 1000
    });

    if (type === "email" || type === "login" || type === "reset-password") {
        await sendOTPEmail(destination, otp);
    }

    if (type === "mobile") {
        await sendMobileOTP(destination, otp);
    }

    return true;
};

module.exports = createOTP;