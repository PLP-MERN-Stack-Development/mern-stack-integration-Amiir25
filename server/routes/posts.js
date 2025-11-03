const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Post = require('../models/post.js');

// GET all posts
router.get('/', async (req, res, next) => {
  try {
    const posts = await Post.find().populate('category');
    res.json(posts);
  } catch (err) {
    next(err);
  }
});

// GET a specific post
router.get('/:id', async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id).populate('category');
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (err) {
    next(err);
  }
});

// CREATE a new post
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('author').notEmpty().withMessage('Author is required')
  ],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const post = new Post(req.body);
      const newPost = await post.save();
      res.status(201).json(newPost);
    } catch (err) {
      next(err);
    }
  }
);

// UPDATE a post
router.put('/:id', async (req, res, next) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!updatedPost) return res.status(404).json({ message: 'Post not found' });
    res.json(updatedPost);
  } catch (err) {
    next(err);
  }
});

// DELETE a post
router.delete('/:id', async (req, res, next) => {
  try {
    const deletedPost = await Post.findByIdAndDelete(req.params.id);
    if (!deletedPost) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
