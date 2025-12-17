/**
 * Base News Provider
 * Abstract base class for all news API providers
 * Provides rate limiting, category mapping, and normalization interface
 */

const { mapToProviderCategory, normalizeToUICategory } = require('../../config/categoryMapping');
const { validateArticlesBatch } = require('./articleValidator');

class BaseNewsProvider {
  /**
   * Create a news provider
   * @param {object} config - Provider configuration
   */
  constructor(config) {
    if (new.target === BaseNewsProvider) {
      throw new Error('BaseNewsProvider is an abstract class and cannot be instantiated directly');
    }

    // Validate required config
    if (!config || typeof config !== 'object') {
      throw new Error('Provider config is required');
    }

    if (!config.name || typeof config.name !== 'string') {
      throw new Error('Provider name is required');
    }

    // Provider metadata
    this.name = config.name.toLowerCase().replace(/\s+/g, '');
    this.displayName = config.name;
    this.apiKey = config.apiKey || process.env[`${this.name.toUpperCase()}_API_KEY`];
    this.baseUrl = config.baseUrl;

    // Rate limiting
    this.rateLimit = config.rateLimit || { max: 100, window: '24h' };
    this.requestCount = 0;
    this.lastReset = new Date();
    this.lastResetHour = config.rateLimit?.resetHour || 0;

    // Features
    this.features = config.features || {
      headlines: true,
      categoryFilter: true,
      search: true,
      dateRange: false
    };

    // Quality weight (0-100)
    this.qualityWeight = config.qualityWeight || 50;

    // Priority (lower = higher priority)
    this.priority = config.priority || 999;

    // Enabled status
    this.enabled = config.enabled !== false; // Default to enabled

    console.log(`📰 Initialized provider: ${this.displayName} (priority: ${this.priority}, quality: ${this.qualityWeight})`);
  }

  /**
   * Abstract method: Fetch top headlines
   * Must be implemented by subclasses
   * @param {object} params - Query parameters
   * @returns {Promise<Array>} - Array of articles
   */
  async fetchHeadlines(params) {
    throw new Error('fetchHeadlines() must be implemented by subclass');
  }

  /**
   * Abstract method: Fetch news by category
   * Must be implemented by subclasses
   * @param {string} category - Category name (UI category)
   * @param {object} params - Query parameters
   * @returns {Promise<Array>} - Array of articles
   */
  async fetchByCategory(category, params) {
    throw new Error('fetchByCategory() must be implemented by subclass');
  }

  /**
   * Abstract method: Search news by keyword
   * Must be implemented by subclasses
   * @param {string} query - Search query
   * @param {object} params - Query parameters
   * @returns {Promise<Array>} - Array of articles
   */
  async search(query, params) {
    throw new Error('search() must be implemented by subclass');
  }

  /**
   * Abstract method: Normalize a raw article from provider to common schema
   * Must be implemented by subclasses
   * @param {object} rawArticle - Raw article from provider API
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    throw new Error('normalizeArticle() must be implemented by subclass');
  }

  /**
   * Map a UI category to this provider's category format
   * @param {string} uiCategory - UI category
   * @returns {string} - Provider-specific category
   */
  mapCategory(uiCategory) {
    return mapToProviderCategory(uiCategory, this.name);
  }

  /**
   * Normalize a provider category back to UI category
   * @param {string} providerCategory - Provider's category
   * @returns {string} - UI category
   */
  normalizeCategory(providerCategory) {
    return normalizeToUICategory(providerCategory, this.name);
  }

  /**
   * Validate and normalize multiple articles
   * @param {Array} articles - Raw articles from provider
   * @returns {object} - Validation results with valid/invalid articles
   */
  validateArticles(articles) {
    return validateArticlesBatch(articles, this.name);
  }

  /**
   * Check if rate limit has been exceeded
   * @throws {Error} - If rate limit exceeded
   */
  checkRateLimit() {
    // Check if we need to reset the counter
    this.resetIfNeeded();

    if (this.requestCount >= this.rateLimit.max) {
      const resetTime = this.getNextResetTime();
      throw new Error(
        `Rate limit exceeded for ${this.displayName}. ` +
        `Used ${this.requestCount}/${this.rateLimit.max} requests. ` +
        `Resets at ${resetTime.toLocaleTimeString()}`
      );
    }
  }

  /**
   * Increment request counter
   */
  incrementCount() {
    this.resetIfNeeded();
    this.requestCount++;
  }

  /**
   * Reset rate limit counter if window has passed
   */
  resetIfNeeded() {
    const now = new Date();
    const currentHour = now.getUTCHours();

    // Check if we've passed the reset hour
    if (currentHour === this.lastResetHour && now.getUTCDate() !== this.lastReset.getUTCDate()) {
      this.requestCount = 0;
      this.lastReset = now;
      console.log(`🔄 Rate limit reset for ${this.displayName}: 0/${this.rateLimit.max}`);
    }

    // Also reset if it's been more than 24 hours
    const hoursSinceReset = (now - this.lastReset) / (1000 * 60 * 60);
    if (hoursSinceReset >= 24) {
      this.requestCount = 0;
      this.lastReset = now;
      console.log(`🔄 Rate limit reset for ${this.displayName} (24h): 0/${this.rateLimit.max}`);
    }
  }

  /**
   * Get next reset time
   * @returns {Date} - Next reset time
   */
  getNextResetTime() {
    const now = new Date();
    const nextReset = new Date(now);
    nextReset.setUTCHours(this.lastResetHour, 0, 0, 0);

    // If reset time has passed today, set to tomorrow
    if (now.getUTCHours() >= this.lastResetHour) {
      nextReset.setUTCDate(nextReset.getUTCDate() + 1);
    }

    return nextReset;
  }

  /**
   * Get remaining quota
   * @returns {number} - Remaining requests
   */
  getRemainingQuota() {
    this.resetIfNeeded();
    return Math.max(0, this.rateLimit.max - this.requestCount);
  }

  /**
   * Get rate limit status
   * @returns {object} - Rate limit information
   */
  getRateLimitStatus() {
    this.resetIfNeeded();
    return {
      provider: this.displayName,
      used: this.requestCount,
      limit: this.rateLimit.max,
      remaining: this.getRemainingQuota(),
      resetTime: this.getNextResetTime(),
      percentage: Math.round((this.requestCount / this.rateLimit.max) * 100)
    };
  }

  /**
   * Check if provider supports a feature
   * @param {string} feature - Feature name (headlines, search, etc.)
   * @returns {boolean} - True if supported
   */
  supportsFeature(feature) {
    return this.features[feature] === true;
  }

  /**
   * Get provider information
   * @returns {object} - Provider metadata
   */
  getInfo() {
    return {
      name: this.name,
      displayName: this.displayName,
      enabled: this.enabled,
      priority: this.priority,
      qualityWeight: this.qualityWeight,
      features: this.features,
      rateLimit: this.getRateLimitStatus()
    };
  }

  /**
   * Enable or disable this provider
   * @param {boolean} enabled - Enable/disable
   */
  setEnabled(enabled) {
    this.enabled = Boolean(enabled);
    console.log(`${enabled ? '✅' : '❌'} Provider ${this.displayName} ${enabled ? 'enabled' : 'disabled'}`);
  }
}

module.exports = BaseNewsProvider;
