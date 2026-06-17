const VendorOrder = require("../../../models/Finance/VendorOrder");

// VENDOR ORDER SUMMARY
exports.getVendorOrderSummary = async (req, res) => {
    try {
        const summary = await VendorOrder.aggregate([
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSales: { $sum: "$grandTotal" },
                    pendingOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Pending"] }, 1, 0]
                        }
                    },
                    deliveredOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0]
                        }
                    },
                    cancelledOrders: {
                        $sum: {
                            $cond: [{ $eq: ["$status", "Cancelled"] }, 1, 0]
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

// GET ALL VENDOR ORDERS
exports.getAllVendorOrders = async (req, res) => {
    try {
        const { status, vendorId } = req.query;
        const filter = {};

        if (status) {
            filter.status = status;
        }

        if (vendorId) {
            filter.vendorId = vendorId;
        }

        const orders = await VendorOrder.find(filter)
            .populate("vendorId", "storeName email phone")
            .populate("orderId", "orderNumber paymentStatus")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET SINGLE VENDOR ORDER
exports.getSingleVendorOrder = async (req, res) => {
    try {
        const order = await VendorOrder.findById(req.params.id)
            .populate("vendorId")
            .populate("orderId");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Vendor order not found"
            });
        }

        res.status(200).json({
            success: true,
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE ORDER STATUS
exports.updateVendorOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const order = await VendorOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.status = status;
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE SETTLEMENT STATUS
exports.updateSettlementStatus = async (req, res) => {
    try {
        const { settlementStatus } = req.body;
        const order = await VendorOrder.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        order.settlementStatus = settlementStatus;
        await order.save();

        res.json({
            success: true,
            message: "Settlement status updated",
            order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};