const express = require("express");

const router = express.Router();

const controller = require("../../controllers/admin/Deliverymans/deliveryManController");

const auth = require("../../middleware/auth");

const isAdmin = require("../../middleware/isAdmin");

const upload = require("../../middleware/upload");

// ======================================================
// MULTER FIELDS
// ======================================================
const cpUpload = upload.fields([
    {
        name: "image",
        maxCount: 1,
    },

    {
        name: "aadhaarFront",
        maxCount: 1,
    },

    {
        name: "aadhaarBack",
        maxCount: 1,
    },

    {
        name: "drivingLicenseImage",
        maxCount: 1,
    },

    {
        name: "vehicleImage",
        maxCount: 1,
    },
]);

// ======================================================
// ADD DELIVERY BOY
// ======================================================
router.post("/add",auth,isAdmin("ADMIN"),cpUpload,controller.addDeliveryBoy);

// ======================================================
// GET ALL DELIVERY BOYS
// ======================================================
router.get(
    "/list",
    auth,
    isAdmin("ADMIN"),
    controller.getAllDeliveryBoys
);

// ======================================================
// GET SINGLE DELIVERY BOY
// ======================================================
router.get(
    "/get/:id",
    auth,
    isAdmin("ADMIN"),
    controller.getSingleDeliveryBoy
);

// ======================================================
// UPDATE DELIVERY BOY
// ======================================================
router.put(
    "/update/:id",
    auth,
    isAdmin("ADMIN"),
    cpUpload,
    controller.updateDeliveryBoy
);

// ======================================================
// DELETE DELIVERY BOY
// ======================================================
router.delete(
    "/delete/:id",
    auth,
    isAdmin("ADMIN"),
    controller.deleteDeliveryBoy
);

// ======================================================
// TOGGLE STATUS
// ======================================================
router.put(
    "/toggle-status/:id",
    auth,
    isAdmin("ADMIN"),
    controller.toggleDeliveryStatus
);

// ======================================================
// VERIFY DELIVERY BOY
// ======================================================
router.put(
    "/verify/:id",
    auth,
    isAdmin("ADMIN"),
    controller.verifyDeliveryBoy
);

// ======================================================
// BLOCK / UNBLOCK
// ======================================================
router.put(
    "/block/:id",
    auth,
    isAdmin("ADMIN"),
    controller.blockDeliveryBoy
);

// ======================================================
// DELIVERY ANALYTICS
// ======================================================
router.get(
    "/stats",
    auth,
    isAdmin("ADMIN"),
    controller.getDeliveryStats
);

module.exports = router;