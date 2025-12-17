const express = require('express');
const router = express.Router();
const {
  getHeadlines,
  searchNews,
  getNewsByCategory,
  saveArticle,
  getSavedArticles,
  removeSavedArticle,
  getTrendingTopics,
  getPersonalizedNews,
  generateAISummary,
  generateAISummariesBatch,
  getHistoricalNews
} = require('../controllers/newsController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/headlines', getHeadlines);
router.get('/search', searchNews);
router.get('/category/:category', getNewsByCategory);
router.get('/trending-topics', getTrendingTopics);
router.get('/history', getHistoricalNews);
router.post('/personalized', getPersonalizedNews);
router.post('/ai-summary', generateAISummary);
router.post('/ai-summaries-batch', generateAISummariesBatch);

// Protected routes (require authentication)
router.post('/save', protect, saveArticle);
router.get('/saved', protect, getSavedArticles);
router.delete('/saved/:articleId', protect, removeSavedArticle);

// Track article share
router.post('/share/:articleId', protect, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { platform } = req.body;

    // Log share event for analytics
    console.log(`Article ${articleId} shared on ${platform} by user ${req.user._id}`);

    // In production, you would store this in a database for analytics
    // For now, just acknowledge the share
    res.json({
      success: true,
      message: 'Share tracked successfully',
      data: {
        articleId,
        platform,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Share tracking error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track share'
    });
  }
});

module.exports = router;
