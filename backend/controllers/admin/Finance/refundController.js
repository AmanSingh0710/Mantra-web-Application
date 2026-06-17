const Order = require("../../../models/Order");
const Wallet = require("../../../models/Finance/Wallet");
const WalletTransaction = require("../../../models/Finance/WalletTransaction");
const Refund = require("../../../models/Finance/Refund");


// REFUND SUMMARY
exports.getRefundSummary = async (req, res) => {
    try {
        const summary = await Refund.aggregate([
            {
                $group: {
                    _id: null,
                    totalRefunds: { $sum: 1 },
                    totalAmount: { $sum: "$amount" },
                    pendingAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Pending"] }, "$amount", 0]
                        }
                    },
                    approvedAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Approved"] }, "$amount", 0]
                        }
                    },
                    processedAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Processed"] }, "$amount", 0]
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

// GET ALL REFUNDS
exports.getAllRefunds = async (req, res) => {
    try {
        const { status } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        const refunds = await Refund.find(filter)
            .populate("orderId", "orderNumber totalAmount")
            .populate("userId", "name email phone")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: refunds.length,
            refunds
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE REFUND
exports.getSingleRefund = async (req, res) => {
    try {
        const refund = await Refund.findById(req.params.id)
            .populate("orderId")
            .populate("userId")
            .populate("approvedBy");

        if (!refund) {
            return res.status(404).json({
                success: false,
                message: "Refund not found"
            });
        }

        res.status(200).json({
            success: true,
            refund
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Approved Refund
exports.approveRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.status !== "Returned") {
            return res.status(400).json({
                success: false,
                message: "Order must be returned first"
            });
        }

        order.refund = {
            refundId: "REF-" + Date.now(),
            amount: order.pricing.grandTotal,
            reason: order.returnRequest.reason,
            status: "Approved"
        };

        await order.save();

        res.status(200).json({
            success: true,
            message: "Refund approved successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Reject Refund
exports.rejectRefund = async (req, res) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.refund.status = "Rejected";
        order.refund.reason = reason;

        await order.save();

        res.status(200).json({
            success: true,
            message: "Refund rejected"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

//Refund Process
exports.processRefund = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order.refund.status !== "Approved") {
            return res.status(400).json({
                success: false,
                message: "Refund not approved"
            });
        }

        const wallet = await Wallet.findOne({ userId: order.userId });
        if (!wallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }

        const before = wallet.balance;
        wallet.balance += order.refund.amount;
        wallet.totalCredited += order.refund.amount;
        await wallet.save();

        await WalletTransaction.create({
            walletId: wallet._id,
            type: "CREDIT",
            amount: order.refund.amount,
            source: "REFUND",
            sourceId: order._id,
            description: `Refund for ${order.orderNumber}`,
            balanceBefore: before,
            balanceAfter: wallet.balance
        });

        order.refund.status = "Processed";
        order.refund.refundedAt = new Date();
        order.status = "Refunded";

        await order.save();

        res.status(200).json({
            success: true,
            message: "Refund processed successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};