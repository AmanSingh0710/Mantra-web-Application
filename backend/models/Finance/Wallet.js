const mongoose = require("mongoose");

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "userType",
      required: true,
      index: true
    },

    userType: {
      type: String,
      enum: [
        "User",
        "Store",
        "DeliveryMan"
      ],
      required: true
    },

    balance: {
      type: Number,
      default: 0,
      min: 0
    },

    totalCredited: {
      type: Number,
      default: 0
    },

    totalDebited: {
      type: Number,
      default: 0
    },

    currency: {
      type: String,
      default: "INR"
    },

    status: {
      type: String,
      enum: [
        "ACTIVE",
        "BLOCKED"
      ],
      default: "ACTIVE"
    }
  },
  {
    timestamps: true
  }
);

walletSchema.index({
  userId: 1,
  userType: 1
});

module.exports = mongoose.model(
  "Wallet",
  walletSchema
);