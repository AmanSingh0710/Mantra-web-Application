// backend/routes/user/productRoutes.js

const express = require("express");
const router = express.Router();

const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const validateId = require("../../middleware/validateId");
const upload = require("../../middleware/upload");
const publicLimiter = require("../../middleware/publicLimiter");
const adminLimiter = require("../../middleware/adminLimiter");
const uploadLimiter = require("../../middleware/uploadLimiter");

const productcontroller = require("../../controllers/user/productController");



// ================= PUBLIC ROUTES ================= //

// ✅ Get All Products
router.get("/", publicLimiter, productcontroller.getAllProducts);

router.get("/concerns", publicLimiter, productcontroller.getUniqueConcerns);

// ✅ Get Single Product
router.get("/:id", publicLimiter, validateId, productcontroller.getSingleProduct);


// ================= ADMIN ROUTES ================= //

// ✅ Add Product (Admin only)
router.post("/", adminLimiter, uploadLimiter, auth, isAdmin("ADMIN"),
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "metaImage", maxCount: 1 }
  ]),
  productcontroller.addProduct
);

// ✅ Update Product (Admin only)
router.put("/:id", adminLimiter, auth, isAdmin("ADMIN"), validateId, productcontroller.updateProduct);

// ✅ Delete Product (Admin only)
router.delete("/:id", adminLimiter, auth, isAdmin("ADMIN"), validateId, productcontroller.deleteProduct);

module.exports = router;