const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User ID is required"],
    },
    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store"
    },
    shipping: {
      name: { type: String, required: [true, "Shipping name is required"], trim: true },
      email: { type: String, required: [true, "Shipping email is required"], match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"], },
      mobile: {
        type: String,
        required: [true, "Mobile number is required"],
        match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"],
      },
      address: { type: String, required: [true, "Address is required"], trim: true },
      city: { type: String, required: [true, "City is required"], trim: true },
      state: { type: String, required: [true, "State is required"], trim: true },
      country: { type: String, required: [true, "Country is required"], trim: true },
      pin: {
        type: String,
        required: [true, "PIN code is required"],
        match: [/^[0-9]{6}$/, "PIN code must be exactly 6 digits"],
      },
    },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: [true, "Product ID is required"], },
        storeId: { type: mongoose.Schema.Types.ObjectId, ref: "Store" },
        name: { type: String, required: [true, "Product name is required"] },
        image: { type: String, required: true },
        price: { type: Number, required: [true, "Product price is required"], min: 0 },
        quantity: { type: Number, required: [true, "Product quantity is required"], min: 1 },
      },
    ],
    totalAmount: {
      type: Number,
      required: [true, "Total amount is required"],
      min: [0, "Total amount cannot be negative"],
    },
    adminCommission: {
      type: Number,
      default: 0
    },
    deliveryCharge: {
      type: Number,
      default: 0
    },
    tax: {
      type: Number,
      default: 0
    },
    paymentMethod: {
      type: String,
      required: [true, "Payment method is required"],
      enum: {
        values: ["COD", "Online"],
        message: "Payment method must be either COD or Online",
      },
    },
    paymentStatus: {
      type: String,
      default: "Pending",
      enum: ["Pending", "Paid", "Failed"],
    },
    status: {
      type: String,
      required: true,
      enum: [
        "Pending",
        "Confirmed",
        "Packaging",
        "Out for delivery",
        "Delivered",
        "Canceled",
        "Returned",
        "Failed to delivery",
      ],
      default: "Pending",
    },
    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan",
      default: null
    },

    deliveryRating: {
      type: Number,
      min: 1,
      max: 5,
      default: null
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
