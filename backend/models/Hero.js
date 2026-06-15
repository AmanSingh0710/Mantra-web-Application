// ================= models/Hero.js =================

const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema({
  image: {
    publicId: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  },

  mobileImage: {
    publicId: String,
    url: String
  },

  position: {
    type: Number,
    default: 0,
    index: true
  },

  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
});