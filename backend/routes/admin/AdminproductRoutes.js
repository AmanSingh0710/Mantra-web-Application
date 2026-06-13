// backend/routes/admin/AdminproductRoutes.js

const express = require('express');
const router = express.Router();

// 🌟 Aligned path matching your real directory structure
const productController = require('../../controllers/admin/AdminproductController');
const adminUserController = require('../../controllers/admin/AdminUserController');
const auth = require('../../middleware/auth');
const isAdmin = require('../../middleware/isAdmin');
const upload = require('../../middleware/upload');
const validateId = require("../../middleware/validateId");
const rateLimit = require("express-rate-limit");


// 🔐 Admin Operations Rate Limiter (Protects mutations/bulk imports)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 50,
  message: { success: false, message: "Too many administrative modifications requested. Please retry shortly." }
});

// 🌍 High-Volume Public Storefront Traffic Rate Limiter
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { success: false, message: "Traffic threshold reached. System cooldown active." }
});


// =========================================================================
// ========================= ADMINISTRATIVE ACTIONS =========================
// =========================================================================

// ✅ GET SYSTEM MASTER INVENTORY INDEX (Admin Management View)
router.get('/', adminLimiter, auth, isAdmin("ADMIN"), productController.getProducts);

// ✅ MANUALLY INGEST CORESYSTEM STOCK (Private label listings e.g., AmazonBasics)
router.post('/add', adminLimiter, auth, isAdmin("ADMIN"),
  upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
    { name: 'metaImage', maxCount: 1 }
  ]),
  productController.addProduct
);

// 🌟 ✅ VENDOR MARKETPLACE MODERATION (Approve / Reject items live)
// Handles incoming payload mutations changing vendor listings to ACTIVE/INACTIVE
router.patch('/toggle-approval/:productId', adminLimiter, auth, isAdmin("ADMIN"), productController.toggleProductApproval);

// ✅ TOGGLE STATUS (Featured Flags / Soft deletion states)
router.patch('/toggle-status', adminLimiter, auth, isAdmin("ADMIN"), productController.toggleStatus);

// ✅ BULK INTEL MATRIX SHEET IMPORT (Excel Ingestion Processing Pipeline)
router.post('/bulk-import', adminLimiter, auth, isAdmin("ADMIN"), upload.single('file'), productController.bulkImportProducts);

// ✅ INVENTORY PROFILE PROPERTY UPDATE 
router.put('/:id', adminLimiter, auth, isAdmin("ADMIN"), validateId,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 5 },
    { name: "metaImage", maxCount: 1 }
  ]), productController.updateProduct);

// ✅ PERMANENT ECOSYSTEM PURGE (Drops document & scrubs underlying asset artifacts)
router.delete('/:id', adminLimiter, auth, isAdmin("ADMIN"), validateId, productController.deleteProduct);

// 📥 Get all vendors waiting for platform approval clearance
router.get('/vendors/pending', adminLimiter, auth, isAdmin("ADMIN"), adminUserController.getPendingVendors);

// 🔐 Approve or Reject a vendor's business registration application
router.patch('/vendors/review/:vendorId', adminLimiter, auth, isAdmin("ADMIN"), adminUserController.reviewVendorAccount);


// =========================================================================
// ============================ PUBLIC FRONTEND ============================
// =========================================================================

// 🌍 PUBLIC CATALOG VISUALIZATION (Aggregated pipeline output for user storefront)
router.get('/public', publicLimiter, productController.getPublicProducts);

router.get('/public/:id', publicLimiter, productController.getPublicProductById);


module.exports = router;