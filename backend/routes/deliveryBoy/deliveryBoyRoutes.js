// routes/deliveryBoy/deliveryBoyRoutes.js

const express = require("express");
const router = express.Router();

const controller = require("../../controllers/deliveryBoy/deliveryBoyController");

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const deliveryLimiter = require("../../middleware/deliveryLimiter");
const deliveryStatusLimiter = require("../../middleware/deliveryStatusLimiter");
const locationLimiter = require("../../middleware/locationLimiter");
const otpLimiter = require("../../middleware/otpLimiter");
const authLimiter = require("../../middleware/authLimiter");

// Authentication
router.put("/change-password", authLimiter, auth, isAdmin("DELIVERY"), controller.changePassword);

// Profile & Dashboard
router.get("/my-profile", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getMyProfile);
router.get("/dashboard", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getDashboard);
router.put("/toggle-status", deliveryStatusLimiter, auth, isAdmin("DELIVERY"), controller.toggleOnlineStatus);

// Order Management
router.get("/my-orders", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getMyOrders);
router.patch("/accept-order/:id", deliveryStatusLimiter, auth, isAdmin("DELIVERY"), controller.acceptOrder);
router.put("/update-order-status", deliveryStatusLimiter, auth, isAdmin("DELIVERY"), controller.updateOrderStatus);
router.post("/verify-otp", otpLimiter, auth, isAdmin("DELIVERY"), controller.verifyDeliveryOTP);

// Order Tabs
router.get("/orders/assigned", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getAssignedOrders);
router.get("/orders/active", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getActiveOrders);
router.get("/orders/completed", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getCompletedOrders);
router.get("/orders/cancelled", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getCancelledOrders);
router.get("/orders/returned", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getReturnedOrders);

// Stats & Earnings
router.get("/my-stats", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getMyStats);
router.get("/earnings", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getEarnings);
router.get("/tracking", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getTracking);
router.put("/update-location", locationLimiter, auth, isAdmin("DELIVERY"), controller.updateLocation);

// Wallet
router.get("/wallet", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getWallet);
router.get("/wallet/history", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getWalletHistory);
router.post("/wallet/withdraw", deliveryStatusLimiter, auth, isAdmin("DELIVERY"), controller.requestSettlement);
router.get("/settlements", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getSettlementHistory);
router.get("/settlement/history", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getSettlementHistory);

// Analytics & Notifications
router.get("/analytics", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getDeliveryAnalytics);
router.get("/notification/delivery", deliveryLimiter, auth, isAdmin("DELIVERY"), controller.getDeliveryNotifications);

module.exports = router;