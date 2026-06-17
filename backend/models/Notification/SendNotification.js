const mongoose = require("mongoose");

//models/Notification/SendNotification.js
const notificationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },

    image: {
      type: String,
      default: ""
    },

    type: {
      type: String,
      enum: ["OFFER", "ORDER", "GENERAL"],
      default: "GENERAL"
    },

    isGlobal: {
      type: Boolean,
      default: true
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true   // 🔥 performance boost
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true   // 🔥 fast filtering
    }

  },
  { timestamps: true }
);


// 🔥 COMPOUND INDEX (VERY IMPORTANT FOR SCALE)
notificationSchema.index({ user: 1, isRead: 1 });
notificationSchema.index({ isGlobal: 1 });
notificationSchema.index({ createdAt: -1 });


// 🔥 AUTO DELETE OLD NOTIFICATIONS (OPTIONAL)
notificationSchema.index(
  { createdAt: 1 },
  { expireAfterSeconds: 60 * 60 * 24 * 30 } // 30 days
);

module.exports = mongoose.model("Notification", notificationSchema);