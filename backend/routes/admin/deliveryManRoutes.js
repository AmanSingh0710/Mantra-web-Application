const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/Deliverymans/deliveryManController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");

router.post("/add", auth, isAdmin("ADMIN"), controller.addDeliveryBoy);

router.get("/list", auth, isAdmin("ADMIN"), controller.getAllDeliveryBoys);

router.get("/get/:id", auth, isAdmin("ADMIN"), controller.getSingleDeliveryBoy);

router.put("/update/:id", auth, isAdmin("ADMIN"), controller.updateDeliveryBoy);

router.put("/change-password/:id", auth, isAdmin("ADMIN"), controller.changePassword);

router.delete("/delete/:id", auth, isAdmin("ADMIN"), controller.deleteDeliveryBoy);

router.put("/toggle-status/:id", auth, isAdmin("ADMIN"), controller.toggleDeliveryStatus);

router.put("/verify/:id", auth, isAdmin("ADMIN"), controller.verifyDeliveryBoy);

router.put("/block/:id", auth, isAdmin("ADMIN"), controller.blockDeliveryBoy);

router.get("/stats", auth, isAdmin("ADMIN"), controller.getDeliveryStats);

// Update live location
router.put("/location/:id", auth, controller.updateLocation);

// Delivery boy profile
router.get("/profile/:id", auth, controller.getProfile);

// Wallet details
router.get("/wallet/:id", auth, controller.getWallet);

// Earnings history
router.get("/earnings/:id", auth, controller.getEarnings);

module.exports = router;