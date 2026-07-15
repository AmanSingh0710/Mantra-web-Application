const mongoose = require('mongoose');

const RefundSchema = new mongoose.Schema({
    refundId: { type: String, required: true, unique: true },
    orderId: { type: String, required: true },
    productInfo: {
        name: String,
        price: Number,
        image: String
    },
    customerInfo: {
        name: String,
        email: String,
        phone: String
    },
    totalAmount: { type: Number, required: true },
    status: { 
        type: String, 
        enum: ['pending', 'approved', 'refunded', 'rejected'], 
        default: 'pending' 
    },
    rejectionReason: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Refund', RefundSchema);