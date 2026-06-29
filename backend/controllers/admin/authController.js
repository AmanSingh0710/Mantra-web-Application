//controllers/admin/authController.js

const User = require("../../models/User");
const Order = require("../../models/Order");
const jwt = require("jsonwebtoken");
const Store = require("../../models/Store");
const cloudinary = require("../../utils/cloudinary");
const Otp = require("../../models/Otp");
const DeliveryMan = require("../../models/Deliveryman/DeliveryMan");
const createOTP = require("../../utils/otp/createOTP");
const verifyOTP = require("../../utils/otp/verifyOTP");
const { setAuthCookies } = require("../../utils/setAuthCookies");
const { clearAuthCookies } = require("../../utils/clearAuthCookies");


//get me
exports.getMe = async (req, res) => {
  try {
    let user;

    switch (req.user.role) {
      case "ADMIN":
      case "USER":
        user = await User.findById(req.user.id)
          .select("-password -refreshToken");
        break;

      case "VENDOR":
        user = await Store.findById(req.user.id)
          .select("-password -refreshToken");
        break;

      case "DELIVERY":
        user = await DeliveryMan.findById(req.user.id)
          .select("-password -refreshToken");
        break;

      default:
        return res.status(401).json({
          success: false,
          message: "Invalid role"
        });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    res.status(200).json({
      success: true,
      user: {
        ...user.toObject(),
        role: req.user.role
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
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

    await createOTP({
      userId: user._id,
      type: "email",
      destination: user.email
    });

    // await createOTP({
    //   userId: user._id,
    //   type: "mobile",
    //   destination: user.mobile
    // });

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

    let user = null;
    let role = null;

    user = await User.findOne({ email }).select("+password");

    if (user) {
      role = user.role;
    }

    if (!user) {
      user = await Store.findOne({ email }).select("+password");

      if (user) {
        role = "VENDOR";
      }
    }

    if (!user) {
      user = await DeliveryMan.findOne({ email }).select("+password");

      if (user) { role = "DELIVERY"; }
    }

    if (!user) { return res.status(400).json({ message: "Invalid credentials" }); }

    // ✅ account blocked
    if (user.blocked || user.isBlocked) { return res.status(403).json({ message: "Account blocked" }); }

    // ✅ account locked

    if (user.lockUntil && user.lockUntil > Date.now()) {
      return res.status(403).json({
        message: "Account locked. Try later"
      });
    }

    const isMatch = await user.comparePassword(password);

    await user.handleLoginAttempt(isMatch);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email before login",
        userId: user._id
      });
    }

    { /* if (!user.isMobileVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your mobile before login"
      });
    }
     */ }

    const payload = { id: user._id, role, };

    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,
      { expiresIn: process.env.JWT_ACCESS_EXPIRE }
    );

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRE }
    );
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save();

    // Remove password string from output data leak paths
    user.password = undefined;

    const userData = user.toObject();
    userData.role = role;

    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      user: userData,
    });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// LOGOUT (sweep and clear client engine cookies)
exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.cookies;

    if (refreshToken) {
      let account = await User.findOne({ refreshToken });

      if (!account) {
        account = await Store.findOne({ refreshToken });
      }

      if (!account) {
        account = await DeliveryMan.findOne({ refreshToken });
      }

      if (account) {
        account.refreshToken = null;
        await account.save();
      }
    }

    clearAuthCookies(res);
    res.json({ success: true, message: "Logged out successfully" });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
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
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "wishlist", select: "productName slug price discountPrice thumbnail averageRating"
      });

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
    return res.status(error.statusCode || 500).json({ success: false, message: error.message });
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

    user.passwordChangedAt = new Date();

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
      updateData.image = req.file.path;
      updateData.imagePublicId = req.file.filename;
    }

    if (req.body.length || req.body.width || req.body.height) {
      updateData.dimensions = {
        length: Number(req.body.length) || 0,
        width: Number(req.body.width) || 0,
        height: Number(req.body.height) || 0,
      };
    }

    if (req.body.variants) {
      updateData.variants =
        typeof req.body.variants === "string"
          ? JSON.parse(req.body.variants)
          : req.body.variants;
    }

    if (req.body.tags) {
      updateData.tags =
        typeof req.body.tags === "string"
          ? req.body.tags.split(",")
          : req.body.tags;
    }

    const updatedAdmin = await User.findByIdAndUpdate(id || req.user.id, updateData, { new: true });

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
    let user = await User.findById(decoded.id);

    if (!user) {user = await Store.findById(decoded.id);}

    if (!user) {user = await DeliveryMan.findById(decoded.id);}

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false , message: "Invalid refresh token" });
    }

    const payload = { id: user._id, role: user.role, storeId: user.storeId };

    const newAccessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: process.env.JWT_ACCESS_EXPIRE,
      }
    );

    const newRefreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: process.env.JWT_REFRESH_EXPIRE,
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    setAuthCookies(res, newAccessToken, newRefreshToken);

    return res.json({ success: true, message: "Token refreshed" });

  } catch (err) {
    return res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token"
    });
  }
};

// update launguage
exports.updateLanguage = async (req, res) => {
  try {

    const { language } = req.body;

    const allowedLanguages = ["en", "hi", "fr", "es"];

    if (!allowedLanguages.includes(language)) {
      return res.status(400).json({
        success: false,
        message: "Invalid language"
      });
    }

    const admin = await User.findByIdAndUpdate(req.user.id,
      { language },
      { new: true }
    );

    res.status(200).json({
      success: true,
      language: admin.language,
      message: "Language updated successfully"
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// forgot passwpord
exports.forgotPassword = async (req, res) => {
  try {

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    let userModel = "User";

    let user = await User.findOne({ email });

    if (!user) {
      user = await Store.findOne({ email });

      if (user) userModel = "Store";
    }

    if (!user) {
      user = await DeliveryMan.findOne({ email });

      if (user) userModel = "DeliveryMan";
    }

    // Production security:
    // Don't reveal whether the email exists.
    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If the email exists, an OTP has been sent."
      });
    }

    await createOTP({
      userId: user._id,
      type: "reset-password",
      destination: user.email
    });

    res.status(200).json({
      success: true,
      message: "OTP sent successfully"
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};

// verify Reset OTP
exports.verifyResetOTP = async (req, res) => {

  try {

    const { email, otp } = req.body;

    let user = await User.findOne({ email });

    if (!user) {
      user = await Store.findOne({ email });
    }

    if (!user) {
      user = await DeliveryMan.findOne({ email });
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await verifyOTP({
      userId: user._id,
      otp,
      type: "reset-password"
    });

    return res.json({
      success: true,
      message: "OTP verified"
    });

  } catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }

};

// rrset password
exports.resetPassword = async (req, res) => {

  try {

    const { email, otp, newPassword } = req.body;

    let user = await User.findOne({ email }).select("+password");

    if (!user) {
      user = await Store.findOne({ email }).select("+password");
    }

    if (!user) {
      user = await DeliveryMan.findOne({ email }).select("+password");
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    await verifyOTP({
      userId: user._id,
      otp,
      type: "reset-password"
    });

    user.password = newPassword;

    user.refreshToken = null;

    user.passwordChangedAt = new Date();

    await Otp.deleteMany({
      userId: user._id,
      type: "reset-password"
    });

    await user.save();


    res.json({
      success: true,
      message: "Password changed successfully"
    });

  }
  catch (error) {
    return res.status(error.statusCode || 500).json({
      success: false,
      message: error.message
    });
  }
};