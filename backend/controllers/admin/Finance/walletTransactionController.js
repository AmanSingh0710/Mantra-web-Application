const WalletTransaction = require("../../../models/Finance/WalletTransaction");
const Wallet = require("../../../models/Finance/Wallet");

// ======================================================
// TRANSACTION SUMMARY
// ======================================================
exports.getTransactionSummary = async (req, res) => {
    try {
        const summary = await WalletTransaction.aggregate([
            {
                $group: {
                    _id: null,
                    totalTransactions: { $sum: 1 },
                    totalCredit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "CREDIT"] }, "$amount", 0]
                        }
                    },
                    totalDebit: {
                        $sum: {
                            $cond: [{ $eq: ["$type", "DEBIT"] }, "$amount", 0]
                        }
                    },
                    successTransactions: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "SUCCESS"] }, 1, 0]
                        }
                    }
                }
            }
        ]);

        res.status(200).json({
            success: true,
            summary: summary[0] || {}
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// GET ALL TRANSACTIONS
// ======================================================
exports.getAllTransactions = async (req, res) => {
    try {
        const { type, source, status, walletId } = req.query;
        const filter = {};

        if (type) {
            filter.type = type;
        }
        if (source) {
            filter.source = source;
        }
        if (status) {
            filter.status = status;
        }
        if (walletId) {
            filter.walletId = walletId;
        }

        const transactions = await WalletTransaction.find(filter)
            .populate("walletId")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: transactions.length,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// GET SINGLE TRANSACTION
// ======================================================
exports.getSingleTransaction = async (req, res) => {
    try {
        const transaction = await WalletTransaction.findById(req.params.id).populate("walletId");

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        res.status(200).json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// CREATE MANUAL TRANSACTION
// ======================================================
exports.createTransaction = async (req, res) => {
    try {
        const { walletId, type, amount, description } = req.body;
        const wallet = await Wallet.findById(walletId);

        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const before = wallet.balance;

        if (type === "DEBIT" && wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient wallet balance"
            });
        }

        if (type === "CREDIT") {
            wallet.balance += amount;
            wallet.totalCredited += amount;
        } else {
            wallet.balance -= amount;
            wallet.totalDebited += amount;
        }

        await wallet.save();

        const transaction = await WalletTransaction.create({
            walletId,
            type,
            amount,
            source: "MANUAL",
            description,
            balanceBefore: before,
            balanceAfter: wallet.balance
        });

        res.status(201).json({
            success: true,
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ======================================================
// UPDATE TRANSACTION STATUS
// ======================================================
exports.updateTransactionStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const transaction = await WalletTransaction.findById(req.params.id);

        if (!transaction) {
            return res.status(404).json({
                success: false,
                message: "Transaction not found"
            });
        }

        transaction.status = status;
        await transaction.save();

        res.status(200).json({
            success: true,
            message: "Transaction status updated",
            transaction
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};