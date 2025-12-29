const TrendingArticles = require('../models/TrendingArticles');
const newsService = require('./newsService');

/**
 * Trending Articles Caching Service
 * Fetches articles from all categories once per day at 8 AM
 * Maximizes daily API usage and caches results in MongoDB
 * Uses in-memory cache to avoid slow MongoDB queries
 */

// ===== IN-MEMORY CACHE =====
// This cache stores the daily trending articles in server memory
// to bypass slow MongoDB Atlas queries (which take 15+ seconds)
let memoryCache = {
  date: null,
  articles: {
    all: [],
    tech: [],
    business: [],
    sports: [],
    health: [],
    politics: []
  },
  categoryCounts: {
    all: 0,
    tech: 0,
    business: 0,
    sports: 0,
    health: 0,
    politics: 0
  },
  totalArticles: 0,
  lastUpdated: null
};

/**
 * Load trending articles from MongoDB into memory cache
 * Called on server startup to pre-warm the cache
 * @returns {Promise<boolean>} - Success status
 */
exports.loadCacheIntoMemory = async () => {
  try {
    console.log('💾 Loading trending articles cache into memory...');

    const today = new Date().toISOString().split('T')[0];

    // Try to get today's cache (with timeout)
    const cachePromise = TrendingArticles.getTodayArticles();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB query timeout')), 30000) // 30s for startup
    );

    let cache;
    try {
      cache = await Promise.race([cachePromise, timeoutPromise]);
    } catch (queryError) {
      console.warn('⚠️  MongoDB timeout loading cache:', queryError.message);

      // Try yesterday's cache as fallback
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      const yesterdayPromise = TrendingArticles.findOne({
        date: yesterday,
        status: 'completed'
      }).lean();

      try {
        cache = await Promise.race([yesterdayPromise, timeoutPromise]);
        console.log(`📅 Using yesterday's cache (${yesterday}) in memory`);
      } catch (err) {
        console.warn('⚠️  Could not load any cache into memory');
        return false;
      }
    }

    if (cache) {
      // Store in memory
      memoryCache.date = cache.date;
      memoryCache.articles = cache.articles || memoryCache.articles;
      memoryCache.categoryCounts = cache.categoryCounts || memoryCache.categoryCounts;
      memoryCache.totalArticles = cache.totalArticles || 0;
      memoryCache.lastUpdated = new Date();

      console.log(`✅ Loaded ${memoryCache.totalArticles} articles into memory cache (date: ${memoryCache.date})`);
      console.log(`📊 Memory cache categories:`, memoryCache.categoryCounts);
      return true;
    }

    return false;
  } catch (error) {
    console.error('❌ Error loading cache into memory:', error.message);
    return false;
  }
};

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

    // Update in-memory cache immediately
    memoryCache.date = today;
    memoryCache.articles = articlesData;
    memoryCache.categoryCounts = categoryCounts;
    memoryCache.totalArticles = totalArticles;
    memoryCache.lastUpdated = new Date();

    console.log(`✅ Daily trending cache generated: ${totalArticles} total articles`);
    console.log(`📊 Category breakdown:`, categoryCounts);
    console.log(`💾 Memory cache updated with fresh data`);

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
    console.log(`🔍 Getting trending articles for category: ${category}`);

    // ===== CHECK MEMORY CACHE FIRST (INSTANT) =====
    const today = new Date().toISOString().split('T')[0];

    if (memoryCache.date === today && memoryCache.articles[category]) {
      console.log(`⚡ INSTANT: Serving ${memoryCache.articles[category].length} ${category} articles from MEMORY cache`);
      return memoryCache.articles[category];
    }

    // Check if yesterday's cache is acceptable
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    if (memoryCache.date === yesterday && memoryCache.articles[category]) {
      console.log(`⚡ Serving ${memoryCache.articles[category].length} ${category} articles from MEMORY (yesterday's cache)`);

      // Trigger background refresh for today
      const needsGen = await TrendingArticles.needsGeneration().catch(() => false);
      if (needsGen) {
        console.log('🔄 Triggering background cache refresh...');
        exports.generateDailyCache().catch(err => {
          console.error('Background cache generation failed:', err);
        });
      }

      return memoryCache.articles[category];
    }

    // ===== MEMORY CACHE MISS - TRY MONGODB (SLOW) =====
    console.log('⚠️  Memory cache miss, querying MongoDB...');

    const cachePromise = TrendingArticles.getTodayArticles();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB query timeout')), 15000)
    );

    let cache;
    try {
      cache = await Promise.race([cachePromise, timeoutPromise]);
    } catch (queryError) {
      console.error('❌ MongoDB query timeout:', queryError.message);
      cache = null;
    }

    if (!cache) {
      console.log('⚠️  No MongoDB cache found for today, trying yesterday...');

      const yesterdayCachePromise = TrendingArticles.findOne({
        date: yesterday,
        status: 'completed'
      }).lean();

      let yesterdayCache;
      const yesterdayTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB query timeout')), 15000)
      );
      try {
        yesterdayCache = await Promise.race([yesterdayCachePromise, yesterdayTimeoutPromise]);
      } catch (queryError) {
        console.error('❌ Yesterday MongoDB query timeout:', queryError.message);
        yesterdayCache = null;
      }

      if (yesterdayCache) {
        console.log(`✅ Retrieved yesterday's cache from MongoDB (${yesterdayCache.date})`);

        // Update memory cache with yesterday's data
        memoryCache.date = yesterdayCache.date;
        memoryCache.articles = yesterdayCache.articles;
        memoryCache.categoryCounts = yesterdayCache.categoryCounts;
        memoryCache.totalArticles = yesterdayCache.totalArticles;
        memoryCache.lastUpdated = new Date();
        console.log(`💾 Updated memory cache with yesterday's data`);

        return yesterdayCache.articles[category] || [];
      }

      // No cache available - generate in background
      console.log('⚠️  No cache available. Triggering background generation...');
      const needsGen = await TrendingArticles.needsGeneration().catch(() => false);
      if (needsGen) {
        exports.generateDailyCache().catch(err => {
          console.error('Background cache generation failed:', err);
        });
      }

      return [];
    }

    // MongoDB query succeeded - update memory cache
    memoryCache.date = cache.date;
    memoryCache.articles = cache.articles;
    memoryCache.categoryCounts = cache.categoryCounts;
    memoryCache.totalArticles = cache.totalArticles;
    memoryCache.lastUpdated = new Date();

    console.log(`✅ Retrieved from MongoDB and updated memory cache (${cache.date}) - ${category} category`);
    return cache.articles[category] || [];

  } catch (error) {
    console.error('❌ Error getting trending articles:', error);

    // Last resort: return from memory cache if available
    if (memoryCache.articles[category] && memoryCache.articles[category].length > 0) {
      console.log(`🆘 FALLBACK: Serving stale data from memory cache (${memoryCache.date})`);
      return memoryCache.articles[category];
    }

    return []; // Return empty array on complete failure
  }
};

