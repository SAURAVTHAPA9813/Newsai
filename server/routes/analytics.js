const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const ReadingSession = require('../models/ReadingSession');
const { UserStats } = require('../models/UserStats');
const { cacheMiddleware, userQueryKey } = require('../middleware/cache');

// Helper: Parse time range to date range
const getDateRange = (timeRange) => {
  const now = new Date();
  let startDate;

  switch (timeRange) {
    case '7d':
      startDate = new Date(now - 7 * 24 * 60 * 60 * 1000);
      break;
    case '30d':
      startDate = new Date(now - 30 * 24 * 60 * 60 * 1000);
      break;
    case '90d':
      startDate = new Date(now - 90 * 24 * 60 * 60 * 1000);
      break;
    case 'all':
    default:
      startDate = new Date(0); // Beginning of time
  }

  return { startDate, endDate: now };
};

// Helper: Build query filter
const buildFilter = (userId, filters) => {
  const query = { user: userId };

  const { startDate, endDate } = getDateRange(filters.timeRange || '30d');
  query.startedAt = { $gte: startDate, $lte: endDate };

  if (filters.device) {
    query.device = filters.device;
  }

  if (filters.topicId) {
    query['topic.id'] = filters.topicId;
  }

  return query;
};

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
router.get('/overview', protect, cacheMiddleware(120, userQueryKey), async (req, res) => {
  try {
    const filters = {
      timeRange: req.query.timeRange || '30d',
      device: req.query.device,
      topicId: req.query.topicId
    };

    const query = buildFilter(req.user._id, filters);
    const sessions = await ReadingSession.find(query).sort({ startedAt: -1 });

    // Calculate KPIs
    const totalMinutes = sessions.reduce((sum, s) => sum + s.durationMinutes, 0);
    const avgAnxiety = sessions.length > 0
      ? sessions.reduce((sum, s) => sum + s.selfReportedAnxiety, 0) / sessions.length
      : 0;

    const deepDiveSessions = sessions.filter(s => s.readingMode === 'deep_dive' || s.readingMode === 'intentional');
    const focusScore = deepDiveSessions.length > 0
      ? deepDiveSessions.reduce((sum, s) => sum + s.focusScore, 0) / deepDiveSessions.length
      : 50;

    const verifiedSessions = sessions.filter(s => s.verifyUsed);
    const truthScore = sessions.length > 0
      ? (verifiedSessions.length / sessions.length) * 100
      : 0;

    const kpis = {
      minutesRead: totalMinutes,
      focusScore: Math.round(focusScore),
      truthScore: Math.round(truthScore),
      cognitiveLoad: Math.round(avgAnxiety)
    };

    // Daily aggregates (last 30 days)
    const dailyMap = new Map();
    sessions.forEach(session => {
      const day = new Date(session.startedAt).toISOString().split('T')[0];
      if (!dailyMap.has(day)) {
        dailyMap.set(day, {
          date: day,
          minutesRead: 0,
          sessionsCount: 0,
          avgAnxiety: 0,
          anxietySum: 0
        });
      }
      const data = dailyMap.get(day);
      data.minutesRead += session.durationMinutes;
      data.sessionsCount += 1;
      data.anxietySum += session.selfReportedAnxiety;
      data.avgAnxiety = Math.round(data.anxietySum / data.sessionsCount);
    });

    const dailyAggregates = Array.from(dailyMap.values()).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    // Topic metrics
    const topicMap = new Map();
    sessions.forEach(session => {
      if (!session.topic?.id) return;

      if (!topicMap.has(session.topic.id)) {
        topicMap.set(session.topic.id, {
          topicId: session.topic.id,
          topicName: session.topic.name,
          minutesRead: 0,
          sessionsCount: 0,
          avgAnxiety: 0,
          anxietySum: 0,
          trend: 'stable',
          anxietyCorrelation: 0
        });
      }

      const data = topicMap.get(session.topic.id);
      data.minutesRead += session.durationMinutes;
      data.sessionsCount += 1;
      data.anxietySum += session.selfReportedAnxiety;
      data.avgAnxiety = Math.round(data.anxietySum / data.sessionsCount);
    });

    const topicMetrics = Array.from(topicMap.values())
      .sort((a, b) => b.minutesRead - a.minutesRead)
      .slice(0, 10);

    // Source metrics
    const sourceMap = new Map();
    sessions.forEach(session => {
      const tier = session.source?.tier || 'unknown';

      if (!sourceMap.has(tier)) {
        sourceMap.set(tier, {
          tier,
          sessionsCount: 0,
          minutesRead: 0
        });
      }

      const data = sourceMap.get(tier);
      data.sessionsCount += 1;
      data.minutesRead += session.durationMinutes;
    });

    const totalSessions = sessions.length;
    const sourceMetrics = {
      diversity: sourceMap.size,
      tierDistribution: Array.from(sourceMap.values()).map(s => ({
        ...s,
        percentage: totalSessions > 0 ? Math.round((s.sessionsCount / totalSessions) * 100) : 0
      })),
      premiumRatio: sourceMap.get('premium')?.sessionsCount || 0,
      reliability: Math.round(truthScore)
    };

    // Generate insights
    const insights = [];

    // Concentration insight
    if (focusScore >= 75) {
      insights.push({
        type: 'concentration',
        severity: 'positive',
        message: 'Excellent focus levels during deep reading sessions',
        recommendation: 'Keep up your intentional reading habits'
      });
    } else if (focusScore < 50) {
      insights.push({
        type: 'concentration',
        severity: 'warning',
        message: 'Lower focus detected during reading',
        recommendation: 'Try intentional reading mode for better engagement'
      });
    }

    // Diversity insight
    if (topicMetrics.length >= 5) {
      insights.push({
        type: 'diversity',
        severity: 'positive',
        message: `Reading across ${topicMetrics.length} different topics`,
        recommendation: 'Great topic diversity - keeps perspectives balanced'
      });
    } else if (topicMetrics.length <= 2) {
      insights.push({
        type: 'diversity',
        severity: 'info',
        message: 'Limited topic variety in recent reading',
        recommendation: 'Explore new topics in the Topic Matrix to broaden perspective'
      });
    }

    // Anxiety insight
    if (avgAnxiety > 70) {
      insights.push({
        type: 'anxiety',
        severity: 'warning',
        message: 'Higher anxiety levels detected',
        recommendation: 'Use Decompress mode to reduce information overload'
      });
    }

    // Truth score insight
    if (truthScore < 30) {
      insights.push({
        type: 'verification',
        severity: 'info',
        message: 'Low usage of verification tools',
        recommendation: 'Try the Verify feature to fact-check claims'
      });
    }

    // Transform KPIs object to kpiCards array for frontend
    const kpiCards = [
      {
        type: 'minutesRead',
        value: kpis.minutesRead,
        label: 'Minutes Read',
        trend: 'up',
        icon: 'clock'
      },
      {
        type: 'focusScore',
        value: kpis.focusScore,
        label: 'Focus Score',
        trend: kpis.focusScore >= 75 ? 'up' : kpis.focusScore < 50 ? 'down' : 'stable',
        icon: 'target'
      },
      {
        type: 'truthScore',
        value: kpis.truthScore,
        label: 'Truth Score',
        trend: kpis.truthScore >= 70 ? 'up' : kpis.truthScore < 30 ? 'down' : 'stable',
        icon: 'shield'
      },
      {
        type: 'cognitiveLoad',
        value: kpis.cognitiveLoad,
        label: 'Cognitive Load',
        trend: kpis.cognitiveLoad <= 30 ? 'down' : kpis.cognitiveLoad > 70 ? 'up' : 'stable',
        icon: 'brain'
      }
    ];

    res.json({
      success: true,
      data: {
        kpiCards,
        kpis,
        dailyAggregates,
        topicMetrics,
        sourceMetrics,
        insights,
        readingSessions: sessions.slice(0, 20), // Include recent sessions
        filters
      }
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching analytics overview'
    });
  }
});

