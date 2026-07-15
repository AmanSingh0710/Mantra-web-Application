const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const payoutController = require("../../../controllers/admin/Finance/payoutController");

const router = express.Router();

// PAYOUT DASHBOARD
router.get("/summary", authLimiter, auth, isAdmin("ADMIN"), payoutController.getPayoutSummary);

// ALL PAYOUT REQUESTS
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), payoutController.getAllPayouts);

// SINGLE PAYOUT
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), payoutController.getSinglePayout);

// APPROVE PAYOUT
router.put("/:id/approve", authLimiter, auth, isAdmin("ADMIN"), payoutController.approvePayout);

// REJECT PAYOUT
router.put("/:id/reject", authLimiter, auth, isAdmin("ADMIN"), payoutController.rejectPayout);

// MARK PAID
router.put("/:id/paid", authLimiter, auth, isAdmin("ADMIN"), payoutController.markPayoutPaid);

module.exports = router;