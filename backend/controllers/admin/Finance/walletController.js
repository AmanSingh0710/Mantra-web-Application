const Wallet = require("../../../models/Finance/Wallet");
const WalletTransaction = require("../../../models/Finance/WalletTransaction");

//Wallet create
exports.createWallet = async (req, res) => {
    try {
        const existing = await Wallet.findOne({ userId: req.body.userId });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Wallet already exists"
            });
        }

        const wallet = await Wallet.create({
            userId: req.body.userId,
            userType: req.body.userType
        });

        res.status(201).json({
            success: true,
            wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Get Wallet
exports.getWallet = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        res.status(200).json({
            success: true,
            wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Wallet transaction 
exports.getWalletTransactions = async (req, res) => {
    try {
        const wallet = await Wallet.findOne({ userId: req.params.userId });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const transactions = await WalletTransaction.find({ walletId: wallet._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            transactions
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Credit Wallet
exports.creditWallet = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const before = wallet.balance;
        wallet.balance += amount;
        wallet.totalCredited += amount;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id,
            type: "CREDIT",
            amount,
            source: "MANUAL",
            description,
            balanceBefore: before,
            balanceAfter: wallet.balance
        });

        res.status(200).json({
            success: true,
            wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Debit Wallet
exports.debitWallet = async (req, res) => {
    try {
        const { amount, description } = req.body;
        const wallet = await Wallet.findById(req.params.id);
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        if (wallet.balance < amount) {
            return res.status(400).json({
                success: false,
                message: "Insufficient balance"
            });
        }

        const before = wallet.balance;
        wallet.balance -= amount;
        wallet.totalDebited += amount;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id,
            type: "DEBIT",
            amount,
            source: "MANUAL",
            description,
            balanceBefore: before,
            balanceAfter: wallet.balance
        });

        res.status(200).json({
            success: true,
            wallet
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};