//models/Finance/Order.js

const mongoose = require("mongoose");

// ================= STATUS HISTORY =================
const statusHistorySchema = new mongoose.Schema(
  {
    status: {
      type: String,
      required: true,
    },
    note: {
      type: String,
      default: "",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

// ================= PRODUCTS =================
const orderProductSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vendor-Product",
      required: true,
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    sku: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },

    total: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

// ================= MAIN ORDER =================
const orderSchema = new mongoose.Schema(
  {
    // =====================================
    // ORDER INFO
    // =====================================
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // =====================================
    // SHIPPING ADDRESS
    // =====================================
    shipping: {
      name: {
        type: String,
        required: true,
        trim: true,
      },

      email: {
        type: String,
        required: true,
        trim: true,
      },

      mobile: {
        type: String,
        required: true,
      },

      address: {
        type: String,
        required: true,
      },

      city: {
        type: String,
        required: true,
      },

      state: {
        type: String,
        required: true,
      },

      country: {
        type: String,
        required: true,
      },

      pin: {
        type: String,
        required: true,
      },
    },

    // =====================================
    // PRODUCTS
    // =====================================
    products: [orderProductSchema],

    // =====================================
    // PRICING
    // =====================================
    pricing: {
      subtotal: {
        type: Number,
        required: true,
      },

      tax: {
        type: Number,
        default: 0,
      },

      deliveryCharge: {
        type: Number,
        default: 0,
      },

      discount: {
        type: Number,
        default: 0,
      },

      adminCommission: {
        type: Number,
        default: 0,
      },

      grandTotal: {
        type: Number,
        required: true,
      },
    },

    // =====================================
    // COUPON
    // =====================================
    coupon: {
      code: {
        type: String,
        default: "",
      },

      discountAmount: {
        type: Number,
        default: 0,
      },
    },

    // =====================================
    // PAYMENT
    // =====================================
    payment: {
      method: {
        type: String,
        enum: ["COD", "RAZORPAY", "STRIPE"],
        required: true,
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Paid",
          "Failed",
          "Refunded",
        ],
        default: "Pending",
      },

      transactionId: {
        type: String,
        default: "",
      },

      paidAt: {
        type: Date,
        default: null,
      },
    },

    // =====================================
    // ORDER STATUS
    // =====================================
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Processing",
        "Packed",
        "Shipped",
        "Out For Delivery",
        "Delivered",
        "Cancelled",
        "Return Requested",
        "Returned",
        "Refunded",
        "Failed",
      ],
      default: "Pending",
      index: true,
    },

    statusHistory: [statusHistorySchema],

    // =====================================
    // DELIVERY BOY
    // =====================================
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan",
      default: null,
    },

    // =====================================
    // TRACKING
    // =====================================
    tracking: {
      trackingId: {
        type: String,
        default: "",
      },

      courierName: {
        type: String,
        default: "",
      },

      trackingUrl: {
        type: String,
        default: "",
      },

      shippedAt: {
        type: Date,
        default: null,
      },

      deliveredAt: {
        type: Date,
        default: null,
      },
    },

    // =====================================
    // REFUND
    // =====================================

    refund: {
      refundId: {
        type: String,
        default: ""
      },

      amount: {
        type: Number,
        default: 0
      },

      reason: {
        type: String,
        default: ""
      },

      status: {
        type: String,
        enum: [
          "Pending",
          "Approved",
          "Processed",
          "Rejected"
        ],
        default: "Pending"
      },

      refundedAt: Date,

      transactionId: String
    },

    // =====================================
    // DELIVERY OTP
    // =====================================
    deliveryOtp: {
      type: String,
      default: null
    },

    deliveryOtpExpiresAt: {
      type: Date,
      default: null
    },

    deliveryOtpVerified: {
      type: Boolean,
      default: false,
    },

    // =====================================
    // CANCELLATION
    // =====================================
    cancelReason: {
      type: String,
      default: "",
    },

    cancelledAt: {
      type: Date,
      default: null,
    },

    // =====================================
    // RETURN REQUEST
    // =====================================
    returnRequest: {
      requested: {
        type: Boolean,
        default: false,
      },

      reason: {
        type: String,
        default: "",
      },

      images: [String],

      approved: {
        type: Boolean,
        default: false,
      },

      requestedAt: {
        type: Date,
        default: null,
      },
    },

    // =====================================
    // RATINGS
    // =====================================
    productRating: {

      productId,

      rating: {
        type: Number,
        min: 1,
        max: 5,
        default: null,
      },

      review: {
        type: String,
        default: "",
      },
    },

    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null,
    },

    deliveryReview: {
      type: String,
      default: "",
    },

    // =====================================
    // INVOICE
    // =====================================
    invoiceNumber: {
      type: String,
      default: "",
    },

    invoiceUrl: {
      type: String,
      default: "",
    },

    // =====================================
    // ADMIN NOTES
    // =====================================
    notes: [
      {
        message: String,
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    // =====================================
    // SOFT DELETE
    // =====================================
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

orderSchema.index({
  userId: 1,
  createdAt: -1
});

orderSchema.index({
  orderNumber: 1
});

orderSchema.index({
  status: 1
});

orderSchema.index({
  "payment.status": 1
});

// ================= AUTO ORDER NUMBER =================
orderSchema.pre("save", function (next) {
  if (!this.orderNumber) {
    this.orderNumber =
      "MNT" +
      Date.now() +
      Math.floor(Math.random() * 1000);
  }

  next();
});

module.exports = mongoose.model("Order", orderSchema);