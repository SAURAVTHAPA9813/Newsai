/**
 * Multi-Key Provider Base Class
 * Extends BaseNewsProvider with category-aware API key selection
 * Supports multiple API keys for different news categories to maximize free tier quotas
 */

const BaseNewsProvider = require('./BaseNewsProvider');

class MultiKeyProvider extends BaseNewsProvider {
  /**
   * Create a multi-key provider
   * @param {object} config - Provider configuration
   */
  constructor(config) {
    super(config);

    // Category-to-API-key mapping
    // Maps UI categories to their assigned API keys
    this.categoryKeyMap = this.initializeCategoryKeys();

    // Track rate limits per key
    this.keyMetrics = {};

    console.log(`🔑 ${this.displayName} initialized with ${Object.keys(this.categoryKeyMap).length} category-specific keys`);
  }

  /**
   * Initialize category-to-key mapping from environment variables
   * Format: {PROVIDER}_PRIMARY_{CATEGORY} and {PROVIDER}_SECONDARY_{CATEGORY}
   * @returns {object} - Category to keys mapping
   */
  initializeCategoryKeys() {
    // Normalize provider name for env var format
    // Extract base name before any dot/suffix: "newsdata.io" → "NEWSDATA", "newsapi.org" → "NEWSAPI"
    const baseName = this.name.split('.')[0]; // Get part before first dot
    const providerPrefix = baseName.toUpperCase().replace(/[\-\s]/g, ''); // Remove hyphens and spaces
    const categoryKeyMap = {};

    console.log(`🔍 ${this.displayName}: Looking for keys with prefix "${providerPrefix}_PRIMARY_*"`);

    // Define category mappings
    const categories = {
      tech: ['technology', 'tech'],
      finance: ['business', 'finance', 'markets'],
      health: ['health', 'healthcare', 'science'],
      general: ['general', 'world', 'entertainment', 'sports']
    };

    // Load keys for each category
    for (const [categoryGroup, categoryAliases] of Object.entries(categories)) {
      const primaryKeyName = `${providerPrefix}_PRIMARY_${categoryGroup.toUpperCase()}`;
      const secondaryKeyName = `${providerPrefix}_SECONDARY_${categoryGroup.toUpperCase()}`;

      const primaryKey = process.env[primaryKeyName];
      const secondaryKey = process.env[secondaryKeyName];

      if (primaryKey) {
        console.log(`  ✅ Found ${primaryKeyName}: ${primaryKey.substring(0, 15)}...`);
      }
      if (secondaryKey) {
        console.log(`  ✅ Found ${secondaryKeyName}: ${secondaryKey.substring(0, 15)}...`);
      }

      const keys = [];
      if (primaryKey) keys.push({ key: primaryKey, tier: 'primary', category: categoryGroup });
      if (secondaryKey) keys.push({ key: secondaryKey, tier: 'secondary', category: categoryGroup });

      // Map all category aliases to these keys
      categoryAliases.forEach(alias => {
        if (keys.length > 0) {
          categoryKeyMap[alias] = keys;
        }
      });
    }

    // Fallback: Use single global key if no category-specific keys
    if (Object.keys(categoryKeyMap).length === 0 && this.apiKey) {
      console.log(`⚠️  ${this.displayName}: No category-specific keys found, using single global key`);
      return { _global: [{ key: this.apiKey, tier: 'global', category: 'all' }] };
    }

    return categoryKeyMap;
  }

  /**
   * Get API key for a specific category with automatic fallback
   * @param {string} category - UI category (technology, business, health, general)
   * @returns {object|null} - { key: string, tier: string, category: string } or null
   */
  getKeyForCategory(category) {
    // Normalize category
    const normalizedCategory = (category || 'general').toLowerCase();

    // Check if we have category-specific keys
    let keys = this.categoryKeyMap[normalizedCategory];

    // Fallback to general if category not found
    if (!keys || keys.length === 0) {
      keys = this.categoryKeyMap['general'] || this.categoryKeyMap['_global'];
    }

    // Still no keys? Use provider's default key
    if (!keys || keys.length === 0) {
      if (this.apiKey) {
        return { key: this.apiKey, tier: 'global', category: 'all' };
      }
      return null;
    }

    // Try each key in order (primary first, then secondary)
    for (const keyInfo of keys) {
      // Initialize metrics if not exists
      if (!this.keyMetrics[keyInfo.key]) {
        this.keyMetrics[keyInfo.key] = {
          requestCount: 0,
          lastReset: new Date(),
          failures: 0,
          category: keyInfo.category,
          tier: keyInfo.tier
        };
      }

      const metrics = this.keyMetrics[keyInfo.key];

      // Reset daily counters if needed
      this.resetKeyMetricsIfNeeded(keyInfo.key);

      // Check if this key has quota remaining
      if (metrics.requestCount < this.rateLimit.max) {
        return keyInfo;
      }

      console.log(`⚠️  ${this.displayName} ${keyInfo.tier} key for ${keyInfo.category} exhausted (${metrics.requestCount}/${this.rateLimit.max})`);
    }

    // All keys exhausted for this category
    console.error(`❌ ${this.displayName}: All keys exhausted for category "${normalizedCategory}"`);
    return null;
  }

