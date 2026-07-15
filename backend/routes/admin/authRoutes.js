//routes/admin/authRoutes.js

const express = require("express");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");
const authLimiter = require("../../middleware/authLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");
const authController = require("../../controllers/admin/authController");
const upload = require("../../middleware/upload");
const router = express.Router();



// ================= AUTH =================
router.post("/register", authLimiter, uploadLimiter, upload.single("image"), authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh", authLimiter, authController.refreshToken);
router.post("/logout", authLimiter, authController.logout);
router.post("/forgot-password", authLimiter, authController.forgotPassword);
router.post("/verify-reset-otp", authLimiter, authController.verifyResetOTP);
router.post("/reset-password", authLimiter, authController.resetPassword);

// ================= ADMIN =================
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), authController.getAllUsers);
router.get("/admin-profile", authLimiter, auth, isAdmin("ADMIN"), authController.getAdminProfile);
router.patch("/update-password", authLimiter, auth, isAdmin("ADMIN"), authController.updatePassword);
router.patch("/update-admin", authLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), authController.updateAdmin);
router.patch("/admin/update-user/:id", authLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), authController.updateUser);
router.patch("/language", authLimiter, auth, isAdmin("ADMIN"), authController.updateLanguage);

// ================= USER =================
router.get("/me", authLimiter, auth, authController.getMe);
router.get("/profile/:id", authLimiter, auth, authController.getProfile);
router.delete("/user/:id", authLimiter, auth, authController.deleteUser);
router.patch("/user/:id", authLimiter, auth, uploadLimiter, upload.single("image"), authController.updateUser);

// ================= CUSTOMER ACCOUNT =================
// Dashboard
router.get("/dashboard", authLimiter, auth, authController.getDashboard);
// Wishlist
router.get("/wishlist", authLimiter, auth, authController.getWishlist);
router.post("/wishlist/:productId", authLimiter, auth, authController.addToWishlist);
router.delete("/wishlist/:productId", authLimiter, auth, authController.removeWishlist);
// Notifications
router.get("/notifications", authLimiter, auth, authController.getNotifications);
router.patch("/notifications/:id/read", authLimiter, auth, authController.markNotificationRead);
router.patch("/notifications/read-all", authLimiter, auth, authController.markAllNotificationsRead);

module.exports = router;