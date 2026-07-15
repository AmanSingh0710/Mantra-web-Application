const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: String,

    discountType: {
      type: String,
      enum: ["PERCENTAGE", "FLAT"],
      required: true,
    },

    discountValue: {
      type: Number,
      required: true,
    },

    applyOn: {
      type: String,
      enum: ["PRODUCT", "STORE", "CATEGORY", "GLOBAL"],
      required: true,
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },

    store: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
    },

    category: String,

    startDate: Date,
    endDate: Date,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
