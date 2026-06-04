const Refund = require('../../models/Refund');

/**
 * 1. CREATE: Naya refund request add karne ke liye
 * POST /api/refunds/add
 */
exports.createRefund = async (req, res) => {
    try {
        // Frontend se data extract karna
        const { refundId, orderId, productInfo, customerInfo, totalAmount } = req.body;

        const newRefund = new Refund({
            refundId,
            orderId,
            productInfo,
            customerInfo,
            totalAmount,
            status: 'pending' // By default pending rahega
        });

        await newRefund.save();
        res.status(201).json({ success: true, message: "Refund request created!", data: newRefund });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * 2. READ: Sabhi refunds ya status wise refunds fetch karne ke liye
 * GET /api/refunds?status=pending&search=ORD123
 */
exports.getAllRefunds = async (req, res) => {
    try {
        const { status, search } = req.query;
        let query = {};

        // Status filter (pending, approved, etc.)
        if (status) query.status = status;

        // Search logic (Order ID ya Refund ID se search)
        if (search) {
            query.$or = [
                { refundId: { $regex: search, $options: 'i' } },
                { orderId: { $regex: search, $options: 'i' } },
                { "customerInfo.name": { $regex: search, $options: 'i' } }
            ];
        }

        const refunds = await Refund.find(query).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: refunds.length, data: refunds });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

/**
 * 3. UPDATE: Status change karne ya details edit karne ke liye
 * PATCH /api/refunds/:id
 */
exports.updateRefund = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Hum pura body pass kar sakte hain ya specific fields like status
        const updatedRefund = await Refund.findByIdAndUpdate(
            id, 
            { $set: req.body }, 
            { new: true, runValidators: true }
        );

        if (!updatedRefund) {
            return res.status(404).json({ success: false, message: "Refund not found" });
        }

        res.status(200).json({ success: true, message: "Updated successfully", data: updatedRefund });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

/**
 * 4. DELETE: Kisi request ko permanently delete karne ke liye
 * DELETE /api/refunds/:id
 */
exports.deleteRefund = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedRefund = await Refund.findByIdAndDelete(id);

        if (!deletedRefund) {
            return res.status(404).json({ success: false, message: "Refund not found" });
        }

        res.status(200).json({ success: true, message: "Refund request deleted permanently" });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};