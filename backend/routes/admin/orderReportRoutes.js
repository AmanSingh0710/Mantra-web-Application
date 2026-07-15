// routes/admin/orderReportRoutes.js

const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const isAdmin = require("../../middleware/isAdmin");
const authLimiter = require("../../middleware/authLimiter");
const reportController = require("../../controllers/admin/orderReportController");

// ================= ORDER REPORT =================
router.get("/orders", authLimiter, auth, isAdmin("ADMIN"), reportController.getOrderReport);
router.get("/orders/export/excel", authLimiter, auth, isAdmin("ADMIN"), reportController.exportOrderExcel);
router.get("/orders/export/pdf", authLimiter, auth, isAdmin("ADMIN"), reportController.downloadOrderPDF);

// ================= INHOUSE SALES REPORT =================
router.get("/inhouse-sales", authLimiter, auth, isAdmin("ADMIN"), reportController.getInhouseSalesReport);
router.get("/inhouse-sales/export/excel", authLimiter, auth, isAdmin("ADMIN"), reportController.exportInhouseSalesExcel);
router.get("/inhouse-sales/export/pdf", authLimiter, auth, isAdmin("ADMIN"), reportController.exportInhouseSalesPDF);

// ================= PRODUCT REPORT =================
router.get("/products", authLimiter, auth, isAdmin("ADMIN"), reportController.getProductReport);
router.get("/products/export/excel", authLimiter, auth, isAdmin("ADMIN"), reportController.exportProductExcel);
router.get("/products/export/pdf", authLimiter, auth, isAdmin("ADMIN"), reportController.exportProductPDF);

// ================= TRANSACTION REPORT =================
router.get("/transactions", authLimiter, auth, isAdmin("ADMIN"), reportController.getTransactionReport);
router.get("/transactions/export/excel", authLimiter, auth, isAdmin("ADMIN"), reportController.exportTransactionExcel);
router.get("/transactions/export/pdf", authLimiter, auth, isAdmin("ADMIN"), reportController.exportTransactionPDF);

// ================= VENDOR SALES REPORT =================
router.get("/vendor-sales", authLimiter, auth, isAdmin("ADMIN"), reportController.getVendorSalesReport);
router.get("/vendor-sales/export/excel", authLimiter, auth, isAdmin("ADMIN"), reportController.exportVendorSalesExcel);
router.get("/vendor-sales/export/pdf", authLimiter, auth, isAdmin("ADMIN"), reportController.exportVendorSalesPDF);

module.exports = router;