// @desc    Get topic trends over time
// @route   GET /api/analytics/trends
// @access  Private
router.get('/trends', protect, cacheMiddleware(120, userQueryKey), async (req, res) => {
  try {
    const filters = {
      timeRange: req.query.timeRange || '30d',
      topicId: req.query.topicId
    };

    const query = buildFilter(req.user._id, filters);
    const sessions = await ReadingSession.find(query).sort({ startedAt: 1 });

    // Group by day and topic
    const trendMap = new Map();

    sessions.forEach(session => {
      if (!session.topic?.id) return;

      const day = new Date(session.startedAt).toISOString().split('T')[0];
      const key = `${day}-${session.topic.id}`;

      if (!trendMap.has(key)) {
        trendMap.set(key, {
          date: day,
          topicId: session.topic.id,
          topicName: session.topic.name,
          minutesRead: 0,
          sessionsCount: 0,
          avgAnxiety: 0,
          anxietySum: 0
        });
      }

      const data = trendMap.get(key);
      data.minutesRead += session.durationMinutes;
      data.sessionsCount += 1;
      data.anxietySum += session.selfReportedAnxiety;
      data.avgAnxiety = Math.round(data.anxietySum / data.sessionsCount);
    });

    const trends = Array.from(trendMap.values()).sort((a, b) =>
      new Date(a.date) - new Date(b.date)
    );

    res.json({
      success: true,
      data: trends
    });
  } catch (error) {
    console.error('Get analytics trends error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trends'
    });
  }
});

