const jwt = require("jsonwebtoken");

exports.generateTokens = (user) => {

    const payload = {
        id: user._id,
        role: user.role
    };

    const accessToken = jwt.sign(
        payload,
        process.env.JWT_ACCESS_SECRET,
        {
            expiresIn: process.env.JWT_ACCESS_EXPIRE || "1h"
        }
    );

    const refreshToken = jwt.sign(
        payload,
        process.env.JWT_REFRESH_SECRET,
        {
            expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d"
        }
    );

    return {
        accessToken,
        refreshToken
    };
};