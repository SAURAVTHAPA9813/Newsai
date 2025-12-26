const TrendingArticles = require('../models/TrendingArticles');
const newsService = require('./newsService');

/**
 * Trending Articles Caching Service
 * Fetches articles from all categories once per day at 8 AM
 * Maximizes daily API usage and caches results in MongoDB
 */

/**
 * Generate and cache trending articles for all categories
 * @returns {Promise<object>} - Cached trending articles document
 */
exports.generateDailyCache = async () => {
  try {
    console.log('📰 Generating daily trending articles cache...');

    const today = new Date().toISOString().split('T')[0];

    // Categories to fetch (maps to newsService categories)
    const categories = [
      { key: 'all', newsCategory: null, limit: 50 },      // General news
      { key: 'tech', newsCategory: 'technology', limit: 30 },
      { key: 'business', newsCategory: 'business', limit: 30 },
      { key: 'sports', newsCategory: 'sports', limit: 25 },
      { key: 'health', newsCategory: 'health', limit: 25 },
      { key: 'politics', newsCategory: 'general', limit: 25 } // Politics maps to general
    ];

    const articlesData = {
      all: [],
      tech: [],
      business: [],
      sports: [],
      health: [],
      politics: []
    };

    let totalArticles = 0;

    // Fetch articles for each category
    for (const cat of categories) {
      try {
        console.log(`🔍 Fetching ${cat.key} articles...`);

        let articles;
        if (cat.newsCategory) {
          articles = await newsService.getNewsByCategory(cat.newsCategory, 1, cat.limit);
        } else {
          articles = await newsService.getHeadlines(1, cat.limit);
        }

        if (articles && articles.length > 0) {
          // Normalize article data
          const normalizedArticles = articles.map(article => ({
            title: article.title,
            description: article.description || '',
            url: article.url,
            imageUrl: article.urlToImage || article.imageUrl || '',
            source: {
              id: article.source?.id || '',
              name: article.source?.name || article.source || 'Unknown'
            },
            category: cat.key,
            publishedAt: article.publishedAt || new Date(),
            author: article.author || '',
            content: article.content || article.description || ''
          }));

          articlesData[cat.key] = normalizedArticles;
          totalArticles += normalizedArticles.length;

          console.log(`✅ Fetched ${normalizedArticles.length} ${cat.key} articles`);
        } else {
          console.log(`⚠️  No articles found for ${cat.key}`);
        }

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`❌ Error fetching ${cat.key} articles:`, error.message);
        articlesData[cat.key] = []; // Empty array on error
      }
    }

    // Calculate category counts
    const categoryCounts = {
      all: articlesData.all.length,
      tech: articlesData.tech.length,
      business: articlesData.business.length,
      sports: articlesData.sports.length,
      health: articlesData.health.length,
      politics: articlesData.politics.length
    };

    // Save to database
    const cacheDoc = new TrendingArticles({
      date: today,
      articles: articlesData,
      totalArticles: totalArticles,
      categoryCounts: categoryCounts,
      status: 'completed'
    });

    await cacheDoc.save();

    console.log(`✅ Daily trending cache generated: ${totalArticles} total articles`);
    console.log(`📊 Category breakdown:`, categoryCounts);

    return cacheDoc;

  } catch (error) {
    console.error('❌ Error generating daily trending cache:', error);

    // Log failed attempt
    const today = new Date().toISOString().split('T')[0];
    await TrendingArticles.create({
      date: today,
      status: 'failed',
      error: error.message
    });

    throw error;
  }
};

/**
 * Get trending articles (from cache or generate if needed)
 * @param {string} category - Category filter (all, tech, business, etc.)
 * @returns {Promise<array>} - Array of articles
 */
exports.getTrendingArticles = async (category = 'all') => {
  try {
    // Check if we need to generate new cache
    const needsGen = await TrendingArticles.needsGeneration();

    if (needsGen) {
      console.log('🔄 Generating new trending cache...');
      await exports.generateDailyCache();
    }

    // Get today's cache
    const cache = await TrendingArticles.getTodayArticles();

    if (!cache) {
      // If still no cache (before 8 AM), try yesterday's cache
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const yesterdayCache = await TrendingArticles.findOne({
        date: yesterday,
        status: 'completed'
      });

      if (yesterdayCache) {
        console.log(`✅ Retrieved yesterday's trending cache (${yesterdayCache.date})`);
        return yesterdayCache.articles[category] || [];
      }

      // No cache available, generate immediately
      console.log('⚠️  No cache available, generating now...');
      const newCache = await exports.generateDailyCache();
      return newCache.articles[category] || [];
    }

    console.log(`✅ Retrieved trending articles from cache (${cache.date}) - ${category} category`);
    return cache.articles[category] || [];

  } catch (error) {
    console.error('❌ Error getting trending articles:', error);
    return []; // Return empty array on error
  }
};

/**
 * Get all categories with counts
 * @returns {Promise<object>} - Category counts
 */
exports.getCategoryCounts = async () => {
  try {
    const cache = await TrendingArticles.getTodayArticles();

    if (!cache) {
      // Try yesterday
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const yesterdayCache = await TrendingArticles.findOne({
        date: yesterday,
        status: 'completed'
      });

      return yesterdayCache?.categoryCounts || {
        all: 0,
        tech: 0,
        business: 0,
        sports: 0,
        health: 0,
        politics: 0
      };
    }

    return cache.categoryCounts;

  } catch (error) {
    console.error('❌ Error getting category counts:', error);
    return {
      all: 0,
      tech: 0,
      business: 0,
      sports: 0,
      health: 0,
      politics: 0
    };
  }
};
