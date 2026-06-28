const mongoose = require("mongoose");

const otpSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    refPath: "userModel"
  },

  userModel: {
    type: String,
    enum: ["User", "Store", "DeliveryMan"],
    required: true
  },
  otp: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ["email", "mobile", "login", "reset-password"],
    default: "email"
  },
  isUsed: {
    type: Boolean,
    default: false
  },
   attempts: {
        type: Number,
        default: 0
    },
  expiresAt: {
    type: Date,
    required: true,
    expires: 0
  }
}, { timestamps: true });

otpSchema.index({
  userId: 1,
  type: 1
});

module.exports = mongoose.model("Otp", otpSchema);