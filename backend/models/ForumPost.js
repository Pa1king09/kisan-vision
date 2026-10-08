const mongoose = require('mongoose');

const ForumPostSchema = new mongoose.Schema({
  title: { type: String, required: true, minlength: 5, maxlength: 200 },
  content: { type: String, required: true, minlength: 10 },
  author: { type: String, required: true, default: 'Anonymous Farmer' },
  crop_tag: { type: String, default: '' },
  category: {
    type: String,
    enum: ['pest', 'soil', 'weather', 'market', 'scheme', 'general'],
    default: 'general'
  },
  likes: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  answers: { type: Number, default: 0 },
  is_answered: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ForumPost', ForumPostSchema);
