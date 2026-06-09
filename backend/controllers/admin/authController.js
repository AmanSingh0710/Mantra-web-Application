//controllers/admin/authController.js

const User = require("../../models/User");
const Order = require("../../models/Order");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sendOTPEmail } = require("../../utils/mailer");
const { sendMobileOTP } = require("../../utils/sendMobileOTP");
const generateOTP = require("../../utils/generateOTP");
const Otp = require("../../models/Otp");
const Store = require("../../models/Store");

/**
 * Helper to generate cookie options dynamically based on environment.
 */
const getCookieOptions = () => {
  const isProduction = process.env.NODE_ENV === "production";
  return {
    httpOnly: true, // Neutralizes XSS by making the cookie unreadable to client JS
    secure: isProduction, // True in production (requires HTTPS)
    // If your frontend and backend domains are separate (e.g. Vercel & Heroku), use "None".
    sameSite: isProduction ? "None" : "Lax",
    path: "/",
  };
};

// REGISTER
exports.register = async (req, res) => {
  try {
    const { name, email, mobile, password, address, pin, role } = req.body;

    if (!name || !email || !mobile || !password || !address || !pin) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existingUser = await User.findOne({
      $or: [{ email }, { mobile }]
    });

    if (existingUser) {
      return res.status(400).json({ message: "Email or mobile already exists" });
    }

    const user = await User.create({
      name,
      email,
      mobile,
      password,
      address,
      pin,
      role: role || "USER",
    });


    // ✅ Generate OTP
    const otp = generateOTP();

    const hashedOtp = await bcrypt.hash(otp, 10);

    // ✅ save OTP in collection
    await Otp.create({
      userId: user._id,
      otp: hashedOtp,
      type: "email",
      expiresAt: Date.now() + 5 * 60 * 1000
    });

    console.log("OTP:", otp);

    // ✅ send email
    await sendOTPEmail(email, otp);

    // const mobileOtp = generateOTP();

    // const hashedMobileOtp = await bcrypt.hash(
    //   mobileOtp,
    //   10
    // );

    // await Otp.create({
    //   userId: user._id,
    //   otp: hashedMobileOtp,
    //   type: "mobile",
    //   expiresAt: Date.now() + 5 * 60 * 1000
    // });

    // // ✅ send sms on mobile
    // await sendMobileOTP(user.mobile, mobileOtp);

    res.status(201).json({
      success: true,
      message: "User registered. OTP sent",
      userId: user._id
    });

  } catch (error) {
    // res.status(500).json({ message: "Internal Server Error" });
    console.error("REGISTER ERROR:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};



// LOGIN
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email }).select("+password");

    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // ✅ account blocked
    if (user.blocked) {
      return res.status(403).json({ message: "Account blocked" });
    }

    // ✅ account locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({ message: "Account locked. Try later" });
    }

    const isMatch = await user.comparePassword(password);

    await user.handleLoginAttempt(isMatch);

    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login"
      });
    }

    { /* if (!user.isMobileVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your mobile before login"
      });
    }
     */ }

    const payload = {
      id: user._id,
      role: user.role,
      storeId: user.storeId
    };

    const accessToken = jwt.sign(
      payload,
      process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    );

    const refreshToken = jwt.sign(
      payload,
      process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );
    user.refreshToken = refreshToken;
    await user.save();

    // Remove password string from output data leak paths
    user.password = undefined;

    const isProduction = process.env.NODE_ENV === "production";
    const cookieOptions = {
      httpOnly: true,
      secure: true,      // Must be true on Render (HTTPS)
      sameSite: "None",  // Required because frontend is Vercel and backend is Render
      path: "/",
    };

    // Access token cookie (Matches your short lived JWT life, e.g. 15 minutes)
    res.cookie("accessToken", accessToken, {
      ...cookieOptions,
      maxAge: 15 * 60 * 1000, 
    });

    // Refresh token cookie (Matches your longer lived token life, e.g. 7 days)
    res.cookie("refreshToken", refreshToken, {
      ...cookieOptions,
      maxAge: 7 * 24 * 60 * 60 * 1000, 
    });

    res.status(200).json({
      accessToken,
      refreshToken,
      user
    });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.aggregate([
      { $match: { role: "USER", isDeleted: false } }, // ✅ FIX
      {
        $lookup: {
          from: "orders",
          localField: "_id",
          foreignField: "userId",
          as: "orders",
        },
      },
      {
        $addFields: {
          totalOrders: { $size: "$orders" },
        },
      },
      {
        $project: {
          orders: 0,
          password: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ]);

    res.status(200).json({
      success: true,
      users,
      total: users.length,
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};



// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;

    const restrictedFields = ["password", "role", "refreshToken"];
    restrictedFields.forEach(field => delete req.body[field]);

    let updates = { ...req.body };

    if (req.file) {
      updates.image = `/uploads/${req.file.filename}`;
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: id, isDeleted: false },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ success: true, user: updatedUser });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await User.findByIdAndUpdate(id, { isDeleted: true });

    res.status(200).json({
      success: true,
      message: "User deleted (soft)"
    });

  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// GET SINGLE PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Get Current Admin Info
exports.getAdminProfile = async (req, res) => {
  try {
    // req.user middleware se aayega
    const admin = await User.findById(req.user.id).select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


//admin update password
exports.updatePassword = async (req, res) => {
  try {
    const { password } = req.body;

    // Validation
    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Password is required"
      });
    }

    // Auth check
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized"
      });
    }

    // Find user
    const user = await User.findById(req.user.id).select("+password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // Set new password
    user.password = password;

    // pre("save") middleware auto hash karega
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (error) {
    console.error("UPDATE PASSWORD ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


exports.updateAdmin = async (req, res) => {
  try {

    if (!req.user || req.user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Access denied"
      });
    }

    const { id, name, email, mobile } = req.body;
    const updateData = { name, email, mobile };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const updatedAdmin = await User.findByIdAndUpdate(
      id || req.user.id,
      updateData,
      { new: true }
    );

    res.status(200).json({ success: true, admin: updatedAdmin });

  } catch (error) {
    console.error("UPDATE ADMIN ERROR:", error);
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


// REFRESH TOKEN (Modified to read and set tokens via cookies instead of body payloads)
exports.refreshToken = async (req, res) => {
  try {
    // Look inside req.cookies instead of the request body
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
      return res.status(401).json({ message: "No refresh token provided" });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id);

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    const payload = { id: user._id, role: user.role, storeId: user.storeId };
    
    const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn: process.env.JWT_ACCESS_EXPIRE || "15m" });
    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE || "7d" });

    user.refreshToken = newRefreshToken;
    await user.save();

    const cookieOptions = getCookieOptions();

    // Deliver new tokens quietly back via client cookies
    res.cookie("accessToken", newAccessToken, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
    res.cookie("refreshToken", newRefreshToken, { ...cookieOptions, maxAge: 7 * 24 * 60 * 60 * 1000 });

    return res.json({ success: true });

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};


// LOGOUT (sweep and clear client engine cookies)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      const user = await User.findOne({ refreshToken });
      if (user) {
        user.refreshToken = null;
        await user.save();
      }
    }

    const cookieOptions = getCookieOptions();

    // Expire and clear client side cookie paths instantly
    res.clearCookie("accessToken", cookieOptions);
    res.clearCookie("refreshToken", cookieOptions);

    res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};