const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const commissionController = require("../../../controllers/admin/Finance/commissionController");
const router = express.Router();


// COMMISSION REPORT ANALYTICS
router.get("/report", authLimiter, auth, isAdmin("ADMIN"), commissionController.getCommissionReport);

// ALL COMMISSION LIST
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), commissionController.getAllCommissions);

// SINGLE COMMISSION DETAILS
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), commissionController.getSingleCommission);

// UPDATE COMMISSION STATUS
router.put("/:id/status", authLimiter, auth, isAdmin("ADMIN"), commissionController.updateCommissionStatus);

module.exports = router;