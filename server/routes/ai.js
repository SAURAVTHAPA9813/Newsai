const express = require('express');
const router = express.Router();
const geminiService = require('../services/geminiService');
const { protect } = require('../middleware/auth');

/**
 * POST /api/ai/explain
 * Generate simplified explanation of an article
 * Body: { title, description, content }
 */
router.post('/explain', protect, async (req, res) => {
  try {
    const { title, description, content } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required'
      });
    }

    const article = { title, description, content };
    const explanation = await geminiService.explainArticle(article);

    res.json({
      success: true,
      data: explanation
    });
  } catch (error) {
    console.error('AI Explain Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate explanation'
    });
  }
});

/**
 * POST /api/ai/market-impact
 * Get market impact analysis
 * Body: { title, description, category }
 */
router.post('/market-impact', protect, async (req, res) => {
  try {
    const { title, description, category } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required'
      });
    }

    const article = { title, description, category };
    const marketImpact = await geminiService.getMarketImpact(article);

    res.json({
      success: true,
      data: marketImpact
    });
  } catch (error) {
    console.error('AI Market Impact Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate market impact analysis'
    });
  }
});

/**
 * POST /api/ai/perspectives
 * Get different perspectives on an article
 * Body: { title, description }
 */
router.post('/perspectives', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required'
      });
    }

    const article = { title, description };
    const perspectives = await geminiService.getPerspectives(article);

    res.json({
      success: true,
      data: perspectives
    });
  } catch (error) {
    console.error('AI Perspectives Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate perspectives analysis'
    });
  }
});

/**
 * POST /api/ai/context
 * Get historical context and timeline
 * Body: { title, description }
 */
router.post('/context', protect, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Article title is required'
      });
    }

    const article = { title, description };
    const context = await geminiService.getContext(article);

    res.json({
      success: true,
      data: context
    });
  } catch (error) {
    console.error('AI Context Error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate context analysis'
    });
  }
});

module.exports = router;
