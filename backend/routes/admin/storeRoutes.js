const express = require("express");
const router = express.Router();
const storeController = require("../../controllers/admin/storeController");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload");
const adminLimiter = require("../../middleware/adminLimiter");
const authLimiter = require("../../middleware/authLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");

// Upload fields config
const cpUpload = upload.fields([
  { name: "vendorImage", maxCount: 1 },
  { name: "shopLogo", maxCount: 1 },
  { name: "shopBanner", maxCount: 1 },
]);

// Admin Routes
router.get("/", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), storeController.getStores);
router.post("/add", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), cpUpload, storeController.createStore);
router.put("/update/:id", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), cpUpload, storeController.updateStore);
router.patch("/:id", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), storeController.patchStore);
router.delete("/delete/:id", authLimiter, adminLimiter, auth, isAdmin("ADMIN"), storeController.deleteStore);



module.exports = router;
