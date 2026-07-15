//utils/setAuthCookies.js

exports.setAuthCookies = (res, accessToken, refreshToken) => {

    const isProduction = process.env.NODE_ENV === "production";

    const options = {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "None" : "Lax",
        path: "/",
    };

    res.cookie("accessToken", accessToken, {
        ...options,
        maxAge: 15 * 60 * 1000,
    });

    res.cookie("refreshToken", refreshToken, {
        ...options,
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
};