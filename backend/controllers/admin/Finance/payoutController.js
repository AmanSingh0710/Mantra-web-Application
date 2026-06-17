const PayoutRequest = require("../../../models/Finance/PayoutRequest");

// PAYOUT DASHBOARD SUMMARY
exports.getPayoutSummary = async (req, res) => {
    try {
        const summary = await PayoutRequest.aggregate([
            {
                $group: {
                    _id: null,
                    totalPayout: { $sum: "$amount" },
                    totalRequests: { $sum: 1 },
                    pendingAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PENDING"] }, "$amount", 0]
                        }
                    },
                    approvedAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "APPROVED"] }, "$amount", 0]
                        }
                    },
                    paidAmount: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "PAID"] }, "$amount", 0]
                        }
                    }
                }
            }
        ]);

        res.json({
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

// GET ALL PAYOUT REQUESTS
exports.getAllPayouts = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        const payouts = await PayoutRequest.find(filter)
            .populate("vendorId", "storeName email phone")
            .populate("approvedBy", "name email")
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: payouts.length,
            payouts
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// SINGLE PAYOUT DETAILS
exports.getSinglePayout = async (req, res) => {
    try {
        const payout = await PayoutRequest.findById(req.params.id)
            .populate("vendorId")
            .populate("approvedBy");

        if (!payout) {
            return res.status(404).json({
                success: false,
                message: "Payout request not found"
            });
        }

        res.json({
            success: true,
            payout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// APPROVE PAYOUT
exports.approvePayout = async (req, res) => {
    try {
        const payout = await PayoutRequest.findById(req.params.id);

        if (!payout) {
            return res.status(404).json({
                success: false,
                message: "Payout not found"
            });
        }

        payout.status = "APPROVED";
        payout.approvedBy = req.user.id;
        payout.approvedAt = new Date();

        await payout.save();

        res.json({
            success: true,
            message: "Payout approved",
            payout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// REJECT PAYOUT
exports.rejectPayout = async (req, res) => {
    try {
        const payout = await PayoutRequest.findById(req.params.id);

        if (!payout) {
            return res.status(404).json({
                success: false,
                message: "Payout not found"
            });
        }

        payout.status = "REJECTED";
        payout.remarks = req.body.remarks || "Rejected by admin";

        await payout.save();

        res.json({
            success: true,
            message: "Payout rejected",
            payout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// MARK PAYOUT AS PAID
exports.markPayoutPaid = async (req, res) => {
    try {
        const { transactionReference } = req.body;
        const payout = await PayoutRequest.findById(req.params.id);

        if (!payout) {
            return res.status(404).json({
                success: false,
                message: "Payout not found"
            });
        }

        payout.status = "PAID";
        payout.transactionReference = transactionReference || "";
        payout.paidAt = new Date();

        await payout.save();

        res.json({
            success: true,
            message: "Payment completed",
            payout
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};