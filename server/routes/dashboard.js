const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { calculateGlobalVolatility } = require('../services/articleAnalysisService');
const { extractTrendingTopics, getMarketData } = require('../services/trendAnalysisService');
const newsService = require('../services/newsService');
const dashboardService = require('../services/dashboardService');

/**
 * @desc    Get consolidated dashboard overview (all data in one call)
 * @route   GET /api/dashboard/overview
 * @access  Private
 */
router.get('/overview', protect, async (req, res) => {
  try {
    const { page, limit, readingMode, category } = req.query;

    const overview = await dashboardService.getDashboardOverview(req.user, {
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 20,
      readingMode: readingMode || '15m',
      category: category || 'all'
    });

    res.json(overview);
  } catch (error) {
    console.error('Dashboard overview error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch dashboard overview'
    });
  }
});

/**
 * @desc    Get global volatility index
 * @route   GET /api/dashboard/volatility
 * @access  Private
 */
router.get('/volatility', protect, async (req, res) => {
  try {
    // Fetch recent headlines for volatility calculation
    const articles = await newsService.getHeadlines(1, 50);

    if (!articles || articles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch articles for volatility calculation'
      });
    }

    const volatility = calculateGlobalVolatility(articles);

    res.json({
      success: true,
      data: {
        volatility: volatility.index,
        sourceCount: volatility.sourceCount,
        breakingNewsCount: volatility.breakingNewsCount,
        avgAnxiety: volatility.avgAnxiety,
        lastUpdated: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Volatility calculation error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to calculate volatility'
    });
  }
});

/**
 * @desc    Get market data (S&P 500, BTC, VIX)
 * @route   GET /api/dashboard/market-data
 * @access  Public
 */
router.get('/market-data', async (req, res) => {
  try {
    const marketData = getMarketData();

    res.json({
      success: true,
      data: marketData
    });
  } catch (error) {
    console.error('Market data error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch market data'
    });
  }
});

/**
 * @desc    Get global vectors (trending stories with momentum)
 * @route   GET /api/dashboard/global-vectors
 * @access  Private
 */
router.get('/global-vectors', protect, async (req, res) => {
  try {
    // Fetch recent headlines
    const articles = await newsService.getHeadlines(1, 50);

    if (!articles || articles.length === 0) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch articles'
      });
    }

    // Extract trending topics
    const trends = extractTrendingTopics(articles, 5);

    // Transform into "global vectors" format for the wellness panel
    const vectors = trends.map(trend => ({
      topic: trend.name,
      momentum: trend.change,
      category: trend.category,
      mentions: trend.mentions
    }));

    res.json({
      success: true,
      data: vectors
    });
  } catch (error) {
    console.error('Global vectors error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch global vectors'
    });
  }
});

module.exports = router;
