const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Category name is required"],
    trim: true
  },

  description: {
    type: String
  },

  image: {
    publicId: {
      type: String,
      default: ""
    },
    url: {
      type: String,
      default: ""
    }
  },

  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    default: null
  },

  level: {
    type: Number,
    default: 1 // 1 = Category, 2 = Sub, 3 = Sub-Sub
  },

  priority: {
    type: Number,
    default: 0
  }

}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
