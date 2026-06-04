const express = require("express");
const router = express.Router();

const {
  getOrderReport,
  exportOrderExcel,
  downloadOrderPDF,
} = require("../../controllers/admin/orderReportController");

router.get("/orders", getOrderReport);
router.get("/orders/export", exportOrderExcel);
router.get("/orders/download", downloadOrderPDF);

module.exports = router;
