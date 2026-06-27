// routes/deliveryBoy/deliveryBoyRoutes.js

const express = require("express");

const router = express.Router();

const controller = require("../../controllers/deliveryBoy/deliveryBoyController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");

// ======================================================
// DELIVERY BOY LOGIN
// ======================================================
router.post("/login",controller.loginDeliveryBoy);

// ======================================================
// GET MY PROFILE
// ======================================================
router.get("/my-profile",auth,isAdmin("DELIVERY"),controller.getMyProfile);

// ======================================================
// GET MY ORDERS
// ======================================================
router.get("/my-orders",auth,isAdmin("DELIVERY"),controller.getMyOrders);

// ======================================================
// GET MY STATS
// ======================================================
router.get("/my-stats",auth,isAdmin("DELIVERY"),controller.getMyStats);

// ======================================================
// GET EARNINGS
// ======================================================
router.get("/earnings",auth,isAdmin("DELIVERY"),controller.getEarnings);

// ======================================================
// UPDATE LIVE LOCATION
// ======================================================
router.put("/update-location",auth,isAdmin("DELIVERY"),controller.updateLocation);

// ======================================================
// UPDATE ORDER STATUS
// ======================================================
router.put("/update-order-status",auth,isAdmin("DELIVERY"),controller.updateOrderStatus);

// ======================================================
// TOGGLE ONLINE / OFFLINE
// ======================================================
router.put("/toggle-status",auth,isAdmin("DELIVERY"),controller.toggleOnlineStatus);

// ======================================================
// ACCEPT ORDER
// ======================================================
router.put("/accept-order/:id",auth,isAdmin("DELIVERY"),controller.acceptOrder);

// ======================================================
// VERIFY DELIVERY OTP
// ======================================================
router.post("/verify-otp",auth,isAdmin("DELIVERY"),controller.verifyDeliveryOTP);

module.exports = router;