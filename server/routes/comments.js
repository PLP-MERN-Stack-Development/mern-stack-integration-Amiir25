const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const Comment = require('../models/comment');
const Post = require('../models/post');

const router = express.Router();

// Get comments for post
router.get('/post/:postId', async (req, res, next) => {
  try {
    const comments = await Comment.find({ post: req.params.postId }).populate('authorId','username').sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) { next(err); }
});

// Create comment (auth)
router.post('/', auth, [
  body('post').notEmpty(),
  body('content').notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const { post, content } = req.body;
    const postExists = await Post.findById(post);
    if (!postExists) return res.status(404).json({ message: 'Post not found' });

    const comment = new Comment({
      post, content,
      author: req.user.username,
      authorId: req.user._id
    });
    const saved = await comment.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

// Delete comment (author or post owner or admin)
router.delete('/:id', auth, async (req, res, next) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) return res.status(404).json({ message: 'Not found' });

    const post = await Post.findById(comment.post);
    const isOwner = comment.authorId.equals(req.user._id);
    const isPostOwner = post && post.authorId.equals(req.user._id);
    if (!isOwner && !isPostOwner && req.user.role !== 'admin') return res.status(403).json({ message: 'Forbidden' });

    await comment.remove();
    res.json({ message: 'Deleted' });
  } catch (err) { next(err); }
});

module.exports = router;
