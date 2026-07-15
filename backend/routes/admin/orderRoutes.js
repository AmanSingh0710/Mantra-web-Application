const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const publicLimiter = require("../../middleware/publicLimiter");
const authLimiter = require("../../middleware/authLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const orderController = require("../../controllers/admin/orderController");


// USER ROUTES
router.post("/", authLimiter, auth, orderController.createOrder);
router.get("/my-orders", authLimiter, auth, orderController.getUserOrders);
router.get("/details/:orderId", authLimiter, auth, orderController.getOrderDetails);
router.get("/:id/invoice", authLimiter, auth, orderController.downloadInvoice);
router.patch("/:id/cancel", authLimiter, auth, orderController.cancelOrder);
router.patch("/:id/request-return", authLimiter, auth, orderController.requestReturn);
router.patch("/:id/rating", authLimiter, auth, orderController.addRating);
router.patch("/verify-delivery-otp", authLimiter, auth, orderController.verifyDeliveryOTP);

// ADMIN ROUTES
router.get("/dashboard/stats", adminLimiter, auth, isAdmin("ADMIN"), orderController.getDashboardStats);
router.get("/admin/all", adminLimiter, auth, isAdmin("ADMIN"), orderController.getAllOrders);
router.patch("/:id/status", adminLimiter, auth, isAdmin("ADMIN"), orderController.updateOrderStatus);
router.delete("/:id", adminLimiter, auth, isAdmin("ADMIN"), orderController.deleteOrder);
router.patch("/:id/approve-return", adminLimiter, auth, isAdmin("ADMIN"), orderController.approveReturn);
router.patch("/assign-delivery-boy", adminLimiter, auth, isAdmin("ADMIN"), orderController.assignDeliveryBoy);
router.patch("/:id/tracking", adminLimiter, auth, isAdmin("ADMIN"), orderController.addTracking);

module.exports = router;