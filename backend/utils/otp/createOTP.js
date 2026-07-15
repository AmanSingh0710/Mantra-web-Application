
//utils/otp/createOTP.js
const bcrypt = require("bcryptjs");
const Otp = require("../../models/Otp");
const generateOTP = require("../generateOTP");
const { sendOTPEmail } = require("../mailer");
const { sendMobileOTP } = require("../sendMobileOTP");


const createOTP = async ({userId, userModel = "User", type, destination }) => {

    console.log("========== CREATE OTP ==========");
    console.log({ userId, type, destination });

    const otp = generateOTP();
    console.log("OTP Generated");

    const hashedOtp = await bcrypt.hash(otp, 10);
    console.log("OTP Hashed");

    await Otp.deleteMany({
        userId,
        type
    });
    console.log(" Old OTP Deleted");

    await Otp.create({
        userId,
        userModel,
        otp: hashedOtp,
        type,
        destination,
        expiresAt: Date.now() + 5 * 60 * 1000
    });
    console.log("OTP Saved Successfully");

    if (type === "email" || type === "login" || type === "reset-password") {
        console.log(" Sending Email...");
        await sendOTPEmail(destination, otp);
        console.log("Email Sent");
    }
};

module.exports = createOTP;