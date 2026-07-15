const express = require("express");
const router = express.Router();

const heroController = require("../../controllers/admin/heroController");

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const upload = require("../../middleware/upload");

const contentLimiter = require("../../middleware/contentLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");

// ================= CREATE =================
router.post("/add", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), heroController.createHero);

// ================= GET ALL =================
router.get("/", contentLimiter, heroController.getHeroes);

// ================= GET SINGLE =================
router.get("/:id", contentLimiter, heroController.getSingleHero);

// ================= UPDATE =================
router.put("/:id", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"), upload.single("image"), heroController.updateHero);

// ================= DELETE =================
router.delete("/:id", adminLimiter, auth, isAdmin("ADMIN"), heroController.deleteHero);

module.exports = router;