const UserActivity = require('../models/UserActivity');
const { UserStats } = require('../models/UserStats');

/**
 * Activity Aggregation Service
 * Calculates KPIs and aggregates user activity data for Neural Analytics
 */

/**
 * Calculate Platform Engagement (total time spent on platform in minutes)
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<number>} - Total time in minutes
 */
const calculatePlatformEngagement = async (userId, startDate, endDate) => {
  try {
    const result = await UserActivity.aggregate([
      {
        $match: {
          user: userId,
          action: 'time_spent',
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: null,
          totalSeconds: { $sum: '$duration' }
        }
      }
    ]);

    const totalMinutes = result.length > 0 ? Math.round(result[0].totalSeconds / 60) : 0;
    return totalMinutes;
  } catch (error) {
    console.error('❌ Error calculating platform engagement:', error);
    return 0;
  }
};

/**
 * Calculate Interaction Frequency (average actions per session)
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<number>} - Actions per session (rounded to 1 decimal)
 */
const calculateInteractionFrequency = async (userId, startDate, endDate) => {
  try {
    // Count total actions (excluding time_spent which is passive)
    const totalActions = await UserActivity.countDocuments({
      user: userId,
      action: { $ne: 'time_spent' },
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Count unique sessions
    const uniqueSessions = await UserActivity.distinct('sessionId', {
      user: userId,
      timestamp: { $gte: startDate, $lte: endDate }
    });

    const sessionsCount = uniqueSessions.length;

    if (sessionsCount === 0) return 0;

    const frequency = totalActions / sessionsCount;
    return Math.round(frequency * 10) / 10; // Round to 1 decimal
  } catch (error) {
    console.error('❌ Error calculating interaction frequency:', error);
    return 0;
  }
};

/**
 * Calculate Topic Diversity Score (0-100 based on unique topics/categories explored)
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<number>} - Diversity score 0-100
 */
const calculateTopicDiversity = async (userId, startDate, endDate) => {
  try {
    // Get unique topics from topic_click activities
    const topicActivities = await UserActivity.find({
      user: userId,
      action: 'topic_click',
      timestamp: { $gte: startDate, $lte: endDate },
      'metadata.topicName': { $exists: true }
    }).select('metadata.topicName');

    const uniqueTopics = new Set(
      topicActivities.map(a => a.metadata?.topicName).filter(Boolean)
    );

    // Get unique categories from interest_click and news_type_click
    const categoryActivities = await UserActivity.find({
      user: userId,
      action: { $in: ['interest_click', 'news_type_click'] },
      timestamp: { $gte: startDate, $lte: endDate },
      'metadata.category': { $exists: true }
    }).select('metadata.category');

    const uniqueCategories = new Set(
      categoryActivities.map(a => a.metadata?.category).filter(Boolean)
    );

    // Get unique pages visited
    const uniquePages = await UserActivity.distinct('page', {
      user: userId,
      action: 'page_visit',
      timestamp: { $gte: startDate, $lte: endDate }
    });

    // Scoring algorithm:
    // - Each unique topic: 5 points (max 10 topics = 50 points)
    // - Each unique category: 10 points (max 5 categories = 50 points)
    // - Each unique page: 5 points (bonus, can exceed 100)

    const topicScore = Math.min(uniqueTopics.size * 5, 50);
    const categoryScore = Math.min(uniqueCategories.size * 10, 50);
    const pageBonus = uniquePages.length * 5;

    const totalScore = Math.min(topicScore + categoryScore + pageBonus, 100);

    return Math.round(totalScore);
  } catch (error) {
    console.error('❌ Error calculating topic diversity:', error);
    return 0;
  }
};

/**
 * Calculate Active Days (number of unique days with activity)
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<number>} - Number of active days
 */
const calculateActiveDays = async (userId, startDate, endDate) => {
  try {
    const result = await UserActivity.aggregate([
      {
        $match: {
          user: userId,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          }
        }
      },
      {
        $count: 'activeDays'
      }
    ]);

    return result.length > 0 ? result[0].activeDays : 0;
  } catch (error) {
    console.error('❌ Error calculating active days:', error);
    return 0;
  }
};

/**
 * Get page-wise activity breakdown
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<Array>} - Array of {page, visits, timeSpent, actions}
 */
const getPageBreakdown = async (userId, startDate, endDate) => {
  try {
    const breakdown = await UserActivity.aggregate([
      {
        $match: {
          user: userId,
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$page',
          visits: {
            $sum: { $cond: [{ $eq: ['$action', 'page_visit'] }, 1, 0] }
          },
          timeSpent: {
            $sum: { $cond: [{ $eq: ['$action', 'time_spent'] }, '$duration', 0] }
          },
          actions: {
            $sum: { $cond: [{ $ne: ['$action', 'time_spent'] }, 1, 0] }
          }
        }
      },
      {
        $project: {
          page: '$_id',
          visits: 1,
          timeSpent: { $divide: ['$timeSpent', 60] }, // Convert to minutes
          actions: 1,
          _id: 0
        }
      },
      { $sort: { timeSpent: -1 } }
    ]);

    return breakdown;
  } catch (error) {
    console.error('❌ Error getting page breakdown:', error);
    return [];
  }
};

/**
 * Get topic interest scores based on all interactions
 * Uses weighted scoring: 40% time, 30% clicks, 20% saves, 10% sessions
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<Array>} - Array of {topic, score, interactions}
 */
const getTopicInterestScores = async (userId, startDate, endDate) => {
  try {
    // Get all topic-related activities
    const topicActivities = await UserActivity.find({
      user: userId,
      action: { $in: ['topic_click', 'interest_click'] },
      timestamp: { $gte: startDate, $lte: endDate },
      $or: [
        { 'metadata.topicName': { $exists: true } },
        { 'metadata.category': { $exists: true } }
      ]
    }).select('action metadata');

    // Get time spent per category/topic
    const timeActivities = await UserActivity.aggregate([
      {
        $match: {
          user: userId,
          action: 'time_spent',
          timestamp: { $gte: startDate, $lte: endDate }
        }
      },
      {
        $group: {
          _id: '$page',
          totalTime: { $sum: '$duration' }
        }
      }
    ]);

    // Build interest map
    const interestMap = new Map();

    // Process topic clicks (30% weight)
    topicActivities.forEach(activity => {
      const topic = activity.metadata?.topicName || activity.metadata?.category;
      if (!topic) return;

      if (!interestMap.has(topic)) {
        interestMap.set(topic, { clicks: 0, time: 0, sessions: new Set() });
      }

      const data = interestMap.get(topic);
      data.clicks += 1;
      if (activity.sessionId) {
        data.sessions.add(activity.sessionId);
      }
    });

    // Process time spent (40% weight) - map pages to categories
    const pageToCategory = {
      'dashboard': 'general',
      'trending': 'trending',
      'neural_analytics': 'analytics',
      'topic_matrix': 'topics',
      'verify_hub': 'verification',
      'iqlab': 'learning'
    };

    timeActivities.forEach(({ _id: page, totalTime }) => {
      const category = pageToCategory[page] || page;

      if (!interestMap.has(category)) {
        interestMap.set(category, { clicks: 0, time: 0, sessions: new Set() });
      }

      const data = interestMap.get(category);
      data.time += totalTime;
    });

    // Calculate weighted scores
    const interests = [];
    let maxScore = 0;

    interestMap.forEach((data, topic) => {
      // Normalize components
      const clickScore = data.clicks * 10; // Each click = 10 points
      const timeScore = (data.time / 60) * 5; // Each minute = 5 points
      const sessionScore = data.sessions.size * 20; // Each session = 20 points

      // Weighted total: 40% time, 30% clicks, 10% sessions
      const score = (timeScore * 0.4) + (clickScore * 0.3) + (sessionScore * 0.1);

      if (score > maxScore) maxScore = score;

      interests.push({
        topic,
        score: Math.round(score),
        interactions: {
          clicks: data.clicks,
          timeMinutes: Math.round(data.time / 60),
          sessions: data.sessions.size
        }
      });
    });

    // Normalize scores to 0-100 range
    const normalized = interests.map(item => ({
      ...item,
      score: maxScore > 0 ? Math.round((item.score / maxScore) * 100) : 0
    }));

    // Sort by score descending
    normalized.sort((a, b) => b.score - a.score);

    return normalized;
  } catch (error) {
    console.error('❌ Error calculating topic interest scores:', error);
    return [];
  }
};

/**
 * Get activity-based insights
 * @param {ObjectId} userId - User ID
 * @param {Date} startDate - Start of period
 * @param {Date} endDate - End of period
 * @returns {Promise<Array>} - Array of insight objects
 */
const getActivityInsights = async (userId, startDate, endDate) => {
  try {
    const insights = [];

    // Get key metrics for insight generation
    const [engagement, frequency, diversity, activeDays] = await Promise.all([
      calculatePlatformEngagement(userId, startDate, endDate),
      calculateInteractionFrequency(userId, startDate, endDate),
      calculateTopicDiversity(userId, startDate, endDate),
      calculateActiveDays(userId, startDate, endDate)
    ]);

    // Insight 1: Engagement level
    if (engagement > 120) { // More than 2 hours
      insights.push({
        type: 'engagement',
        severity: 'positive',
        message: `High platform engagement with ${engagement} minutes of active time`,
        metric: engagement
      });
    } else if (engagement < 15) { // Less than 15 minutes
      insights.push({
        type: 'engagement',
        severity: 'neutral',
        message: 'Low platform engagement detected. Explore more features to get personalized insights',
        metric: engagement
      });
    }

    // Insight 2: Interaction frequency
    if (frequency > 20) {
      insights.push({
        type: 'frequency',
        severity: 'positive',
        message: `Very active user with ${frequency} actions per session`,
        metric: frequency
      });
    }

    // Insight 3: Topic diversity
    if (diversity > 70) {
      insights.push({
        type: 'content_diversity_high',
        severity: 'positive',
        message: 'Excellent topic diversity! You explore a wide range of content',
        metric: diversity
      });
    } else if (diversity < 30) {
      insights.push({
        type: 'content_diversity_low',
        severity: 'suggestion',
        message: 'Consider exploring more diverse topics for richer insights',
        metric: diversity
      });
    }

    // Insight 4: Consistency
    const totalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const consistency = (activeDays / totalDays) * 100;

    if (consistency > 50) {
      insights.push({
        type: 'consistency',
        severity: 'positive',
        message: `Great consistency! Active on ${activeDays} out of ${totalDays} days`,
        metric: Math.round(consistency)
      });
    }

    return insights;
  } catch (error) {
    console.error('❌ Error generating activity insights:', error);
    return [];
  }
};

/**
 * Get complete activity analytics for a user
 * @param {ObjectId} userId - User ID
 * @param {number} days - Number of days to look back (default: 30)
 * @returns {Promise<Object>} - Complete activity analytics
 */
const getActivityAnalytics = async (userId, days = 30) => {
  try {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    console.log(`🔍 Calculating activity analytics for user ${userId} (last ${days} days)`);

    const [
      platformEngagement,
      interactionFrequency,
      topicDiversity,
      activeDays,
      pageBreakdown,
      topicInterests,
      insights
    ] = await Promise.all([
      calculatePlatformEngagement(userId, startDate, endDate),
      calculateInteractionFrequency(userId, startDate, endDate),
      calculateTopicDiversity(userId, startDate, endDate),
      calculateActiveDays(userId, startDate, endDate),
      getPageBreakdown(userId, startDate, endDate),
      getTopicInterestScores(userId, startDate, endDate),
      getActivityInsights(userId, startDate, endDate)
    ]);

    console.log(`✅ Activity analytics calculated successfully`);

    return {
      period: {
        startDate,
        endDate,
        days
      },
      kpis: {
        platformEngagement,      // minutes
        interactionFrequency,    // actions per session
        topicDiversity,          // 0-100 score
        activeDays               // number of days
      },
      breakdown: {
        byPage: pageBreakdown,
        byTopic: topicInterests
      },
      insights
    };
  } catch (error) {
    console.error('❌ Error getting activity analytics:', error);
    throw error;
  }
};

module.exports = {
  calculatePlatformEngagement,
  calculateInteractionFrequency,
  calculateTopicDiversity,
  calculateActiveDays,
  getPageBreakdown,
  getTopicInterestScores,
  getActivityInsights,
  getActivityAnalytics
};
