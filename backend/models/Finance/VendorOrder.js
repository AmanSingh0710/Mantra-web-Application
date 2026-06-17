const mongoose = require("mongoose");

const vendorOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      index: true
    },

    vendorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
      index: true
    },

    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vendor-Product"
        },

        name: String,

        sku: String,

        image: String,

        quantity: Number,

        price: Number,

        total: Number
      }
    ],

    subtotal: {
      type: Number,
      required: true
    },

    shippingCharge: {
      type: Number,
      default: 0
    },

    tax: {
      type: Number,
      default: 0
    },

    discount: {
      type: Number,
      default: 0
    },

    grandTotal: {
      type: Number,
      required: true
    },

    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Delivered",
        "Cancelled",
        "Returned"
      ],
      default: "Pending"
    },

    settlementStatus: {
      type: String,
      enum: [
        "Pending",
        "Released"
      ],
      default: "Pending"
    }
  },
  {
    timestamps: true
  }
);

module.exports =
mongoose.model(
  "VendorOrder",
  vendorOrderSchema
);