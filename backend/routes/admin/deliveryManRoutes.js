const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/Deliverymans/deliveryManController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");
const upload = require("../../middleware/upload");

router.post("/add", auth, isAdmin("ADMIN"), upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),controller.addDeliveryBoy);

router.get("/list", auth, isAdmin("ADMIN"), controller.getAllDeliveryBoys);

router.get("/get/:id", auth, isAdmin("ADMIN"), controller.getSingleDeliveryBoy);

router.put("/update/:id", auth, isAdmin("ADMIN"),  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "aadhaarFront", maxCount: 1 },
    { name: "aadhaarBack", maxCount: 1 },
    { name: "drivingLicenseImage", maxCount: 1 },
    { name: "vehicleImage", maxCount: 1 },
  ]),controller.updateDeliveryBoy);

router.delete("/delete/:id", auth, isAdmin("ADMIN"), controller.deleteDeliveryBoy);

router.put("/status/:id",auth,isAdmin("ADMIN"),controller.toggleDeliveryStatus);

router.put("/verify/:id", auth, isAdmin("ADMIN"), controller.verifyDeliveryBoy);

router.put("/block/:id", auth, isAdmin("ADMIN"), controller.blockDeliveryBoy);

router.get("/stats", auth, isAdmin("ADMIN"), controller.getDeliveryStats);



module.exports = router;