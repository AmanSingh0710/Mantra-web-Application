const mongoose = require('mongoose');

const AttributeSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
}, { timestamps: true });

module.exports = mongoose.model('Attribute', AttributeSchema);