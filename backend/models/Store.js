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
  mobile: { type: String, required: true,trim: true },
  email: { type: String, required: true, unique: true, lowercase: true,trim: true },
  password: { type: String, required: true },
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

// ================= STORE DESCRIPTION =================
description: {
  type: String,
  default: "",
},
  status: { type: String, default: "Active", enum: ["Active", "Inactive"] }
}, { timestamps: true });



storeSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 12);
});

storeSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

module.exports = mongoose.model("Store", storeSchema);