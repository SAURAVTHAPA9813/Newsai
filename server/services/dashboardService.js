const newsService = require('./newsService');
const trendAnalysisService = require('./trendAnalysisService');
const articleAnalysisService = require('./articleAnalysisService');
const intelligenceBriefingService = require('./intelligenceBriefingService');
const marketDataService = require('./marketDataService');
const { UserStats } = require('../models/UserStats');

/**
 * Map frontend interest categories to NewsAPI categories
 */
const mapCategoryToNewsAPI = (category) => {
  const categoryMap = {
    'finance': 'business',
    'tech': 'technology',
    'healthcare': 'health',
    'markets': 'business',
    'global': 'general'
  };

  return categoryMap[category?.toLowerCase()] || null;
};

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

    // Map category to NewsAPI format
    const apiCategory = category && category !== 'all' ? mapCategoryToNewsAPI(category) : null;

    console.log('🔍 Dashboard Overview Request:', {
      originalCategory: category,
      mappedCategory: apiCategory,
      readingMode,
      page,
      limit
    });

    // Fetch articles - use category-specific or general headlines
    const articles = apiCategory
      ? await newsService.getNewsByCategory(apiCategory, page)
      : await newsService.getHeadlines(page, limit);

    console.log(`✅ Fetched ${articles.length} articles for category: ${apiCategory || 'all'}`);

    // Extract trending topics from articles
    const trendingTopics = articles.length > 0
      ? trendAnalysisService.analyzeTrends(articles)
      : { trends: [], marketData: {}, lastUpdated: new Date().toISOString() };

    // Get market data
    const marketData = await getMarketData();

    // Generate intelligence briefing
    let briefing = null;
    try {
      briefing = await intelligenceBriefingService.generateBriefing(articles, 'Global');
    } catch (error) {
      console.error('Briefing generation error:', error);
      // Fallback briefing
      briefing = {
        globalSituation: 'Intelligence briefing temporarily unavailable',
        globalDelta: 'Please refresh to retry',
        impactOnYou: {
          industry: 'General',
          region: 'Global',
          summary: 'Unable to generate personalized insights at this time',
          keyPoints: []
        }
      };
    }

    // Calculate volatility
    const volatility = await calculateGlobalVolatility();

    // Get global vectors
    const globalVectorsData = await getGlobalVectors();

    // Get user stats
    const userStats = await getUserReadingStats(user._id);
    const focusScore = userStats.articlesReadToday > 0
      ? Math.min(Math.round(70 + (userStats.currentStreak * 2) + (userStats.articlesReadToday * 5)), 100)
      : 0;
    const timeSaved = Math.round(userStats.articlesReadToday * 3); // 3 min saved per article

    // Build consolidated response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        articles: articles,
        trending: trendingTopics,
        trendingTopics: trendingTopics.trends || [],
        market: marketData,
        briefing: briefing,
        volatility: volatility,
        globalVectors: globalVectorsData.vectors || [],
        userStats: {
          articlesReadToday: userStats.articlesReadToday,
          timeSpentToday: userStats.timeSpentToday,
          focusScore: focusScore,
          timeSaved: timeSaved,
          currentStreak: userStats.currentStreak,
          level: userStats.level,
          totalXP: userStats.totalXP
        },
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
  try {
    // Fetch real-time market data from Finnhub API
    return await marketDataService.getRealTimeMarketData();
  } catch (error) {
    console.error('Error fetching market data:', error);
    // Fallback to simulated data
    return marketDataService.getFallbackMarketData();
  }
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
