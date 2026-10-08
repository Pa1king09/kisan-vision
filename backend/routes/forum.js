const express = require('express');
const router = express.Router();
const ForumPost = require('../models/ForumPost');
const ForumAnswer = require('../models/ForumAnswer');

// GET /api/forum/posts
router.get('/forum/posts', async (req, res) => {
  try {
    const { category, crop_tag, page = 1, limit = 10, search } = req.query;
    const filter = {};
    if (category && category !== 'all') filter.category = category;
    if (crop_tag) filter.crop_tag = { $regex: crop_tag, $options: 'i' };
    if (search) filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { content: { $regex: search, $options: 'i' } }
    ];

    const total = await ForumPost.countDocuments(filter);
    const posts = await ForumPost.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    res.json({ success: true, data: posts, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/posts
router.post('/forum/posts', async (req, res) => {
  try {
    const { title, content, author = 'Anonymous Farmer', crop_tag = '', category = 'general' } = req.body;
    if (!title || !content) return res.status(400).json({ success: false, message: 'Title and content required' });
    const post = await ForumPost.create({ title, content, author, crop_tag, category });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/forum/posts/:id
router.get('/forum/posts/:id', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } }, { new: true });
    if (!post) return res.status(404).json({ success: false, message: 'Post not found' });
    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/posts/:id/like
router.post('/forum/posts/:id/like', async (req, res) => {
  try {
    const post = await ForumPost.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ success: true, data: { likes: post.likes } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/forum/posts/:id/answers
router.get('/forum/posts/:id/answers', async (req, res) => {
  try {
    const answers = await ForumAnswer.find({ postId: req.params.id }).sort({ is_best_answer: -1, createdAt: -1 });
    res.json({ success: true, data: answers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/posts/:id/answers
router.post('/forum/posts/:id/answers', async (req, res) => {
  try {
    const { content, author = 'Anonymous Farmer' } = req.body;
    if (!content) return res.status(400).json({ success: false, message: 'Answer content required' });
    const answer = await ForumAnswer.create({ postId: req.params.id, content, author });
    await ForumPost.findByIdAndUpdate(req.params.id, { $inc: { answers: 1 }, is_answered: true });
    res.json({ success: true, data: answer });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/forum/answers/:id/like
router.post('/forum/answers/:id/like', async (req, res) => {
  try {
    const answer = await ForumAnswer.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
    res.json({ success: true, data: { likes: answer.likes } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
