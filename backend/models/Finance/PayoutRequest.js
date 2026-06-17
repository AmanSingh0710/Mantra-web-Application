const mongoose = require("mongoose");

const payoutRequestSchema =
  new mongoose.Schema(
    {
      vendorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Store",
        required: true,
        index: true
      },

      payoutId: {
        type: String,
        unique: true,
        index: true
      },

      amount: {
        type: Number,
        required: true,
        min: 1
      },

      bankDetails: {
        accountHolderName: {
          type: String,
          required: true
        },

        bankName: {
          type: String,
          required: true
        },

        accountNumber: {
          type: String,
          required: true
        },

        ifscCode: {
          type: String,
          required: true
        }
      },

      remarks: {
        type: String,
        default: ""
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "APPROVED",
          "PAID",
          "REJECTED"
        ],
        default: "PENDING"
      },

      approvedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: null
      },

      approvedAt: {
        type: Date,
        default: null
      },

      paidAt: {
        type: Date,
        default: null
      },

      transactionReference: {
        type: String,
        default: ""
      }
    },
    {
      timestamps: true
    }
  );

payoutRequestSchema.pre(
  "save",
  function (next) {

    if (!this.payoutId) {

      this.payoutId =
        "PAY-" +
        Date.now() +
        "-" +
        Math.floor(
          Math.random() * 1000
        );

    }

    next();
  }
);

payoutRequestSchema.index({
  vendorId: 1,
  status: 1
});

module.exports = mongoose.model(
  "PayoutRequest",
  payoutRequestSchema
);