const { UserStats } = require('../models/UserStats');

/**
 * Track article read event
 * Middleware to automatically track when users read articles
 */
const trackArticleRead = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user._id;
      const articleId = req.params.articleId || req.body.articleId;
      const readingTime = req.body.readingTime || req.query.readingTime || 2; // Default 2 minutes

      // Find or create user stats
      let stats = await UserStats.findOne({ user: userId });

      if (!stats) {
        stats = new UserStats({
          user: userId,
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
      }

      // Update reading stats
      stats.readingStats.articlesRead += 1;
      stats.readingStats.timeSpentReading += parseInt(readingTime);

      // Update average read time
      stats.readingStats.averageReadTime = Math.round(
        stats.readingStats.timeSpentReading / stats.readingStats.articlesRead
      );

      // Update streak
      stats.updateStreak();

      // Add recent activity
      stats.recentActivity.unshift({
        type: 'article_read',
        description: `Read article`,
        articleId: articleId,
        xpGained: 5,
        timestamp: new Date()
      });

      // Keep only last 50 activities
      if (stats.recentActivity.length > 50) {
        stats.recentActivity = stats.recentActivity.slice(0, 50);
      }

      // Add XP
      stats.addXP(5);

      await stats.save();

      console.log(`✅ Tracked article read for user ${userId}: +5 XP, ${readingTime} min`);
    }
  } catch (error) {
    console.error('❌ Activity tracking error:', error);
    // Don't block the request if tracking fails
  }
  next();
};

/**
 * Track AI feature usage
 * Middleware to track when users use AI features (Explain, Market Impact, etc.)
 */
const trackAIFeatureUse = (featureType) => {
  return async (req, res, next) => {
    try {
      if (req.user) {
        const userId = req.user._id;

        let stats = await UserStats.findOne({ user: userId });

        if (!stats) {
          stats = new UserStats({ user: userId });
        }

        // Add activity
        stats.recentActivity.unshift({
          type: 'ai_feature_used',
          description: `Used ${featureType} feature`,
          xpGained: 3,
          timestamp: new Date()
        });

        // Keep only last 50 activities
        if (stats.recentActivity.length > 50) {
          stats.recentActivity = stats.recentActivity.slice(0, 50);
        }

        // Add XP for using AI features
        stats.addXP(3);

        await stats.save();

        console.log(`✅ Tracked ${featureType} use for user ${userId}: +3 XP`);
      }
    } catch (error) {
      console.error('❌ AI feature tracking error:', error);
      // Don't block the request if tracking fails
    }
    next();
  };
};

/**
 * Track save article event
 */
const trackArticleSave = async (req, res, next) => {
  try {
    if (req.user) {
      const userId = req.user._id;

      let stats = await UserStats.findOne({ user: userId });

      if (!stats) {
        stats = new UserStats({ user: userId });
      }

      stats.recentActivity.unshift({
        type: 'article_saved',
        description: 'Saved article for later',
        xpGained: 2,
        timestamp: new Date()
      });

      // Keep only last 50 activities
      if (stats.recentActivity.length > 50) {
        stats.recentActivity = stats.recentActivity.slice(0, 50);
      }

      stats.addXP(2);

      await stats.save();

      console.log(`✅ Tracked article save for user ${userId}: +2 XP`);
    }
  } catch (error) {
    console.error('❌ Article save tracking error:', error);
  }
  next();
};

/**
 * Manually track reading session
 * Used when frontend explicitly sends tracking data
 */
const manualTrackReading = async (userId, readingData) => {
  try {
    let stats = await UserStats.findOne({ user: userId });

    if (!stats) {
      stats = new UserStats({ user: userId });
    }

    const { articleId, readingTime, readingMode } = readingData;

    // Update reading stats
    stats.readingStats.articlesRead += 1;
    stats.readingStats.timeSpentReading += parseInt(readingTime || 2);
    stats.readingStats.averageReadTime = Math.round(
      stats.readingStats.timeSpentReading / stats.readingStats.articlesRead
    );

    // Update streak
    stats.updateStreak();

    // Calculate XP based on reading time
    const xpGained = Math.min(Math.round(readingTime / 2) + 3, 10); // 3-10 XP

    stats.recentActivity.unshift({
      type: 'reading',
      description: `Read article in ${readingMode || '15m'} mode`,
      articleId: articleId,
      xpGained: xpGained,
      timestamp: new Date()
    });

    // Keep only last 50 activities
    if (stats.recentActivity.length > 50) {
      stats.recentActivity = stats.recentActivity.slice(0, 50);
    }

    stats.addXP(xpGained);

    await stats.save();

    return {
      success: true,
      xpGained,
      totalXP: stats.totalXP,
      level: stats.level,
      streak: stats.streaks.current
    };
  } catch (error) {
    console.error('❌ Manual tracking error:', error);
    throw error;
  }
};

module.exports = {
  trackArticleRead,
  trackAIFeatureUse,
  trackArticleSave,
  manualTrackReading
};
