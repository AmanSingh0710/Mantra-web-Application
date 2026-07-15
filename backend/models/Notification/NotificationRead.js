const mongoose = require("mongoose");
//models/Notification/NotificationRead.js
const notificationReadSchema = new mongoose.Schema(
  {
    notificationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Notification",
      required: true,
      index: true
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    readAt: {
      type: Date,
      default: Date.now
    }
  },
  {
    timestamps: true
  }
);

// One user can read one notification only once
notificationReadSchema.index(
  {
    notificationId: 1,
    userId: 1
  },
  {
    unique: true
  }
);

module.exports = mongoose.model(
  "NotificationRead",
  notificationReadSchema
);