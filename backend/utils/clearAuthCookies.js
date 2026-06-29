// utils/clearAuthCookies.js

exports.clearAuthCookies = (res) => {

    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path:"/"
    };

    res.clearCookie("accessToken", options);
    res.clearCookie("refreshToken", options);
};