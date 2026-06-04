const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Aapke product model ka naam
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Aapke user model ka naam
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
    },
    comment: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ["active", "inactive"],
        default: "active"
    }
}, { timestamps: true });

module.exports = mongoose.model("Review", reviewSchema);