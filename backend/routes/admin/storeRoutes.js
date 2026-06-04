const express = require("express");
const router = express.Router();
const storeController = require("../../controllers/admin/storeController");
const isAdmin = require("../../middleware/isAdmin");
const auth = require("../../middleware/auth");
const upload = require("../../middleware/upload"); 

// Upload fields config
const cpUpload = upload.fields([
  { name: "vendorImage", maxCount: 1 },
  { name: "shopLogo", maxCount: 1 },
  { name: "shopBanner", maxCount: 1 },
]);

// Admin Routes
router.get("/", auth, isAdmin("ADMIN"), storeController.getStores);
router.post("/add", auth, isAdmin("ADMIN"), cpUpload, storeController.createStore);
router.put("/update/:id", auth, isAdmin("ADMIN"), cpUpload, storeController.updateStore);
router.patch("/:id", auth, isAdmin("ADMIN"), storeController.patchStore);
router.delete("/delete/:id", auth, isAdmin("ADMIN"), storeController.deleteStore);



module.exports = router;
