const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },

    mobile: {
      type: String,
      required: true,
      unique: true,
      match: [/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"]
    },

    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false
    },

    storeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Store"
    },

    deliveryManId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryMan",
    },

    address: {
      type: String,
      required: true
    },

    pin: {
      type: String,
      required: true,
      match: [/^[0-9]{6}$/, "PIN code must be 6 digits"]
    },

    role: {
      type: String,
      enum: ["ADMIN", "USER", "VENDOR", "DELIVERY"],
      default: "USER"
    },

    isEmailVerified: { type: Boolean, default: false },
    isMobileVerified: { type: Boolean, default: false },

    image: {
      type: String,
    },

    imagePublicId: {
      type: String,
    },

    language: {
      type: String,
      enum: ["en", "hi", "fr", "es"],
      default: "en"
    },

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vendor-Product"
      }
    ],

    lastLogin: {
      type: Date
    },

    deviceInfo: {
      type: String,
      default: ""
    },

    passwordChangedAt: {
      type: Date
    },

    // ✅ REFRESH TOKEN
    refreshToken: String,

    // ✅ LOGIN SECURITY
    loginAttempts: { type: Number, default: 0 },
    lockUntil: Date,

    // ✅ SOFT DELETE
    isDeleted: { type: Boolean, default: false },

    blocked: { type: Boolean, default: false }
  },
  {
    timestamps: true
  }
);


// ✅ HASH PASSWORD
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});


// ✅ PASSWORD COMPARE
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};


// ✅ LOGIN ATTEMPT HANDLER
userSchema.methods.handleLoginAttempt = async function (isMatch) {
  const MAX_ATTEMPTS = 5;
  const LOCK_TIME = 15 * 60 * 1000;

  if (isMatch) {
    this.loginAttempts = 0;
    this.lockUntil = null;
  } else {
    this.loginAttempts += 1;

    if (this.loginAttempts >= MAX_ATTEMPTS) {
      this.lockUntil = Date.now() + LOCK_TIME;
    }
  }

  await this.save();
};


// ✅ REMOVE PASSWORD FROM RESPONSE
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.otp;
  delete obj.refreshToken;
  return obj;
};


module.exports = mongoose.model("User", userSchema);