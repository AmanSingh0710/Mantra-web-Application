const express = require("express");
const router = express.Router();
const dashboardController = require("../../controllers/admin/dashboardController");
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

router.get("/", auth, isAdmin("ADMIN"), dashboardController.getDashboard);

module.exports = router;