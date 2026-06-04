const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const orderController = require("../../controllers/admin/orderController");

// CREATE ORDER (User only)
router.post("/", auth, orderController.createOrder);

// GET USER ORDERS (User only)
router.get("/my-orders", auth, orderController.getUserOrders);

// GET ALL ORDERS (Admin only)
router.get("/", auth, isAdmin("ADMIN"), orderController.getAllOrders);

// Assign Deliveryman (Admin only)
router.put("/assign-deliveryman",  auth, isAdmin("ADMIN"), orderController.assignDeliveryMan);

// UPDATE ORDER STATUS (Admin only)
router.put("/:id/status", auth, isAdmin("ADMIN"), orderController.updateOrderStatus);

// CANCEL ORDER (User only)
router.put("/:id/cancel", auth, orderController.cancelOrder);

// DELETE ORDER (Admin only)
router.delete("/:id", auth, isAdmin("ADMIN"), orderController.deleteOrder);

// Is line ko Admin routes ke section mein add karein
router.get("/dashboard/stats", auth, isAdmin("ADMIN"), orderController.getDashboardStats);


module.exports = router;
