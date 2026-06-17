const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const transactionController = require("../../../controllers/admin/Finance/walletTransactionController");

const router = express.Router();

// ======================================================
// TRANSACTION SUMMARY
// ======================================================
router.get("/summary", authLimiter, auth, isAdmin("ADMIN"), transactionController.getTransactionSummary);

// ======================================================
// ALL TRANSACTIONS
// ======================================================
router.get("/all", authLimiter, auth, isAdmin("ADMIN"), transactionController.getAllTransactions);

// ======================================================
// SINGLE TRANSACTION
// ======================================================
router.get("/:id", authLimiter, auth, isAdmin("ADMIN"), transactionController.getSingleTransaction);

// ======================================================
// CREATE MANUAL TRANSACTION
// ======================================================
router.post("/create", authLimiter, auth, isAdmin("ADMIN"), transactionController.createTransaction);

// ======================================================
// UPDATE STATUS
// ======================================================
router.put("/:id/status", authLimiter, auth, isAdmin("ADMIN"), transactionController.updateTransactionStatus);

module.exports = router;