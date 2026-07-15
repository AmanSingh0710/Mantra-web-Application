const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const refundController = require("../../../controllers/admin/Finance/refundController");

const router = express.Router();

// ======================================================
// REFUND SUMMARY
// ======================================================
router.get("/summary", authLimiter, auth, isAdmin("ADMIN"), refundController.getRefundSummary);

// ======================================================
// ALL REFUNDS
// ======================================================
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), refundController.getAllRefunds);

// ======================================================
// SINGLE REFUND
// ======================================================
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), refundController.getSingleRefund);

// ======================================================
// APPROVE REFUND
// ======================================================
router.put("/:id/approve", authLimiter, auth, isAdmin("ADMIN"), refundController.approveRefund);

// ======================================================
// REJECT REFUND
// ======================================================
router.put("/:id/reject", authLimiter, auth, isAdmin("ADMIN"), refundController.rejectRefund);

// ======================================================
// PROCESS REFUND
// ======================================================
router.put("/:id/process", authLimiter, auth, isAdmin("ADMIN"), refundController.processRefund);

module.exports = router;