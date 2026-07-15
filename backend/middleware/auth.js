//middleware/auth.js

const User = require("../models/User");
const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
  try {
   const token = req.cookies ? req.cookies.accessToken : null;

    // 2. If cookie doesn't exist, block access immediately
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Access denied. Authentication token missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);

    req.user = {
      id: decoded.id,
      role: decoded.role,
      storeId: decoded.storeId
    };

    next();

  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid token" });
  }
};
