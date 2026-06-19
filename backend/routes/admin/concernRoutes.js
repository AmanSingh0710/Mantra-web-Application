// routes/admin/concernRoutes.js
const express = require("express");
const router = express.Router();
const concern = require("../../controllers/admin/concernController");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const authLmiter = require("../../middleware/authLmiter");
const adminLimiter = require("../../middleware/adminLimiter");
const upload = require("../../middleware/upload");

// PUBLIC ROUTES
router.get("/public/all", rateLimiter, concern.getPublicConcerns);
router.get("/public/:id", rateLimiter, concern.getSingleConcern);

// ADMIN ROUTES
router.post("/create", auth, isAdmin("ADMIN"), authLmiter,adminLimiter, upload.single("image"),concern.createConcern);
router.get("/admin/all", auth,  authLmiter, adminLimiter,concern.getAllConcerns);
router.get("/admin/:id", auth, isAdmin("ADMIN"), authLmiter, adminLimiter,concern.getSingleConcern);
router.put("/update/:id", auth, isAdmin("ADMIN"), authLmiter, adminLimiter,upload.single("image"),concern.updateConcern);
router.delete("/delete/:id", auth, isAdmin("ADMIN"), authLmiter, adminLimiter,concern.deleteConcern);

module.exports = router;