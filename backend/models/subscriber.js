const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email address is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/\S+@\S+\.\S+/, 'Please use a valid email address']
    },
    status: {
        type: String,
        required: true,
        enum: ['Subscribed', 'Unsubscribed'],
        default: 'Subscribed'
    },
    source: {
        type: String,
        required: true,
        enum: ['Footer', 'Popup Modal', 'Checkout Page', 'Blog Banner', 'Admin Manual Add', 'Homepage'],
        default: 'Footer'
    },
    unsubscribedAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true // Automatically creates createdAt (Subscription Date) and updatedAt
});

// Index for high-performance searching by email or status filter
subscriberSchema.index({ email: 1, status: 1 });

module.exports = mongoose.model('Subscriber', subscriberSchema);