const express = require('express');
const router = express.Router();
const intelligenceBriefingService = require('../services/intelligenceBriefingService');

/**
 * GET /api/intelligence-briefing
 * Get current active intelligence briefing
 */
router.get('/', async (req, res) => {
  try {
    console.log('📡 GET /api/intelligence-briefing');

    const userId = req.user?.id || null; // Optional user ID from auth middleware

    // Get current briefing (will generate if needed)
    const briefing = await intelligenceBriefingService.getCurrentBriefing(userId, false);

    // Format for frontend
    const formattedBriefing = intelligenceBriefingService.formatBriefing(briefing);

    res.json({
      success: true,
      data: formattedBriefing,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error fetching intelligence briefing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch intelligence briefing',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * POST /api/intelligence-briefing/refresh
 * Manually refresh the briefing (force regeneration)
 */
router.post('/refresh', async (req, res) => {
  try {
    console.log('🔄 POST /api/intelligence-briefing/refresh - Manual refresh requested');

    const userId = req.user?.id || null;

    // Force generate new briefing
    const briefing = await intelligenceBriefingService.getCurrentBriefing(userId, true);

    // Format for frontend
    const formattedBriefing = intelligenceBriefingService.formatBriefing(briefing);

    res.json({
      success: true,
      data: formattedBriefing,
      refreshed: true,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error refreshing intelligence briefing:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to refresh intelligence briefing',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
});

/**
 * GET /api/intelligence-briefing/status
 * Check if a new briefing needs to be generated
 */
router.get('/status', async (req, res) => {
  try {
    const userId = req.user?.id || null;
    const IntelligenceBriefing = require('../models/IntelligenceBriefing');

    const needsGeneration = await IntelligenceBriefing.needsGeneration(userId);
    const currentBriefing = await IntelligenceBriefing.getCurrentBriefing(userId);

    res.json({
      success: true,
      data: {
        needsGeneration,
        hasCurrent: !!currentBriefing,
        currentGenerationTime: currentBriefing?.generationTime,
        currentDate: currentBriefing?.date,
        status: currentBriefing?.status
      },
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error checking briefing status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to check briefing status',
      timestamp: new Date().toISOString()
    });
  }
});

module.exports = router;
