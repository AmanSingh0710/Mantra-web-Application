const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    bannerType: { type: String, default: "Main Banner" }, // UI match: Main/Footer
    image: { type: String, required: true },
    link: { type: String }, 
    published: { type: Boolean, default: true } // UI match: Toggle switch
  },
  { timestamps: true }
);

module.exports = mongoose.model("Banner", bannerSchema);