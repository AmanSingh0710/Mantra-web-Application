// ================= models/Hero.js =================

const mongoose = require("mongoose");

const heroSchema = new mongoose.Schema(
  {
   

    image: {
      type: String,
      required: true,
      trim: true,
    },

    mobileImage: {
      type: String,
      default: "",
      trim: true,
    },

    position: {
      type: Number,
      default: 0,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

heroSchema.index({ position: 1 });

module.exports = mongoose.model("Hero", heroSchema);