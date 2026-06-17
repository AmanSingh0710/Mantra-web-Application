const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const vendorOrderController = require("../../../controllers/admin/vendorOrderController");

const router = express.Router();


// ORDER SUMMARY
router.get("/summary", authLimiter, auth, isAdmin("ADMIN"), vendorOrderController.getVendorOrderSummary);

// ALL VENDOR ORDERS
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), vendorOrderController.getAllVendorOrders);

// SINGLE ORDER
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), vendorOrderController.getSingleVendorOrder);

// UPDATE ORDER STATUS
router.put("/:id/status", authLimiter, auth, isAdmin("ADMIN"), vendorOrderController.updateVendorOrderStatus);

// UPDATE SETTLEMENT STATUS
router.put("/:id/settlement", authLimiter, auth, isAdmin("ADMIN"), vendorOrderController.updateSettlementStatus);

module.exports = router;