// @desc    Get content integrity metrics
// @route   GET /api/analytics/integrity
// @access  Private
router.get('/integrity', protect, cacheMiddleware(120, userQueryKey), async (req, res) => {
  try {
    const filters = {
      timeRange: req.query.timeRange || '30d'
    };

    const query = buildFilter(req.user._id, filters);
    const sessions = await ReadingSession.find(query);

    const verifiedCount = sessions.filter(s => s.verifyUsed).length;
    const opinionCount = sessions.filter(s => !s.verifyUsed).length;
    const total = sessions.length;

    const integrity = {
      verified: {
        count: verifiedCount,
        percentage: total > 0 ? Math.round((verifiedCount / total) * 100) : 0
      },
      opinion: {
        count: opinionCount,
        percentage: total > 0 ? Math.round((opinionCount / total) * 100) : 0
      },
      total,
      score: total > 0 ? Math.round((verifiedCount / total) * 100) : 0
    };

    res.json({
      success: true,
      data: integrity
    });
  } catch (error) {
    console.error('Get integrity metrics error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching integrity metrics'
    });
  }
});

// @desc    Track reading session
// @route   POST /api/analytics/sessions
// @access  Private
// @desc    Track reading session
// @route   POST /api/analytics/sessions
// @access  Private
router.post('/sessions', protect, async (req, res) => {
  try {
    // Parse and validate session data
    const sessionData = {
      user: req.user._id,
      startedAt: new Date(req.body.startedAt),
      endedAt: new Date(req.body.endedAt),
      durationMinutes: req.body.durationMinutes,
      device: req.body.device,
      readingMode: req.body.readingMode,
      topic: req.body.topic,
      source: req.body.source,
      articleId: req.body.articleId,
      articleTitle: req.body.articleTitle,
      articleUrl: req.body.articleUrl,
      wordCount: req.body.wordCount,
      moodTag: req.body.moodTag,
      selfReportedAnxiety: req.body.selfReportedAnxiety,
      completionRate: req.body.completionRate,
      engagementEvents: req.body.engagementEvents?.map(event => ({
        eventType: event.eventType,
        timestamp: new Date(event.timestamp),
        metadata: event.metadata
      })) || []
    };

    const session = new ReadingSession(sessionData);
    await session.save();

    // Update UserStats
    try {
      let userStats = await UserStats.findOne({ user: req.user._id });
      if (!userStats) {
        userStats = new UserStats({ user: req.user._id });
      }

      userStats.readingStats.articlesRead += 1;
      userStats.readingStats.timeSpentReading += session.durationMinutes;

      // Add recent activity
      userStats.recentActivity.unshift({
        type: 'article_read',
        timestamp: session.endedAt,
        details: {
          title: session.articleTitle,
          duration: session.durationMinutes
        }
      });

      // Keep only last 50 activities
      userStats.recentActivity = userStats.recentActivity.slice(0, 50);

      await userStats.save();
    } catch (statsError) {
      console.error('Error updating UserStats:', statsError);
      // Don't fail the session tracking if stats update fails
    }

    res.json({
      success: true,
      message: 'Session tracked successfully',
      data: session
    });
  } catch (error) {
    console.error('Track session error:', error);
    console.error('Error stack:', error.stack);
    console.error('Request body:', req.body);
    res.status(500).json({
      success: false,
      message: error.message || 'Error tracking session'
    });
  }
});

// @desc    Get reading sessions
// @route   GET /api/analytics/sessions
// @access  Private
router.get('/sessions', protect, async (req, res) => {
  try {
    const { startDate, endDate, topicId, limit = 50 } = req.query;

    const query = { user: req.user._id };

    if (startDate || endDate) {
      query.startedAt = {};
      if (startDate) query.startedAt.$gte = new Date(startDate);
      if (endDate) query.startedAt.$lte = new Date(endDate);
    }

    if (topicId) {
      query['topic.id'] = topicId;
    }

    const sessions = await ReadingSession.find(query)
      .sort({ startedAt: -1 })
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Get sessions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching sessions'
    });
  }
});

// @desc    Update session
// @route   PUT /api/analytics/sessions/:id
// @access  Private
router.put('/sessions/:id', protect, async (req, res) => {
  try {
    const session = await ReadingSession.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found'
      });
    }

    // Update allowed fields
    const allowedUpdates = ['endedAt', 'durationMinutes', 'engagementEvents',
                            'moodTag', 'selfReportedAnxiety', 'completionRate'];

    allowedUpdates.forEach(field => {
      if (req.body[field] !== undefined) {
        session[field] = req.body[field];
      }
    });

    await session.save();

    res.json({
      success: true,
      message: 'Session updated successfully',
      data: session
    });
  } catch (error) {
    console.error('Update session error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating session'
    });
  }
});

module.exports = router;
