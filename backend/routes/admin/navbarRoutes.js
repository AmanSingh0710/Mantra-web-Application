const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const navbarController = require("../../controllers/admin/navbarController");

router.get("/navbar",auth,isAdmin("ADMIN"),navbarController.getNavbarData);

module.exports = router;