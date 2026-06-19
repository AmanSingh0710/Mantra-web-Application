const mongoose = require("mongoose");

const concernSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  image: {
    type: String
  },

  categories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category"
  }],

  priority: {
    type: Number,
    default: 0
  },

  status: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });