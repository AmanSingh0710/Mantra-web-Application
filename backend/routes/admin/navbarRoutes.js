const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const adminLimiter = require("../../middleware/adminLimiter");
const authLimiter = require("../../middleware/authLimiter");


const navbarController = require("../../controllers/admin/navbarController");

router.get("/navbar", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), navbarController.getNavbarData);

module.exports = router;