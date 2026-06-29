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

        let user = await User.findOne({ email });
        let userModel = "User";

        if (!user) {
            user = await Store.findOne({ email });

            if (user) {
                userModel = "Store";
            }
        }

        if (!user) {
            user = await DeliveryMan.findOne({ email });

            if (user) {
                userModel = "DeliveryMan";
            }
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
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

        return res.status(200).json({
            success: true,
            message: "Login successful",
            role: userModel,
            user
        });

    } catch (error) {
        console.error(error);

        return res.status(error.statusCode || 500).json({
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

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required"
            });
        }

        let user = await User.findOne({ email });
        let userModel = "User";

        if (!user) {
            user = await Store.findOne({ email });

            if (user) {
                userModel = "Store";
            }
        }

        if (!user) {
            user = await DeliveryMan.findOne({ email });

            if (user) {
                userModel = "DeliveryMan";
            }
        }

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Account not found"
            });
        }

        await createOTP({
            userId: user._id,
            userModel,
            type: "login",
            destination: user.email
        });

        return res.status(200).json({
            success: true,
            message: "Login OTP sent successfully"
        });

    } catch (error) {
        console.error(error);

        return res.status(error.statusCode || 500).json({
            success: false,
            message: error.message
        });
    }
};