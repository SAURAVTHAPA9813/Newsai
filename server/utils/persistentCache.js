/**
 * Persistent Cache Service
 * Two-tier caching system for news articles:
 * - L1: In-memory cache (15-minute TTL, fast access)
 * - L2: MongoDB persistent cache (7-day TTL, fallback when APIs exhausted)
 */

const memoryCache = require('./cache'); // Existing in-memory cache
const CachedArticle = require('../models/CachedArticle');

class PersistentCacheService {
  /**
   * Get articles with two-tier fallback
   * @param {string} cacheKey - Cache key for memory cache
   * @param {object} options - Options for persistent cache
   * @param {string} options.category - Category for persistent fallback
   * @param {number} options.limit - Number of articles to return
   * @param {number} options.maxAgeHours - Max age in hours for persistent cache
   * @returns {Promise<{data: Array, source: string}>} - Articles and cache source
   */
  async get(cacheKey, options = {}) {
    const { category, limit = 20, maxAgeHours = 2 } = options; // Default 2 hours max age (was 48)

    // Try L1: In-memory cache first (fastest)
    const memCached = memoryCache.get(cacheKey);
    if (memCached) {
      console.log(`✅ L1 Cache HIT (memory): ${cacheKey}`);
      return {
        data: memCached,
        source: 'memory',
        age: 'fresh'
      };
    }

    console.log(`⏭️  L1 Cache MISS (memory): ${cacheKey}, checking persistent cache...`);

    // Try L2: Persistent MongoDB cache (slower but survives reloads)
    try {
      let persistedArticles;

      if (category && category !== 'general') {
        persistedArticles = await CachedArticle.getCachedByCategory(category, limit, maxAgeHours);
      } else {
        persistedArticles = await CachedArticle.getRecentCached(limit, maxAgeHours);
      }

      if (persistedArticles && persistedArticles.length > 0) {
        console.log(`✅ L2 Cache HIT (persistent): Found ${persistedArticles.length} cached articles`);

        // Record access for cache statistics
        const urls = persistedArticles.map(a => a.url);
        await CachedArticle.recordAccess(urls);

        // Also restore to memory cache for faster future access
        memoryCache.set(cacheKey, persistedArticles, 15 * 60 * 1000); // 15 minutes

        return {
          data: persistedArticles,
          source: 'persistent',
          age: this.calculateAge(persistedArticles[0]?.fetchedAt)
        };
      }

      console.log(`⏭️  L2 Cache MISS (persistent): No cached articles found for ${category || 'general'}`);
      return {
        data: null,
        source: 'none',
        age: null
      };
    } catch (error) {
      console.error('❌ Error accessing persistent cache:', error.message);
      return {
        data: null,
        source: 'error',
        age: null,
        error: error.message
      };
    }
  }

  /**
   * Set articles in both cache tiers
   * @param {string} cacheKey - Cache key for memory cache
   * @param {Array} articles - Articles to cache
   * @param {string} provider - Provider name
   * @param {number} memoryTTL - TTL for memory cache in ms (default: 15 min)
   * @returns {Promise<void>}
   */
  async set(cacheKey, articles, provider, memoryTTL = 15 * 60 * 1000) {
    if (!articles || articles.length === 0) {
      console.warn('⚠️  Attempted to cache empty article list');
      return;
    }

    try {
      // L1: Set in memory cache (fast access)
      memoryCache.set(cacheKey, articles, memoryTTL);
      console.log(`💾 L1 Cached ${articles.length} articles in memory: ${cacheKey}`);

      // L2: Set in persistent MongoDB cache (survives reloads)
      const result = await CachedArticle.bulkUpsertArticles(articles, provider);
      console.log(`💾 L2 Cached ${result.total} articles in database: ${result.inserted} new, ${result.updated} updated`);

    } catch (error) {
      console.error('❌ Error caching articles:', error.message);
      // Don't throw - caching failure shouldn't break the app
    }
  }

