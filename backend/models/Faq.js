const mongoose = require("mongoose");

const FaqSchema = new mongoose.Schema({
  category: { 
    type: String, 
    required: true 
  },
  icon: { 
    type: String, 
    default: "FaQuestionCircle" // Stores icon name like 'FaTruck'
  },
  questions: [
    {
      q: { type: String, required: true },
      a: { type: String, required: true }
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("Faq", FaqSchema);