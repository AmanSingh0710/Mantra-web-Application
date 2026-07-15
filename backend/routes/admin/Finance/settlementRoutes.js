const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const settlementController = require("../../../controllers/admin/Finance/settlementController");

const router = express.Router();

// ======================================================
// RELEASE VENDOR SETTLEMENT
// ======================================================
router.put("/release/:id", authLimiter, auth, isAdmin("ADMIN"), settlementController.releaseVendorSettlement);

// ======================================================
// VENDOR PAYOUT REQUEST
// ======================================================
router.post("/payout-request", authLimiter, auth, settlementController.requestVendorPayout);

// ======================================================
// APPROVE VENDOR PAYOUT
// ======================================================
router.put("/payout/:id/approve", authLimiter, auth, isAdmin("ADMIN"), settlementController.approveVendorPayout);

// ======================================================
// REJECT VENDOR PAYOUT
// ======================================================
router.put("/payout/:id/reject", authLimiter, auth, isAdmin("ADMIN"), settlementController.rejectVendorPayout);

module.exports = router;