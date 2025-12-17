const axios = require('axios');
const { analyzeArticle } = require('./articleAnalysisService');
const cache = require('../utils/cache');
const Article = require('../models/Article');
const { getInstance: getProviderManager } = require('./ProviderManager');

const NEWS_API_BASE = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWS_API_KEY;
const CACHE_TTL = 15 * 60 * 1000; // 15 minutes - FREE tier: 100 req/day limit

// Request counter to track daily usage (resets at midnight)
let dailyRequestCount = 0;
let lastResetDate = new Date().toDateString();

const MAX_DAILY_REQUESTS = 80; // Stay under 100/day limit (20 buffer for safety)

/**
 * Check and increment request counter
 * @throws {Error} if daily limit exceeded
 */
const checkRateLimit = () => {
  const today = new Date().toDateString();

  // Reset counter at midnight
  if (today !== lastResetDate) {
    dailyRequestCount = 0;
    lastResetDate = today;
    console.log('📊 Daily NewsAPI request counter reset');
  }

  // Check if limit exceeded
  if (dailyRequestCount >= MAX_DAILY_REQUESTS) {
    throw new Error(
      `NewsAPI daily limit reached (${dailyRequestCount}/${MAX_DAILY_REQUESTS}). ` +
      `Serving cached data only. Resets at midnight.`
    );
  }

  dailyRequestCount++;
  console.log(`📊 NewsAPI requests today: ${dailyRequestCount}/${MAX_DAILY_REQUESTS}`);
};

/**
 * Get latest top headlines using multi-provider fallback
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Number of articles per page (default: 20)
 * @returns {Promise<Array>} Array of news articles with analysis
 */
exports.getLatestNews = async (page = 1, pageSize = 20) => {
  // Check cache first
  const cacheKey = `headlines:${page}:${pageSize}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return cached;
  }

  try {
    console.log(`🔍 Cache MISS: ${cacheKey} - Fetching with multi-provider fallback`);

    // Get ProviderManager instance
    const providerManager = getProviderManager();

    // Fetch headlines with automatic fallback
    const result = await providerManager.fetchHeadlinesWithFallback({ page, pageSize });

    // Add realistic analysis to each article
    const articlesWithAnalysis = result.articles.map(article => {
      const analysis = analyzeArticle(article);
      return {
        ...article,
        // Add analysis data
        sourceScore: analysis.sourceScore,
        stressScore: analysis.anxietyScore,
        verificationBadge: analysis.verificationBadge,
        lifeImpact: analysis.lifeImpact,
        engagement: analysis.engagement,
        sourceTier: analysis.sourceTier,
        stressLevel: analysis.stressLevel
      };
    });

    // Cache the results
    cache.set(cacheKey, articlesWithAnalysis, CACHE_TTL);

    console.log(`✅ Fetched ${articlesWithAnalysis.length} headlines from ${result.provider} (quality: ${result.qualityWeight})`);

    return articlesWithAnalysis;
  } catch (error) {
    console.error('❌ Multi-provider headlines error:', error.message);
    throw new Error('Failed to fetch latest news from any provider');
  }
};

/**
 * Get news by category using multi-provider fallback
 * @param {string} category - Category (business, entertainment, general, health, science, sports, technology)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of news articles with analysis
 */
exports.getNewsByCategory = async (category, page = 1) => {
  // Check cache first
  const cacheKey = `category:${category}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return cached;
  }

  try {
    console.log(`🔍 Cache MISS: ${cacheKey} - Fetching with multi-provider fallback`);

    // Get ProviderManager instance
    const providerManager = getProviderManager();

    // Fetch by category with automatic fallback
    const result = await providerManager.fetchByCategoryWithFallback(category, { page, pageSize: 20 });

    // Add realistic analysis to each article
    const articlesWithAnalysis = result.articles.map(article => {
      const analysis = analyzeArticle({ ...article, category });
      return {
        ...article,
        category,
        sourceScore: analysis.sourceScore,
        stressScore: analysis.anxietyScore,
        verificationBadge: analysis.verificationBadge,
        lifeImpact: analysis.lifeImpact,
        engagement: analysis.engagement,
        sourceTier: analysis.sourceTier,
        stressLevel: analysis.stressLevel
      };
    });

    // Cache the results
    cache.set(cacheKey, articlesWithAnalysis, CACHE_TTL);

    console.log(`✅ Fetched ${articlesWithAnalysis.length} ${category} articles from ${result.provider} (quality: ${result.qualityWeight})`);

    return articlesWithAnalysis;
  } catch (error) {
    console.error(`❌ Multi-provider ${category} error:`, error.message);
    throw new Error(`Failed to fetch ${category} news from any provider`);
  }
};

