const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/Deliverymans/deliveryManController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");

router.post("/add", auth, isAdmin("ADMIN"), controller.addDeliveryBoy);

router.get("/list", auth, isAdmin("ADMIN"), controller.getAllDeliveryBoys);

router.get("/get/:id", auth, isAdmin("ADMIN"), controller.getSingleDeliveryBoy);

router.put("/update/:id", auth, isAdmin("ADMIN"), controller.updateDeliveryBoy);

router.delete("/delete/:id", auth, isAdmin("ADMIN"), controller.deleteDeliveryBoy);

router.put("/verify/:id", auth, isAdmin("ADMIN"), controller.verifyDeliveryBoy);

router.put("/block/:id", auth, isAdmin("ADMIN"), controller.blockDeliveryBoy);

router.get("/stats", auth, isAdmin("ADMIN"), controller.getDeliveryStats);



module.exports = router;