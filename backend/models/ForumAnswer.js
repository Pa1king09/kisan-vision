const mongoose = require('mongoose');

const ForumAnswerSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumPost', required: true },
  content: { type: String, required: true, minlength: 5 },
  author: { type: String, required: true, default: 'Anonymous Farmer' },
  likes: { type: Number, default: 0 },
  is_best_answer: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('ForumAnswer', ForumAnswerSchema);
