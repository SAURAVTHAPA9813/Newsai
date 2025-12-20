const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { UserStats } = require('../models/UserStats');
const { manualTrackReading } = require('../middleware/activityTracker');

/**
 * @route   GET /api/user-stats
 * @desc    Get current user's reading statistics
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    let stats = await UserStats.findOne({ user: req.user._id });

    if (!stats) {
      // Create default stats if not found
      stats = new UserStats({
        user: req.user._id,
        level: 1,
        totalXP: 0,
        readingStats: {
          articlesRead: 0,
          timeSpentReading: 0,
          averageReadTime: 0,
          comprehensionScore: 0
        },
        streaks: {
          current: 0,
          longest: 0,
          lastActiveDate: new Date()
        },
        recentActivity: []
      });
      await stats.save();
    }

    res.json({
      success: true,
      data: {
        level: stats.level,
        totalXP: stats.totalXP,
        readingStats: stats.readingStats,
        streaks: stats.streaks,
        achievements: stats.achievements,
        recentActivity: stats.recentActivity.slice(0, 10), // Last 10 activities
        savedArticlesCount: stats.savedArticles.length
      }
    });
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user statistics',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-stats/today
 * @desc    Get today's activity summary
 * @access  Private
 */
router.get('/today', protect, async (req, res) => {
  try {
    const stats = await UserStats.findOne({ user: req.user._id });

    if (!stats) {
      return res.json({
        success: true,
        data: {
          articlesReadToday: 0,
          timeSpentToday: 0,
          xpGainedToday: 0,
          focusScore: 0,
          timeSaved: 0,
          currentStreak: 0
        }
      });
    }

    // Calculate today's stats
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivities = stats.recentActivity.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    const articlesReadToday = todayActivities.filter(a =>
      a.type === 'article_read' || a.type === 'reading'
    ).length;

    const timeSpentToday = articlesReadToday * 2; // Estimate 2 min per article
    const xpGainedToday = todayActivities.reduce((sum, activity) =>
      sum + (activity.xpGained || 0), 0
    );

    // Calculate focus score (0-100)
    const focusScore = articlesReadToday > 0
      ? Math.min(Math.round(70 + (stats.streaks.current * 2) + (articlesReadToday * 5)), 100)
      : 0;

    // Calculate time saved (assume 3 min saved per article using reading modes)
    const timeSaved = Math.round(articlesReadToday * 3);

    res.json({
      success: true,
      data: {
        articlesReadToday,
        timeSpentToday,
        xpGainedToday,
        focusScore,
        timeSaved,
        currentStreak: stats.streaks.current,
        level: stats.level,
        totalXP: stats.totalXP
      }
    });
  } catch (error) {
    console.error('Error fetching today\'s stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch today\'s statistics',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/user-stats/track-read
 * @desc    Manually track article read event
 * @access  Private
 */
router.post('/track-read', protect, async (req, res) => {
  try {
    const { articleId, readingTime, readingMode } = req.body;

    if (!articleId) {
      return res.status(400).json({
        success: false,
        message: 'Article ID is required'
      });
    }

    const result = await manualTrackReading(req.user._id, {
      articleId,
      readingTime: parseInt(readingTime) || 2,
      readingMode: readingMode || '15m'
    });

    res.json({
      success: true,
      message: 'Reading activity tracked successfully',
      data: result
    });
  } catch (error) {
    console.error('Error tracking reading:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to track reading activity',
      error: error.message
    });
  }
});

/**
 * @route   GET /api/user-stats/leaderboard
 * @desc    Get XP leaderboard (top 10 users)
 * @access  Private
 */
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const topUsers = await UserStats.find()
      .sort({ totalXP: -1 })
      .limit(10)
      .populate('user', 'name email')
      .select('user level totalXP readingStats.articlesRead');

    res.json({
      success: true,
      data: topUsers.map((stats, index) => ({
        rank: index + 1,
        userId: stats.user._id,
        name: stats.user.name || 'Anonymous',
        level: stats.level,
        totalXP: stats.totalXP,
        articlesRead: stats.readingStats.articlesRead
      }))
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch leaderboard',
      error: error.message
    });
  }
});

module.exports = router;
