const express = require("express");
const auth = require("../../../middleware/auth");
const isAdmin = require("../../../middleware/isAdmin");
const authLimiter = require("../../../middleware/authLimiter");
const walletController = require("../../../controllers/admin/Finance/walletController");

const router = express.Router();

// CREATE WALLET
router.post("/create", authLimiter, auth, isAdmin("ADMIN"), walletController.createWallet);

// GET WALLET DETAILS
router.get("/:userId", authLimiter, auth, isAdmin("ADMIN"), walletController.getWallet);

// WALLET TRANSACTIONS
router.get("/:userId/transactions", authLimiter, auth, isAdmin("ADMIN"), walletController.getWalletTransactions);

// CREDIT WALLET
router.put("/:id/credit", authLimiter, auth, isAdmin("ADMIN"), walletController.creditWallet);

// DEBIT WALLET
router.put("/:id/debit", authLimiter, auth, isAdmin("ADMIN"), walletController.debitWallet);

module.exports = router;