const express = require('express');
const router = express.Router();
const newsController = require('../controllers/newsController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/latest', newsController.getLatest);
router.get('/category/:category', newsController.getByCategory);
router.get('/trending', newsController.getTrending);

// Protected routes (need JWT)
router.post('/save', protect, newsController.saveArticle);
router.get('/saved', protect, newsController.getSavedArticles);
router.delete('/saved/:id', protect, newsController.deleteSavedArticle);

module.exports = router;
