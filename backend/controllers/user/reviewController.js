const Review = require("../../models/Review");
const Product = require("../../models/Product");
const User = require("../../models/User");

exports.getPublicReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: "active" })
            .populate("customerId", "name email image")
            .sort({ createdAt: -1 });

        res.status(200).json(reviews);
    } catch (error) {
        res.status(500).json({ message: "Error" });
    }
};

exports.getReviews = async (req, res) => {
    try {
       const { search, productId, customerId, status, from, to } = req.query;
        let filter = {};

        // Status filter
        if (status) filter.status = status;

        // Product & Customer dropdown filter
        if (productId) filter.productId = productId;

        // Agar user ADMIN nahi hai, toh strict filter lagao
        if (req.user.role !== 'ADMIN' && !req.user.isAdmin) { 
            filter.customerId = req.user.id;
        } else {
            // Agar ADMIN hai, toh sirf tabhi filter lagao jab dropdown se select ho
            if (customerId) filter.customerId = customerId;
        }

        // Date range filter
        if (from && to) {
            filter.createdAt = { $gte: new Date(from), $lte: new Date(to) };
        }

        // Fetch with population
        let reviews = await Review.find(filter)
            .populate("productId", "name")
            .populate("customerId", "name email")
            .sort({ createdAt: -1 });

        // Manual search filter
        if (search) {
            const searchLower = search.toLowerCase();
            reviews = reviews.filter(rev =>
                rev.productId?.name.toLowerCase().includes(searchLower) ||
                rev.customerId?.name.toLowerCase().includes(searchLower) ||
                rev.comment.toLowerCase().includes(searchLower)
            );
        }

        res.status(200).json(reviews);

    } catch (error) {
        console.error("Review Fetch Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.addReview = async (req, res) => {
    try {
        const { productId, rating, comment } = req.body;
        const customerId = req.user.id; // Auth middleware se user ID mil jayegi

        const newReview = new Review({
            productId,
            customerId,
            rating,
            comment,
            status: "active"
        });

        await newReview.save();
        res.status(201).json({ message: "Review added successfully", newReview });
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error: error.message });
    }
};

// Review Status Update (Active/Inactive toggle karne ke liye)
exports.updateReviewStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;
        const updatedReview = await Review.findByIdAndUpdate(id, { status }, { new: true });
        res.status(200).json(updatedReview);
    } catch (error) {
        res.status(500).json({ message: "Status update failed" });
    }
};

// Product Dropdown
exports.getProductDropdown = async (req, res) => {
    try {
        
        const products = await Product.find({}).select('name _id'); 
        res.status(200).json(products); // Yeh ek Array bhejega [{_id: '...', name: '...'}]
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

// Customer Dropdown
exports.getCustomerDropdown = async (req, res) => {
    try {
        // 'User' model mein role 'customer' check karein
        const customers = await User.find({}).select('name _id');
        res.status(200).json(customers);
    } catch (error) {
        res.status(500).json({ message: "Error", error: error.message });
    }
};

