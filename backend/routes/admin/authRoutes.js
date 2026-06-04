//routes/admin/authRoutes.js

const express = require("express");
const multer = require("multer");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");
const authLimiter = require("../../middleware/authLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");
const authController = require("../../controllers/admin/authController");

const router = express.Router();

// MULTER
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================= AUTH =================
router.post("/register", authLimiter, uploadLimiter, upload.single("image"), authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/refresh", authLimiter, authController.refreshToken);
router.post("/logout", authLimiter, authController.logout);

// ================= ADMIN =================
router.get("/all", authLimiter,auth, isAdmin("ADMIN"),  authController.getAllUsers);
router.get("/admin-profile", authLimiter,auth, isAdmin("ADMIN"),  authController.getAdminProfile);
router.patch("/update-password", authLimiter,auth, isAdmin("ADMIN"),  authController.updatePassword);
router.patch("/update-admin", authLimiter, uploadLimiter,auth, isAdmin("ADMIN"),  upload.single("image"), authController.updateAdmin);
router.patch("/admin/update-user/:id", authLimiter, uploadLimiter, auth, isAdmin("ADMIN"),  upload.single("image"), authController.updateUser);

// ================= USER =================
router.get("/profile/:id", auth, authLimiter, authController.getProfile);
router.delete("/user/:id", auth, authLimiter, authController.deleteUser);
router.patch("/user/:id", auth, authLimiter, uploadLimiter, upload.single("image"), authController.updateUser);

module.exports = router;