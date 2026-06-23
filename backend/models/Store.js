const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");


const storeSchema = new mongoose.Schema({

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  mobile: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  shopName: { type: String, required: true },
  shopAddress: { type: String, required: true },
  vendorImage: { type: String }, // Stores file path
  shopLogo: { type: String },    // Stores file path
  shopBanner: { type: String },  // Stores file path
  // ================= GST =================
  gstNumber: {
    type: String,
    default: "",
  },

  panNumber: {
    type: String,
    default: "",
  },

  // ================= BANK =================
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

  // ================= SHIPPING =================
  shippingCharge: {
    type: Number,
    default: 0,
  },

  freeShippingLimit: {
    type: Number,
    default: 0,
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

  // ================= SOCIAL LINKS =================
  facebook: {
    type: String,
    default: "",
  },

  instagram: {
    type: String,
    default: "",
  },

  twitter: {
    type: String,
    default: "",
  },

  youtube: {
    type: String,
    default: "",
  },

  // ================= PAYMENT =================
  codEnabled: {
    type: Boolean,
    default: true,
  },

  upiId: {
    type: String,
    default: "",
  },

  // ================= STORE TIMING =================
  openTime: {
    type: String,
    default: "",
  },

  closeTime: {
    type: String,
    default: "",
  },

  // ================= THEME =================
  primaryColor: {
    type: String,
    default: "#000000",
  },

  secondaryColor: {
    type: String,
    default: "#ffffff",
  },

  // ================= WALLET =================
  walletBalance: {
    type: Number,
    default: 0
  },

  totalEarnings: {
    type: Number,
    default: 0
  },

  pendingEarnings: {
    type: Number,
    default: 0
  },

  totalWithdrawn: {
    type: Number,
    default: 0
  },

  // ================= STORE DESCRIPTION =================
  description: {
    type: String,
    default: "",
  },
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] },

  isEmailVerified: {
    type: Boolean,
    default: true, // admin create kar raha hai to true rakh sakte ho
  },

  refreshToken: {
    type: String,
    default: null,
  },

  loginAttempts: {
    type: Number,
    default: 0,
  },

  lockUntil: {
    type: Date,
    default: null,
  },

  blocked: {
    type: Boolean,
    default: false,
  },

  lastLogin: {
    type: Date,
    default: null,
  },
}, { timestamps: true });



storeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

storeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

storeSchema.methods.handleLoginAttempt = async function (isMatch) {
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

storeSchema.methods.toJSON = function () {
  const obj = this.toObject();

  delete obj.password;
  delete obj.refreshToken;

  return obj;
};

module.exports = mongoose.model("Store", storeSchema);