const mongoose = require("mongoose");

const BrandSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true, 
    trim: true 
  },
  image: { 
    type: String, 
    default: "" 
  },
  status: { 
    type: Boolean, 
    default: true 
  },
 
  totalProducts: { 
    type: Number, 
    default: 0 
  },
  totalOrders: { 
    type: Number, 
    default: 0 
  }
}, { timestamps: true });

module.exports = mongoose.model("Brand", BrandSchema);