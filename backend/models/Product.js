const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Product name is required"], trim: true },

    description: { type: String, required: [true, "Product description is required"], trim: true },

    price: { type: Number, required: [true, "Product price is required"], min: [0, "Price cannot be negative"] },

    rating: { type: Number, default: 0, min: [0, "Rating cannot be less than 0"], max: [5, "Rating cannot be more than 5"] },

    numRatings: { type: Number, default: 0 },

    numReviews: { type: Number, default: 0 },

    stock: { type: Number, required: [true, "Stock is required"], min: [0, "Stock cannot be negative"] },

    image: { type: String, required: [true, "Product image is required"] },

    category: { type: String, required: [true, "Category is required"], trim: true },

    concern: { type: String, required: true },

    storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store", required: true, index: true },

    isFeatured: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },

    listingType: {
      type: String,
      enum: ['BESTSELLER', 'NEW ARRIVAL', 'COMBOS'],
      default: 'BESTSELLER'
    },

    addedBy: {
      type: String,
      enum: ["ADMIN", "VENDOR"],
      required: [true, "Creator role type is required"],
      default: "VENDOR"
    },

    // 🌟 2. GATEKEEPER MODERATION STATUS
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: function () {
        // Admin products bypass review and go live instantly; vendors start as pending
        return this.addedBy === "ADMIN" ? "approved" : "pending";
      }
    }
  },
  {
    timestamps: true // adds createdAt & updatedAt automatically
  }
);

module.exports = mongoose.model("Product", productSchema);
