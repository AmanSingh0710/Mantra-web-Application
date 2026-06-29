//controllers/otpController.js

const createOTP = require("../../utils/otp/createOTP");
const verifyOTP = require("../../utils/otp/verifyOTP");
const User = require("../../models/User");
const { generateTokens } = require("../../utils/generateTokens");
const { setAuthCookies } = require("../../utils/setAuthCookies");

// ✅ VERIFY EMAIL OTP
exports.verifyEmailOTP = async (req, res) => {
    try {
        const { userId, otp } = req.body;

        await verifyOTP({
            userId,
            otp,
            type: "email"
        });

        // ✅ Verify user
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            {
                isEmailVerified: true
            },
            { new: true }
        );

        // ✅ generate token
        const { accessToken, refreshToken } = generateTokens(updatedUser);

        updatedUser.refreshToken = refreshToken;
        await updatedUser.save();

        setAuthCookies(res, accessToken, refreshToken);

        // ✅ response
        res.json({
            success: true,
            message: "Email verified successfully",
            user: updatedUser
        });

    } catch (error) {
        console.error(error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

exports.verifyMobileOTP = async (req, res) => {
    try {

        const { userId, otp } = req.body;

        await verifyOTP({ userId, otp, type: "mobile" });

        await User.findByIdAndUpdate(userId,
            { isMobileVerified: true }
        );

        return res.json({
            success: true,
            message: "Mobile verified successfully"
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

//Login with OTP
exports.loginWithOTP = async (req, res) => {
    try {

        const { email, otp } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await verifyOTP({
            userId: user._id,
            otp,
            type: "login"
        });

        const { accessToken, refreshToken } = generateTokens(user);

        user.refreshToken = refreshToken;

        await user.save();

        setAuthCookies(res, accessToken, refreshToken);

        user.password = undefined;

        return res.json({
            success: true,
            message: "Login successful",
            user
        });

    } catch (error) {

        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
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
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        await createOTP({
            userId,
            type: "email",
            destination: user.email
        });

        return res.json({
            success: true,
            message: "OTP resent"
        });

    } catch (error) {
        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};

// Resend Mobile OTP
exports.resendMobileOTP = async (req, res) => {
    try {

        const { userId } = req.body;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await createOTP({
            userId,
            type: "mobile",
            destination: user.mobile
        });

        return res.json({
            success: true,
            message: "Mobile OTP resent"
        });

    } catch (error) {
        console.log(error);
        res.status(error.statusCode || 500).json({
            success: false,
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

        await createOTP({
            userId: user._id,
            type: "login",
            destination: user.email
        });

        return res.json({
            success: true,
            message: "Login OTP sent"
        });

    } catch (error) {

        console.log(error);

        res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};