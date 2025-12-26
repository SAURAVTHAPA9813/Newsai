const express = require('express');
const router = express.Router();
const trendingArticlesService = require('../services/trendingArticlesService');

/**
 * Trending Articles Routes
 * Serves cached trending articles that update once daily at 8 AM
 */

// @desc    Get trending articles by category
// @route   GET /api/trending?category=all
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { category = 'all' } = req.query;

    console.log(`🔍 Trending request: category=${category}`);

    // Validate category
    const validCategories = ['all', 'tech', 'business', 'sports', 'health', 'politics'];
    const selectedCategory = validCategories.includes(category) ? category : 'all';

    // Get cached trending articles
    const articles = await trendingArticlesService.getTrendingArticles(selectedCategory);

    // Get category counts for UI
    const categoryCounts = await trendingArticlesService.getCategoryCounts();

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        articles: articles,
        category: selectedCategory,
        count: articles.length,
        categoryCounts: categoryCounts
      }
    });

  } catch (error) {
    console.error('❌ Trending route error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch trending articles',
      message: error.message
    });
  }
});

// @desc    Force regenerate trending cache (admin use)
// @route   POST /api/trending/regenerate
// @access  Public (should be protected in production)
router.post('/regenerate', async (req, res) => {
  try {
    console.log('🔄 Force regenerating trending cache...');

    const cache = await trendingArticlesService.generateDailyCache();

    res.json({
      success: true,
      message: 'Trending cache regenerated successfully',
      data: {
        date: cache.date,
        totalArticles: cache.totalArticles,
        categoryCounts: cache.categoryCounts
      }
    });

  } catch (error) {
    console.error('❌ Regenerate error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to regenerate trending cache',
      message: error.message
    });
  }
});

// @desc    Get cache status
// @route   GET /api/trending/status
// @access  Public
router.get('/status', async (req, res) => {
  try {
    const TrendingArticles = require('../models/TrendingArticles');

    const today = new Date().toISOString().split('T')[0];
    const cache = await TrendingArticles.findOne({ date: today });

    const needsGen = await TrendingArticles.needsGeneration();

    res.json({
      success: true,
      data: {
        date: today,
        cacheExists: !!cache,
        status: cache?.status || 'none',
        totalArticles: cache?.totalArticles || 0,
        categoryCounts: cache?.categoryCounts || {},
        needsGeneration: needsGen,
        generatedAt: cache?.generatedAt || null
      }
    });

  } catch (error) {
    console.error('❌ Status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get cache status'
    });
  }
});

module.exports = router;
