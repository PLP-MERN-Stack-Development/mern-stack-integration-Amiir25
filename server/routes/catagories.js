const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Category = require('../models/Category');

// GET all categories
router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// CREATE a new category
router.post(
  '/',
  [body('name').notEmpty().withMessage('Name is required')],
  async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const category = new Category(req.body);
      const newCategory = await category.save();
      res.status(201).json(newCategory);
    } catch (err) {
      if (err.code === 11000) return res.status(400).json({ message: 'Category already exists' });
      next(err);
    }
  }
);

module.exports = router;