  /**
   * Increment request counter for a specific API key
   * @param {string} apiKey - The API key that was used
   */
  incrementKeyCount(apiKey) {
    if (!this.keyMetrics[apiKey]) {
      this.keyMetrics[apiKey] = {
        requestCount: 0,
        lastReset: new Date(),
        failures: 0
      };
    }

    this.resetKeyMetricsIfNeeded(apiKey);
    this.keyMetrics[apiKey].requestCount++;

    const metrics = this.keyMetrics[apiKey];
    console.log(`📊 ${this.displayName} [${metrics.tier || 'global'}/${metrics.category || 'all'}]: ${metrics.requestCount}/${this.rateLimit.max} requests used`);
  }

  /**
   * Reset key metrics if 24 hours have passed
   * @param {string} apiKey - The API key to check
   */
  resetKeyMetricsIfNeeded(apiKey) {
    const metrics = this.keyMetrics[apiKey];
    if (!metrics) return;

    const now = new Date();
    const hoursSinceReset = (now - metrics.lastReset) / (1000 * 60 * 60);

    if (hoursSinceReset >= 24) {
      metrics.requestCount = 0;
      metrics.failures = 0;
      metrics.lastReset = now;
      console.log(`🔄 ${this.displayName} key quota reset: ${metrics.tier || 'global'}/${metrics.category || 'all'}`);
    }
  }

  /**
   * Get all key metrics (for monitoring/debugging)
   * @returns {object} - Key metrics by API key
   */
  getKeyMetrics() {
    const summary = {};

    for (const [key, metrics] of Object.entries(this.keyMetrics)) {
      const maskedKey = key.substring(0, 8) + '...';
      summary[maskedKey] = {
        tier: metrics.tier,
        category: metrics.category,
        used: metrics.requestCount,
        limit: this.rateLimit.max,
        remaining: Math.max(0, this.rateLimit.max - metrics.requestCount),
        percentage: Math.round((metrics.requestCount / this.rateLimit.max) * 100),
        failures: metrics.failures,
        lastReset: metrics.lastReset
      };
    }

    return summary;
  }

  /**
   * Check if ANY key has quota remaining for a category
   * @param {string} category - UI category
   * @returns {boolean} - True if at least one key has quota
   */
  hasQuotaForCategory(category) {
    const keyInfo = this.getKeyForCategory(category);
    return keyInfo !== null;
  }

  /**
   * Override: Check rate limit for category-aware key
   * @param {string} category - UI category
   * @throws {Error} - If all keys for category are exhausted
   */
  checkRateLimitForCategory(category) {
    const keyInfo = this.getKeyForCategory(category);

    if (!keyInfo) {
      throw new Error(
        `All API keys exhausted for ${this.displayName} in category "${category}". ` +
        `Quota resets at midnight UTC. Using cached data as fallback.`
      );
    }

    return keyInfo; // Return the key info to use
  }

  /**
   * Get overall quota status across all keys
   * @returns {object} - Overall quota status
   */
  getOverallQuotaStatus() {
    const categories = ['tech', 'finance', 'health', 'general'];
    const status = {};

    for (const category of categories) {
      const keys = this.categoryKeyMap[category] || [];
      const totalLimit = keys.length * this.rateLimit.max;
      let totalUsed = 0;

      keys.forEach(keyInfo => {
        const metrics = this.keyMetrics[keyInfo.key];
        if (metrics) {
          totalUsed += metrics.requestCount;
        }
      });

      status[category] = {
        keys: keys.length,
        totalLimit,
        totalUsed,
        remaining: Math.max(0, totalLimit - totalUsed),
        percentage: totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
      };
    }

    return status;
  }
}

module.exports = MultiKeyProvider;