  /**
   * Get articles with API fallback logic
   * Priority: Memory Cache → Persistent Cache → API Call → Empty Array
   * @param {string} cacheKey - Cache key
   * @param {Function} apiFetcher - Async function that fetches from API
   * @param {object} cacheOptions - Options for cache lookup
   * @returns {Promise<{data: Array, source: string}>} - Articles and source
   */
  async getOrFetch(cacheKey, apiFetcher, cacheOptions = {}) {
    // Try cache first (both tiers)
    const cached = await this.get(cacheKey, cacheOptions);

    if (cached.data && cached.data.length > 0) {
      return cached;
    }

    // Cache miss - try to fetch from API
    try {
      console.log('🌐 Cache miss, fetching from API...');

      const fetchResult = await apiFetcher();

      if (!fetchResult || !fetchResult.articles || fetchResult.articles.length === 0) {
        console.warn('⚠️  API returned no articles');

        // Last resort: Try to get ANY cached articles, even if older (max 6 hours, not 3 days!)
        const oldCached = await this.get(cacheKey, { ...cacheOptions, maxAgeHours: 6 }); // 6 hours max
        if (oldCached.data && oldCached.data.length > 0) {
          console.log(`✅ Using recent cache as last resort (${oldCached.data.length} articles, max 6 hours old)`);
          return { ...oldCached, age: 'recent' };
        }

        return {
          data: [],
          source: 'none',
          age: null
        };
      }

      // Success - cache the fresh articles
      await this.set(cacheKey, fetchResult.articles, fetchResult.provider || 'unknown');

      return {
        data: fetchResult.articles,
        source: 'api',
        age: 'fresh',
        provider: fetchResult.provider
      };

    } catch (error) {
      console.error('❌ API fetch failed:', error.message);

      // API failed - fallback to persistent cache with longer max age (max 6 hours, not 3 days!)
      console.log('🔄 API failed, attempting extended persistent cache lookup...');

      const fallbackCached = await this.get(cacheKey, { ...cacheOptions, maxAgeHours: 6 }); // 6 hours max

      if (fallbackCached.data && fallbackCached.data.length > 0) {
        console.log(`✅ Using cached fallback (${fallbackCached.data.length} articles, age: ${fallbackCached.age}, max 6 hours old)`);
        return { ...fallbackCached, age: 'fallback' };
      }

      // Absolutely nothing available
      console.error('❌ No cached data available, returning empty array');
      return {
        data: [],
        source: 'none',
        age: null,
        error: error.message
      };
    }
  }

  /**
   * Calculate age description from fetch date
   * @param {Date} fetchedAt - When article was cached
   * @returns {string} - Age description
   */
  calculateAge(fetchedAt) {
    if (!fetchedAt) return 'unknown';

    const now = new Date();
    const hoursDiff = (now - new Date(fetchedAt)) / (1000 * 60 * 60);

    if (hoursDiff < 1) return 'fresh';
    if (hoursDiff < 6) return 'recent';
    if (hoursDiff < 24) return 'today';
    if (hoursDiff < 48) return 'yesterday';
    return 'stale';
  }

  /**
   * Clear both cache tiers
   * @param {string} cacheKey - Optional specific key to clear
   */
  async clear(cacheKey = null) {
    if (cacheKey) {
      memoryCache.delete(cacheKey);
      console.log(`🗑️  Cleared memory cache: ${cacheKey}`);
    } else {
      memoryCache.clear();
      console.log('🗑️  Cleared all memory cache');
    }

    // Note: We don't clear persistent cache automatically as it's meant for long-term storage
    // It has TTL-based auto-expiration (7 days)
  }

  /**
   * Get cache statistics from both tiers
   * @returns {Promise<object>} - Cache statistics
   */
  async getStats() {
    const memoryStats = memoryCache.stats();
    const persistentStats = await CachedArticle.getCacheStats();

    return {
      memory: memoryStats,
      persistent: persistentStats,
      timestamp: new Date()
    };
  }
}

// Export singleton instance
module.exports = new PersistentCacheService();
