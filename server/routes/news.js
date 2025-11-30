const express = require('express');
const router = express.Router();
const {
  getHeadlines,
  searchNews,
  getNewsByCategory,
  saveArticle,
  getSavedArticles,
  removeSavedArticle
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/headlines', getHeadlines);
router.get('/search', searchNews);
router.get('/category/:category', getNewsByCategory);

// Protected routes (require authentication)
router.post('/save', protect, saveArticle);
router.get('/saved', protect, getSavedArticles);
router.delete('/saved/:articleId', protect, removeSavedArticle);

module.exports = router;
