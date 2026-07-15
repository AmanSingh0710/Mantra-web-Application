const express = require("express");
const router = express.Router();
const { getSalesReport ,exportSalesReport , downloadSalesPDF} = require("../../controllers/admin/salesController");

router.get("/sales-report", getSalesReport);
router.get("/export-sales", exportSalesReport);
router.get("/download-report", downloadSalesPDF);

module.exports = router;
