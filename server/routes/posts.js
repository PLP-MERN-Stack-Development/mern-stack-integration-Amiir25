const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/post');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/posts?search=&category=&page=1&limit=10
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search = '', category } = req.query;
    const q = {};

    if (search) {
      q.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) q.category = category;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [posts, total] = await Promise.all([
      Post.find(q)
        .populate('category')
        .populate('authorId', 'username')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Post.countDocuments(q)
    ]);

    res.json({
      data: posts,
      meta: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET single
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category').populate('authorId', 'username');
    if (!post) return res.status(404).json({ message: 'Not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// CREATE (authenticated)
router.post('/', auth, [
  body('title').notEmpty(),
  body('content').notEmpty(),
  body('category').notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const post = new Post({
      ...req.body,
      author: req.user.username,
      authorId: req.user._id
    });
    const saved = await post.save();
    res.status(201).json(saved);
  } catch (err) {
    next(err);
  }
});

// UPDATE (only owner)
router.put('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (!post.authorId.equals(req.user._id)) return res.status(403).json({ message: 'Forbidden' });

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (err) { next(err); }
});

// DELETE (only owner or admin)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });
    if (!post.authorId.equals(req.user._id) && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    await post.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

// Like/unlike
router.post('/:id/like', auth, async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Not found' });

    const idx = post.likes.findIndex(u => u.equals(req.user._id));
    if (idx === -1) post.likes.push(req.user._id);
    else post.likes.splice(idx, 1);

    await post.save();
    res.json({ likes: post.likes.length });
  } catch (err) { next(err); }
});

module.exports = router;
