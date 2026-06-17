const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const orderController = require("../../controllers/admin/orderController");

// CREATE ORDER (User only)
router.post("/", auth, orderController.createOrder);

// DELETE ORDER (Admin only)
router.delete("/:id", auth, isAdmin("ADMIN"), orderController.deleteOrder);

// Is line ko Admin routes ke section mein add karein
router.get("/dashboard/stats", auth, isAdmin("ADMIN"), orderController.getDashboardStats);

// CANCEL ORDER (User only)
router.put("/:id/cancel",auth,orderController.cancelOrder);

router.put("/:id/request-return",auth,orderController.requestReturn);

router.put("/:id/approve-return",auth,isAdmin("ADMIN"),orderController.approveReturn);

router.put("/:id/rating",auth,orderController.addRating);

// GET USER ORDERS (User only)
router.get("/my-orders",auth,orderController.getUserOrders);

router.get("/details/:orderId",auth,orderController.getOrderDetails);

// GET ALL ORDERS (Admin only)
router.get("/admin/all",auth,isAdmin("ADMIN"),orderController.getAllOrders);

// UPDATE ORDER STATUS (Admin only)
router.put("/:id/status",auth,isAdmin("ADMIN"),orderController.updateOrderStatus);

// Assign Deliveryman (Admin only)
router.put( "/assign-delivery-boy", auth, isAdmin("ADMIN"), orderController.assignDeliveryBoy);

router.put( "/:id/tracking", auth, isAdmin("ADMIN"), orderController.addTracking);

router.put( "/verify-delivery-otp", auth, orderController.verifyDeliveryOTP);


module.exports = router;
