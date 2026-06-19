// routes/admin/concernRoutes.js
const express = require("express");
const router = express.Router();
const concern = require("../../controllers/admin/concernController");
const auth = require("../../middlewares/auth");
const isAdmin = require("../../middlewares/isAdmin");
const rateLimiter = require("../../middlewares/rateLimiter");
const upload = require("../../middlewares/upload");

// PUBLIC ROUTES
router.get("/public/all", rateLimiter, concern.getPublicConcerns);
router.get("/public/:id", rateLimiter, concern.getSingleConcern);

// ADMIN ROUTES
router.post("/create", auth, isAdmin("ADMIN"), rateLimiter, upload.single("image"),concern.createConcern);
router.get("/admin/all", auth,  rateLimiter, concern.getAllConcerns);
router.get("/admin/:id", auth, isAdmin("ADMIN"), rateLimiter, concern.getSingleConcern);
router.put("/update/:id", auth, isAdmin("ADMIN"), rateLimiter, upload.single("image"),concern.updateConcern);
router.delete("/delete/:id", auth, isAdmin("ADMIN"), rateLimiter, concern.deleteConcern);

module.exports = router;