/**
 * Get trending news (sorted by popularity)
 * @returns {Promise<Array>} Array of trending news articles
 */
exports.getTrendingNews = async () => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country: 'us',
        sortBy: 'popularity',
        pageSize: 10
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('NewsAPI Error (getTrendingNews):', error.response?.data || error.message);
    throw new Error('Failed to fetch trending news');
  }
};

/**
 * Search news by query using multi-provider fallback
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of news articles with analysis
 */
exports.searchNews = async (query, page = 1) => {
  // Check cache first
  const cacheKey = `search:${query}:${page}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log(`✅ Cache HIT: ${cacheKey}`);
    return cached;
  }

  try {
    console.log(`🔍 Cache MISS: ${cacheKey} - Searching with multi-provider fallback`);

    // Get ProviderManager instance
    const providerManager = getProviderManager();

    // Search with automatic fallback
    const result = await providerManager.searchWithFallback(query, { page, pageSize: 20 });

    // Add realistic analysis to each article
    const articlesWithAnalysis = result.articles.map(article => {
      const analysis = analyzeArticle(article);
      return {
        ...article,
        sourceScore: analysis.sourceScore,
        stressScore: analysis.anxietyScore,
        verificationBadge: analysis.verificationBadge,
        lifeImpact: analysis.lifeImpact,
        engagement: analysis.engagement,
        sourceTier: analysis.sourceTier,
        stressLevel: analysis.stressLevel
      };
    });

    // Cache the results
    cache.set(cacheKey, articlesWithAnalysis, CACHE_TTL);

    console.log(`✅ Found ${articlesWithAnalysis.length} search results from ${result.provider} (quality: ${result.qualityWeight})`);

    return articlesWithAnalysis;
  } catch (error) {
    console.error('❌ Multi-provider search error:', error.message);
    throw new Error('Failed to search news from any provider');
  }
};

/**
 * Get news headlines (wrapper for getLatestNews)
 * @param {number} page - Page number
 * @param {number} pageSize - Articles per page
 * @returns {Promise<Array>} Array of news articles
 */
exports.getHeadlines = async (page = 1, pageSize = 20) => {
  return exports.getLatestNews(page, pageSize);
};

/**
 * Category mapping from UI categories to NewsAPI categories
 */
const CATEGORY_MAPPING = {
  'Finance': 'business',
  'Tech': 'technology',
  'Healthcare': 'health',
  'Markets': 'business',
  'Global': 'general'
};

/**
 * Get news from multiple categories (personalized feed)
 * @param {Array<string>} categories - Array of UI category names (e.g., ['Finance', 'Tech'])
 * @param {number} articlesPerCategory - Number of articles per category (default: 5)
 * @returns {Promise<Object>} Object with categorized articles
 */
exports.getNewsByMultipleCategories = async (categories = [], articlesPerCategory = 5) => {
  // If no categories specified, return latest news
  if (!categories || categories.length === 0) {
    const articles = await exports.getLatestNews(1, 20);
    return {
      all: articles,
      byCategory: {}
    };
  }

  try {
    // Map UI categories to NewsAPI categories and remove duplicates
    const apiCategories = [...new Set(categories.map(cat => CATEGORY_MAPPING[cat] || cat.toLowerCase()))];

    console.log(`Fetching news for categories: ${apiCategories.join(', ')}`);

    // Fetch news for each category in parallel
    const categoryPromises = apiCategories.map(async (apiCategory) => {
      const cacheKey = `category:${apiCategory}:1`;
      const cached = cache.get(cacheKey);

      if (cached) {
        console.log(`Cache HIT: ${cacheKey}`);
        return { category: apiCategory, articles: cached.slice(0, articlesPerCategory) };
      }

      console.log(`Cache MISS: ${cacheKey} - Fetching from NewsAPI`);

      // Check rate limit before making request
      checkRateLimit();

      const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
        params: {
          apiKey: API_KEY,
          category: apiCategory,
          country: 'us',
          pageSize: articlesPerCategory
        }
      });

      // Add realistic analysis to each article
      const articlesWithAnalysis = response.data.articles.map(article => {
        const analysis = analyzeArticle({ ...article, category: apiCategory });
        return {
          ...article,
          category: apiCategory,
          sourceScore: analysis.sourceScore,
          stressScore: analysis.anxietyScore,
          verificationBadge: analysis.verificationBadge,
          lifeImpact: analysis.lifeImpact,
          engagement: analysis.engagement,
          sourceTier: analysis.sourceTier,
          stressLevel: analysis.stressLevel
        };
      });

      // Cache the results
      cache.set(cacheKey, articlesWithAnalysis, CACHE_TTL);

      return { category: apiCategory, articles: articlesWithAnalysis };
    });

    const results = await Promise.all(categoryPromises);

    // Combine all articles and create category-organized structure
    const allArticles = [];
    const byCategory = {};

    results.forEach(({ category, articles }) => {
      allArticles.push(...articles);
      byCategory[category] = articles;
    });

    // Sort all articles by published date (latest first)
    allArticles.sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));

    return {
      all: allArticles,
      byCategory,
      categories: apiCategories
    };
  } catch (error) {
    console.error('NewsAPI Error (getNewsByMultipleCategories):', error.response?.data || error.message);

    // Return cached data or empty result on error
    return {
      all: [],
      byCategory: {},
      categories: [],
      error: error.message
    };
  }
};

/**
 * Persist fetched articles to MongoDB for historical access
 * Performs bulk upsert operation (insert or update by URL)
 * @param {Array} articles - Array of articles to persist
 * @returns {Promise<Object>} Summary of upsert operation
 */
exports.persistArticles = async (articles) => {
  if (!articles || articles.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  try {
    const bulkOps = articles.map(article => ({
      updateOne: {
        filter: { url: article.url },
        update: {
          $set: {
            title: article.title,
            description: article.description,
            content: article.content,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source,
            author: article.author,
            category: article.category,
            provider: article.provider || 'newsapi',
            qualityWeight: article.qualityWeight || 50,
            lastSeenAt: new Date()
          },
          $setOnInsert: {
            fetchedAt: new Date(),
            viewCount: 0,
            saveCount: 0
          }
        },
        upsert: true
      }
    }));

    const result = await Article.bulkWrite(bulkOps);

    console.log(`📚 Persisted ${articles.length} articles: ${result.upsertedCount} new, ${result.modifiedCount} updated`);

    return {
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: articles.length
    };
  } catch (error) {
    console.error('Error persisting articles:', error.message);
    throw error;
  }
};

/**
 * Get historical articles from MongoDB
 * @param {string} range - Time range ('today', 'week', 'month')
 * @param {string} category - Optional category filter
 * @param {number} limit - Max articles to return (default: 20)
 * @returns {Promise<Array>} Array of articles
 */
exports.getHistoricalArticles = async (range = 'today', category = null, limit = 20) => {
  try {
    const now = new Date();
    let startDate;

    switch (range) {
      case 'today':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setDate(now.getDate() - 30));
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    const query = {
      fetchedAt: { $gte: startDate }
    };

    if (category && category !== 'all') {
      query.category = category;
    }

    const articles = await Article.find(query)
      .sort({ publishedAt: -1, fetchedAt: -1 })
      .limit(limit)
      .lean();

    return articles;
  } catch (error) {
    console.error('Error fetching historical articles:', error.message);
    throw error;
  }
};
