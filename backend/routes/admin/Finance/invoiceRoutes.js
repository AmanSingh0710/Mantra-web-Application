const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const invoiceController = require("../../../controllers/admin/Finance/invoiceController");

const router = express.Router();

// ======================================================
// GENERATE INVOICE
// ======================================================
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), invoiceController.generateInvoice);

module.exports = router;