/**
 * Get all categories with counts
 * @returns {Promise<object>} - Category counts
 */
exports.getCategoryCounts = async () => {
  try {
    // ===== CHECK MEMORY CACHE FIRST (INSTANT) =====
    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (memoryCache.date === today || memoryCache.date === yesterday) {
      console.log(`⚡ INSTANT: Serving category counts from MEMORY cache (${memoryCache.date})`);
      return memoryCache.categoryCounts;
    }

    // ===== MEMORY CACHE MISS - TRY MONGODB (SLOW) =====
    console.log('⚠️  Memory cache miss for category counts, querying MongoDB...');

    const cachePromise = TrendingArticles.getTodayArticles();
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('MongoDB query timeout')), 15000)
    );

    let cache;
    try {
      cache = await Promise.race([cachePromise, timeoutPromise]);
    } catch (queryError) {
      console.error('❌ MongoDB query timeout (getCategoryCounts):', queryError.message);
      cache = null;
    }

    if (!cache) {
      // Try yesterday's cache
      const yesterdayCachePromise = TrendingArticles.findOne({
        date: yesterday,
        status: 'completed'
      }).lean();

      let yesterdayCache;
      const yesterdayTimeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('MongoDB query timeout')), 15000)
      );
      try {
        yesterdayCache = await Promise.race([yesterdayCachePromise, yesterdayTimeoutPromise]);
      } catch (queryError) {
        console.error('❌ Yesterday MongoDB query timeout (getCategoryCounts):', queryError.message);
        yesterdayCache = null;
      }

      if (yesterdayCache) {
        // Update memory cache
        memoryCache.date = yesterdayCache.date;
        memoryCache.articles = yesterdayCache.articles;
        memoryCache.categoryCounts = yesterdayCache.categoryCounts;
        memoryCache.totalArticles = yesterdayCache.totalArticles;
        memoryCache.lastUpdated = new Date();
        console.log(`💾 Updated memory cache with category counts from ${yesterdayCache.date}`);

        return yesterdayCache.categoryCounts;
      }

      // Return empty counts if nothing found
      return {
        all: 0,
        tech: 0,
        business: 0,
        sports: 0,
        health: 0,
        politics: 0
      };
    }

    // Update memory cache with fresh data
    memoryCache.date = cache.date;
    memoryCache.articles = cache.articles;
    memoryCache.categoryCounts = cache.categoryCounts;
    memoryCache.totalArticles = cache.totalArticles;
    memoryCache.lastUpdated = new Date();
    console.log(`💾 Updated memory cache with category counts from ${cache.date}`);

    return cache.categoryCounts;

  } catch (error) {
    console.error('❌ Error getting category counts:', error);

    // Fallback to memory cache if available
    if (memoryCache.categoryCounts && Object.keys(memoryCache.categoryCounts).length > 0) {
      console.log(`🆘 FALLBACK: Serving category counts from memory cache (${memoryCache.date})`);
      return memoryCache.categoryCounts;
    }

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
