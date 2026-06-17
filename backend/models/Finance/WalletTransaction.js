const mongoose = require("mongoose");

const walletTransactionSchema =
  new mongoose.Schema(
    {
      walletId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Wallet",
        required: true,
        index: true
      },

      transactionId: {
        type: String,
        unique: true,
        index: true
      },

      type: {
        type: String,
        enum: [
          "CREDIT",
          "DEBIT"
        ],
        required: true
      },

      amount: {
        type: Number,
        required: true,
        min: 0
      },

      source: {
        type: String,
        enum: [
          "ORDER",
          "REFUND",
          "SETTLEMENT",
          "PAYOUT",
          "BONUS",
          "MANUAL"
        ],
        required: true
      },

      sourceId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null
      },

      description: {
        type: String,
        default: ""
      },

      balanceBefore: {
        type: Number,
        default: 0
      },

      balanceAfter: {
        type: Number,
        default: 0
      },

      status: {
        type: String,
        enum: [
          "PENDING",
          "SUCCESS",
          "FAILED"
        ],
        default: "SUCCESS"
      }
    },
    {
      timestamps: true
    }
  );

walletTransactionSchema.pre(
  "save",
  function (next) {

    if (!this.transactionId) {

      this.transactionId =
        "WTX-" +
        Date.now() +
        "-" +
        Math.floor(
          Math.random() * 10000
        );

    }

    next();
  }
);

walletTransactionSchema.index({
  walletId: 1,
  createdAt: -1
});

module.exports = mongoose.model(
  "WalletTransaction",
  walletTransactionSchema
);