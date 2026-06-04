// models/Deliveryman/DeliveryMan.js

const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliveryBoySchema = new mongoose.Schema(
  {
    // ================= BASIC INFO =================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    mobile: {
      type: String,
      required: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    // ================= DELIVERY DETAILS =================
    vehicleType: {
      type: String,
      enum: [
        "BIKE",
        "SCOOTER",
        "BICYCLE",
        "CAR",
      ],
      default: "BIKE",
    },

    vehicleNumber: {
      type: String,
      default: "",
      trim: true,
    },

    licenseNumber: {
      type: String,
      default: "",
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      default: "",
      trim: true,
    },

    // ================= DOCUMENTS =================
    aadhaarFront: {
      type: String,
      default: "",
    },

    aadhaarBack: {
      type: String,
      default: "",
    },

    drivingLicenseImage: {
      type: String,
      default: "",
    },

    vehicleImage: {
      type: String,
      default: "",
    },

    // ================= ADDRESS =================
    address: {
      type: String,
      default: "",
    },

    city: {
      type: String,
      default: "",
    },

    state: {
      type: String,
      default: "",
    },

    pincode: {
      type: String,
      default: "",
    },

    // ================= LIVE LOCATION =================
    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },

      coordinates: {
        type: [Number], // [longitude, latitude]
        default: [0, 0],
      },
    },

    // ================= STATUS =================
    isAvailable: {
      type: Boolean,
      default: true,
    },

    status: {
      type: String,
      enum: [
        "ONLINE",
        "OFFLINE",
        "ON_DELIVERY",
      ],
      default: "OFFLINE",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    isBlocked: {
      type: Boolean,
      default: false,
    },

    // ================= EARNINGS =================
    walletBalance: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    totalDeliveries: {
      type: Number,
      default: 0,
    },

    pendingPayout: {
      type: Number,
      default: 0,
    },

    // ================= BANK DETAILS =================
    bankName: {
      type: String,
      default: "",
    },

    accountHolderName: {
      type: String,
      default: "",
    },

    accountNumber: {
      type: String,
      default: "",
    },

    ifscCode: {
      type: String,
      default: "",
    },

    upiId: {
      type: String,
      default: "",
    },

    // ================= OTP =================
    otp: {
      type: String,
      default: "",
    },

    otpExpire: {
      type: Date,
      default: null,
    },

    // ================= DEVICE =================
    fcmToken: {
      type: String,
      default: "",
    },

    // ================= LOGIN =================
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// ================= GEO INDEX =================
deliveryBoySchema.index({
  currentLocation: "2dsphere",
});

// ================= PASSWORD HASH =================
deliveryBoySchema.pre(
  "save",
  async function () {

    if (!this.isModified("password"))
      return;

    this.password =
      await bcrypt.hash(
        this.password,
        12
      );
  }
);

// ================= PASSWORD MATCH =================
deliveryBoySchema.methods.comparePassword =
async function (password) {

  return bcrypt.compare(
    password,
    this.password
  );
};

// ================= EXPORT =================
module.exports = mongoose.model(
  "DeliveryMan",
  deliveryBoySchema
);