//controllers/otpController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const generateOTP = require("../../utils/generateOTP");
const { sendOTPEmail } = require("../../utils/mailer");
const { sendMobileOTP } = require("../../utils/sendMobileOTP");
const Otp = require("../../models/Otp");
const User = require("../../models/User");

// ✅ VERIFY EMAIL OTP
exports.verifyEmailOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        // ✅ Find latest OTP record
        const record = await Otp.findOne({
            userId,
            type: "email"
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (record.isUsed) {
            return res.status(400).json({
                success: false,
                message: "OTP has already been used"
            });
        }

        // ✅ Compare hashed OTP
        const isMatch = await bcrypt.compare(otp, record.otp);

        if (!isMatch) {

            record.attempts += 1;
            await record.save();

            if (record.attempts >= 5) {
                await Otp.deleteOne({ _id: record._id });

                return res.status(400).json({
                    success: false,
                    message: "Maximum OTP attempts exceeded. Request a new OTP."
                });
            }

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ Verify user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isEmailVerified: true
            },
            { new: true }
        );

        // ✅ generate token
        const payload = {
            id: updatedUser._id,
            role: updatedUser.role
        };

        const accessToken = jwt.sign(
            payload,
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn:
                    process.env.JWT_ACCESS_EXPIRE || "1h"
            }
        );

        const refreshToken = jwt.sign(
            payload,
            process.env.JWT_REFRESH_SECRET,
            {
                expiresIn:
                    process.env.JWT_REFRESH_EXPIRE || "7d"
            }
        );

        // ✅ save refresh token
        updatedUser.refreshToken = refreshToken;

        record.isUsed = true;
        await record.save();

        await updatedUser.save();

        // ✅ Cleanup OTPs
        await Otp.deleteMany({
            userId,
            type: "email"
        });

        // ✅ response
        res.json({
            success: true,
            message: "Email verified successfully",
            accessToken,
            refreshToken,
            user: updatedUser
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: error.message
        });
    }
};

exports.verifyMobileOTP = async (req, res) => {
    try {

        const { userId, otp } = req.body;

        const record = await Otp.findOne({
            userId,
            type: "mobile"
        }).sort({ createdAt: -1 });
        console.log(record);

        if (!record) {
            return res.status(400).json({
                message: "OTP not found"
            });
        }

        if (record.isUsed) {
            return res.status(400).json({
                success: false,
                message: "OTP has already been used"
            });
        }

        const isMatch = await bcrypt.compare(otp, record.otp);

        if (!isMatch) {

            record.attempts += 1;
            await record.save();

            if (record.attempts >= 5) {
                await Otp.deleteOne({ _id: record._id });

                return res.status(400).json({
                    success: false,
                    message: "Maximum OTP attempts exceeded. Request a new OTP."
                });
            }

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        await User.findByIdAndUpdate(userId, { isMobileVerified: true });

        await Otp.deleteMany({ userId, type: "mobile" });

        record.isUsed = true;
        await record.save();

        res.json({
            success: true,
            message: "Mobile verified successfully"
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
};

//Login with OTP
exports.loginWithOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        // ✅ find user
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ find latest OTP
        const record = await Otp.findOne({
            userId: user._id,
            type: "login"
        }).sort({ createdAt: -1 });

        if (!record) {
            return res.status(400).json({
                success: false,
                message: "OTP not found"
            });
        }

        if (record.isUsed) {
            return res.status(400).json({
                success: false,
                message: "OTP has already been used"
            });
        }

        // ✅ check expiry
        if (record.expiresAt < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "OTP expired"
            });
        }

        // ✅ compare bcrypt
        const isMatch = await bcrypt.compare(otp,record.otp);

        if (!isMatch) {

            record.attempts += 1;
            await record.save();

            if (record.attempts >= 5) {
                await Otp.deleteOne({ _id: record._id });

                return res.status(400).json({
                    success: false,
                    message: "Maximum OTP attempts exceeded. Request a new OTP."
                });
            }

            return res.status(400).json({
                success: false,
                message: "Invalid OTP"
            });
        }

        // ✅ generate token
        const accessToken = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_ACCESS_SECRET,
            {
                expiresIn:
                    process.env.JWT_ACCESS_EXPIRE || "1h"
            }
        );

        record.isUsed = true;
        await record.save();

        // ✅ cleanup login OTP
        await Otp.deleteMany({
            userId: user._id,
            type: "login"
        });

        res.json({
            success: true,
            message: "Login successful",
            accessToken,
            user
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};

// Resend Email OTP
exports.resendEmailOTP = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const otp = generateOTP();

        const hashedOtp = await bcrypt.hash(otp, 10);
        await Otp.deleteMany({ userId, type: "email" });

        await Otp.create({
            userId,
            userModel: "User",
            otp: hashedOtp,
            type: "email",
            expiresAt: Date.now() + 5 * 60 * 1000
        });


        await sendOTPEmail(user.email, otp);

        res.json({ message: "OTP resent" });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Resend Mobile OTP
exports.resendMobileOTP = async (req, res) => {
    try {

        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // ✅ Generate OTP
        const otp = generateOTP();

        // ✅ Hash OTP
        const hashedOtp = await bcrypt.hash(
            otp,
            10
        );

        // ✅ Delete old OTP
        await Otp.deleteMany({
            userId,
            type: "mobile"
        });

        // ✅ Save new OTP
        await Otp.create({
            userId,
            userModel: "User",
            otp: hashedOtp,
            type: "mobile",
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // ✅ Send SMS
        await sendMobileOTP(
            user.mobile,
            otp
        );

        res.json({
            success: true,
            message: "Mobile OTP resent"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};


//Send Login OTP
exports.sendLoginOTP = async (req, res) => {
    try {

        const { email } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // ✅ generate OTP
        const otp = generateOTP();

        // ✅ hash OTP
        const hashedOtp = await bcrypt.hash(
            otp,
            10
        );

        // ✅ delete old login OTP
        await Otp.deleteMany({
            userId: user._id,
            type: "login"
        });

        // ✅ save login OTP
        await Otp.create({
            userId: user._id,
            userModel: "User",
            otp: hashedOtp,
            type: "login",
            expiresAt: Date.now() + 5 * 60 * 1000
        });

        // ✅ send email OTP
        await sendOTPEmail(
            user.email,
            otp
        );

        res.json({
            success: true,
            message: "Login OTP sent"
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message
        });
    }
};