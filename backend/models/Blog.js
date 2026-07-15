const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      index: true
    },

    description: {
      type: String,
      required: true,
      maxlength: 500
    },

    content: {
      type: String,
      required: true
    },
    
    category: {
      type: String,
      default: "General"
    },

    image: {
      type: String,
      required: true
    },

    imagePublicId: {
      type: String,
      required: true
    },

    author: {
      type: String,
      default: "Admin"
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
      index: true
    },

    views: {
      type: Number,
      default: 0
    }
  },
  {
    timestamps: true
  });

blogSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Blog", blogSchema);