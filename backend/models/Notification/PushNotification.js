//models/Notification/PushNotification.js
const mongoose = require("mongoose");

const notificationSettingSchema = new mongoose.Schema(
  {
    userType: {
      type: String,
      enum: ["Customer", "Seller", "Delivery Man"],
      default: "Customer",
    },
    // 1. Order Pending
    order_pending: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order is pending." },
    },
    // 2. Order Confirmation
    order_confirmation: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order has been confirmed." },
    },
    // 3. Order Processing
    order_processing: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order is being processed." },
    },
    // 4. Order Out For Delivery
    order_out_for_delivery: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order is out for delivery." },
    },
    // 5. Order Delivered
    order_delivered: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order has been delivered." },
    },
    // 6. Order Returned
    order_returned: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order has been returned." },
    },
    // 7. Order Failed
    order_failed: {
      status: { type: Boolean, default: false },
      message: { type: String, default: "Your order payment/delivery failed." },
    },
    // 8. Order Canceled
    order_canceled: {
      status: { type: Boolean, default: false },
      message: { type: String, default: "Your order has been canceled." },
    },
    // 9. Order Refunded
    order_refunded: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your order has been refunded." },
    },
    // 10. Refund Request Canceled
    refund_request_canceled: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Your refund request was canceled." },
    },
    // 11. Message From Delivery Man
    message_from_delivery_man: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "You have a new message from delivery man." },
    },
    // 12. Message From Seller
    message_from_seller: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "You have a new message from seller." },
    },
    // 13. Fund Added By Admin
    fund_added_by_admin: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "Admin has added funds to your wallet." },
    },
    // 14. Message From Admin
    message_from_admin: {
      status: { type: Boolean, default: true },
      message: { type: String, default: "You have a new message from admin." },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("NotificationSetting", notificationSettingSchema);