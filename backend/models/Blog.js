const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  content: {
    type: String // full blog content (optional for detail page)
  },
  image: {
    type: String, // store image path (uploads/blogs/xxx.jpg)
    required: true
  },
  author: {
    type: String,
    default: "Admin"
  },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "active"
  }
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);