const express = require("express");
const router = express.Router();

const vendorStoreController = require("../../controllers/Vendor/vendorStoreController");

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");

const upload = require("../../middleware/upload");


// ================= MULTER CONFIG =================
const cpUpload = upload.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "images", maxCount: 10 },
  { name: "variantImages", maxCount: 20 }
]);

// GET MY STORE PRODUCT
router.get("/products",auth,isAdmin("VENDOR"),vendorStoreController.getVendorProducts);

// ADD STORE PRODUCT
router.post("/add",auth,isAdmin("VENDOR"), cpUpload,vendorStoreController.addProduct);

// GET VENDOR ORDERS
router.get("/vendor-orders", auth, isAdmin("VENDOR"), vendorStoreController.getVendorOrders);

// UPDATE MY STORE
router.put("/my-store/update/:id",auth,isAdmin("VENDOR"),cpUpload,vendorStoreController.updateProduct);

// DELETE MY STORE
router.delete("/my-store/delete/:id",auth,isAdmin("VENDOR"),vendorStoreController.deleteProduct);

// GET MY STORE BY ID
router.get("/my-store/get/:id", auth, isAdmin("VENDOR"), vendorStoreController.getSingleProduct);

// GET MY STORE
router.get("/my-store", auth, isAdmin("VENDOR"), vendorStoreController.getMyStore);

router.put("/my-store/update",auth,isAdmin("VENDOR"),cpUpload,vendorStoreController.updateMyStore);

//  VENDOR ANALYTICS
router.get("/my-store/vendor-stats",auth,isAdmin("VENDOR"),vendorStoreController.getVendorStats);


module.exports = router;