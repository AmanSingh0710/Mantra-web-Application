const mongoose = require('mongoose');

const storySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'A story must have a title'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'A story must have a description'],
    trim: true
  },
  imageUrl: {
    type: String,
    required: [true, 'A story must have an image URL']
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Story', storySchema);