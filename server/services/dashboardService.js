const newsService = require('./newsService');
const trendAnalysisService = require('./trendAnalysisService');
const articleAnalysisService = require('./articleAnalysisService');
const intelligenceBriefingService = require('./intelligenceBriefingService');
const { UserStats } = require('../models/UserStats');

/**
 * Get consolidated dashboard overview with all necessary data in one call
 * @param {Object} user - Authenticated user object
 * @param {Object} options - Query parameters (page, limit, readingMode, category)
 * @returns {Promise<Object>} - Complete dashboard data
 */
const getDashboardOverview = async (user, options = {}) => {
  try {
    const {
      page = 1,
      limit = 20,
      readingMode = '15m',
      category = 'all'
    } = options;

    // Fetch all data in parallel for maximum performance
    const [
      articlesResult,
      trendingTopics,
      marketData,
      userStats,
      briefing,
      volatilityData,
      globalVectors
    ] = await Promise.allSettled([
      // 1. Articles with analysis
      newsService.getHeadlines(page, limit, category),

      // 2. Trending topics
      trendAnalysisService.getTrendingTopics(),

      // 3. Market data
      getMarketData(),

      // 4. User reading stats
      getUserReadingStats(user._id),

      // 5. Intelligence briefing
      intelligenceBriefingService.generateIntelligenceBriefing(),

      // 6. Global volatility
      calculateGlobalVolatility(),

      // 7. Global vectors (trending stories)
      getGlobalVectors()
    ]);

    // Build consolidated response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        articles: articlesResult.status === 'fulfilled' ? articlesResult.value : [],
        trending: trendingTopics.status === 'fulfilled' ? trendingTopics.value : { trends: [] },
        market: marketData.status === 'fulfilled' ? marketData.value : getDefaultMarketData(),
        userStats: userStats.status === 'fulfilled' ? userStats.value : getDefaultUserStats(),
        briefing: briefing.status === 'fulfilled' ? briefing.value : null,
        volatility: volatilityData.status === 'fulfilled' ? volatilityData.value : { index: 50 },
        globalVectors: globalVectors.status === 'fulfilled' ? globalVectors.value : { vectors: [] },
        metadata: {
          readingMode,
          category,
          page,
          limit
        }
      }
    };

    return response;
  } catch (error) {
    console.error('Dashboard overview error:', error);
    throw new Error('Failed to fetch dashboard overview');
  }
};

/**
 * Get market data (S&P 500, BTC, VIX)
 */
const getMarketData = async () => {
  // In production, this would fetch from a real market data API
  // For now, return realistic mock data
  return {
    sp500: { value: 4235 + Math.random() * 100 - 50, change: (Math.random() * 2 - 1).toFixed(2) },
    btc: { value: 43200 + Math.random() * 1000 - 500, change: (Math.random() * 4 - 2).toFixed(2) },
    vix: { value: (18 + Math.random() * 4 - 2).toFixed(1), change: (Math.random() * 1 - 0.5).toFixed(2) }
  };
};

/**
 * Get default market data fallback
 */
const getDefaultMarketData = () => ({
  sp500: { value: 4235, change: 0 },
  btc: { value: 43200, change: 0 },
  vix: { value: 18.2, change: 0 }
});

/**
 * Get user reading statistics
 */
const getUserReadingStats = async (userId) => {
  try {
    const stats = await UserStats.findOne({ user: userId });

    if (!stats) {
      return getDefaultUserStats();
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

    return {
      articlesReadToday,
      timeSpentToday,
      xpGainedToday,
      currentStreak: stats.streaks.current,
      totalArticlesRead: stats.readingStats.articlesRead,
      level: stats.level,
      totalXP: stats.totalXP
    };
  } catch (error) {
    console.error('Error fetching user stats:', error);
    return getDefaultUserStats();
  }
};

/**
 * Get default user stats fallback
 */
const getDefaultUserStats = () => ({
  articlesReadToday: 0,
  timeSpentToday: 0,
  xpGainedToday: 0,
  currentStreak: 0,
  totalArticlesRead: 0,
  level: 1,
  totalXP: 0
});

/**
 * Calculate global volatility
 */
const calculateGlobalVolatility = async () => {
  try {
    const articles = await newsService.getHeadlines(1, 50);
    const volatility = articleAnalysisService.calculateGlobalVolatility(articles);
    return {
      index: volatility.index,
      sourceCount: volatility.sourceCount,
      breakingNewsCount: volatility.breakingNewsCount,
      avgAnxiety: volatility.avgAnxiety,
      lastUpdated: new Date().toISOString()
    };
  } catch (error) {
    console.error('Volatility calculation error:', error);
    return { index: 50, sourceCount: 0, breakingNewsCount: 0, avgAnxiety: 0 };
  }
};

/**
 * Get global vectors (trending stories with momentum)
 */
const getGlobalVectors = async () => {
  try {
    const trending = await trendAnalysisService.getTrendingTopics();

    if (!trending || !trending.trends) {
      return { vectors: [] };
    }

    // Transform trending topics into global vectors
    const vectors = trending.trends.slice(0, 5).map((trend, index) => ({
      id: `vector-${index}`,
      title: trend.name,
      category: trend.category || 'General',
      momentum: Math.abs(trend.change),
      importance: Math.min(trend.change * 2, 100),
      updateTime: 'Just now'
    }));

    return { vectors };
  } catch (error) {
    console.error('Global vectors error:', error);
    return { vectors: [] };
  }
};

module.exports = {
  getDashboardOverview,
  getMarketData,
  getUserReadingStats,
  calculateGlobalVolatility,
  getGlobalVectors
};
