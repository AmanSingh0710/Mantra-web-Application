const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const deliveryManSchema = new mongoose.Schema(
  {
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
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Invalid Email",
      ],
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[6-9]\d{9}$/, "Invalid Mobile"],
    },

    password: {
      type: String,
      required: true,
      select: false,
    },

    image: {
      url: String,
      publicId: String,
    },

    vehicleType: {
      type: String,
      enum: ["BIKE", "SCOOTER", "BICYCLE", "CAR"],
      default: "BIKE",
    },

    vehicleNumber: {
      type: String,
      uppercase: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    aadhaarFront: {
      url: String,
      publicId: String,
    },

    aadhaarBack: {
      url: String,
      publicId: String,
    },

    drivingLicenseImage: {
      url: String,
      publicId: String,
    },

    vehicleImage: {
      url: String,
      publicId: String,
    },

    address: String,
    city: String,
    state: String,
    pincode: String,

    currentLocation: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number],
        default: [0, 0],
      },
    },

    status: {
      type: String,
      enum: ["ONLINE", "OFFLINE", "ON_DELIVERY"],
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

    totalDeliveries: {
      type: Number,
      default: 0,
    },

    totalEarnings: {
      type: Number,
      default: 0,
    },

    walletBalance: {
      type: Number,
      default: 0,
    },

    lastLogin: Date,
  },
  {
    timestamps: true,
  }
);

deliveryManSchema.index({
  currentLocation: "2dsphere",
});

deliveryManSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(
    this.password,
    12
  );
});

deliveryManSchema.methods.comparePassword =
  async function (password) {
    return bcrypt.compare(
      password,
      this.password
    );
  };

module.exports = mongoose.model(
  "DeliveryMan",
  deliveryManSchema
);