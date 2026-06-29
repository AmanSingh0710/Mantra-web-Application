//utils/otp/verifyOTP.js

const bcrypt = require("bcryptjs");
const Otp = require("../../models/Otp");

const verifyOTP = async ({ userId, otp, type }) => {

    const record = await Otp.findOne({
        userId,
        type
    }).sort({ createdAt: -1 });

    if (!record) {
        throw new Error("OTP not found");
    }

    if (record.isUsed) {
        throw new Error("OTP already used");
    }

    if (record.expiresAt < Date.now()) {
        throw new Error("OTP expired");
    }

    const isMatch = await bcrypt.compare(
        otp,
        record.otp
    );

    if (!isMatch) {

        record.attempts += 1;

        await record.save();

        if (record.attempts >= 5) {

            await Otp.deleteOne({
                _id: record._id
            });

            throw new Error(
                "Maximum OTP attempts exceeded. Request new OTP."
            );

        }

        throw new Error("Invalid OTP");
    }

    record.isUsed = true;

    await record.save();

    return record;
};

module.exports = verifyOTP;