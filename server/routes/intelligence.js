const express = require('express');
const router = express.Router();
const intelligenceBriefingService = require('../services/intelligenceBriefingService');
const { protect } = require('../middleware/auth');
const axios = require('axios');

/**
 * POST /api/intelligence/briefing
 * Generate intelligence briefing based on current news
 * Body: { mode: 'Global' | 'Markets' | 'Tech' | 'My Life' }
 */
router.post('/briefing', protect, async (req, res) => {
  try {
    const { mode = 'Global' } = req.body;

    // Fetch current top headlines from NewsAPI
    const newsApiResponse = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        country: 'us',
        pageSize: 20,
        apiKey: process.env.NEWS_API_KEY
      }
    });

    if (!newsApiResponse.data || !newsApiResponse.data.articles) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch news articles'
      });
    }

    const articles = newsApiResponse.data.articles;

    // Generate briefing using AI
    const briefing = await intelligenceBriefingService.generateBriefing(articles, mode);

    res.json({
      success: true,
      data: briefing
    });
  } catch (error) {
    console.error('Intelligence Briefing Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate intelligence briefing'
    });
  }
});

module.exports = router;
