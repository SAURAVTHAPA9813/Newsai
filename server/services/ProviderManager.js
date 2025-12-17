/**
 * Provider Manager
 * Orchestrates multiple news providers with automatic fallback and health tracking
 */

const NewsApiProvider = require('./providers/NewsApiProvider');
const GuardianProvider = require('./providers/GuardianProvider');
const GNewsProvider = require('./providers/GNewsProvider');
const NewsDataProvider = require('./providers/NewsDataProvider');
const CurrentsProvider = require('./providers/CurrentsProvider');
const { getProviderPriority, getProviderQuality } = require('../config/providers');

class ProviderManager {
  constructor() {
    this.providers = {};
    this.healthMetrics = {};
    this.initializeProviders();
  }

  /**
   * Initialize all news providers
   */
  initializeProviders() {
    console.log('🚀 Initializing news providers...');

    try {
      // Initialize NewsAPI
      try {
        this.providers.newsapi = new NewsApiProvider();
        this.initHealthMetrics('newsapi');
      } catch (error) {
        console.warn(`⚠️  Failed to initialize NewsAPI: ${error.message}`);
      }

      // Initialize Guardian
      try {
        this.providers.guardian = new GuardianProvider();
        this.initHealthMetrics('guardian');
      } catch (error) {
        console.warn(`⚠️  Failed to initialize Guardian: ${error.message}`);
      }

      // Initialize GNews
      try {
        this.providers.gnews = new GNewsProvider();
        this.initHealthMetrics('gnews');
      } catch (error) {
        console.warn(`⚠️  Failed to initialize GNews: ${error.message}`);
      }

      // Initialize NewsData
      try {
        this.providers.newsdata = new NewsDataProvider();
        this.initHealthMetrics('newsdata');
      } catch (error) {
        console.warn(`⚠️  Failed to initialize NewsData: ${error.message}`);
      }

      // Initialize Currents
      try {
        this.providers.currents = new CurrentsProvider();
        this.initHealthMetrics('currents');
      } catch (error) {
        console.warn(`⚠️  Failed to initialize Currents: ${error.message}`);
      }

      const enabledCount = Object.keys(this.providers).length;
      console.log(`✅ ${enabledCount} providers initialized successfully`);

      if (enabledCount === 0) {
        console.error('❌ No providers available! Please configure at least one API key.');
      }
    } catch (error) {
      console.error('❌ Provider initialization error:', error.message);
    }
  }

  /**
   * Initialize health metrics for a provider
   * @param {string} providerName - Provider name
   */
  initHealthMetrics(providerName) {
    this.healthMetrics[providerName] = {
      success: 0,
      failure: 0,
      totalResponseTime: 0,
      avgResponseTime: 0,
      lastSuccess: null,
      lastFailure: null,
      lastError: null
    };
  }

  /**
   * Fetch headlines with automatic provider fallback
   * @param {object} params - Query parameters
   * @param {Array<string>} priorityOrder - Optional custom provider priority
   * @returns {Promise<object>} - Result with articles and metadata
   */
  async fetchHeadlinesWithFallback(params = {}, priorityOrder = null) {
    return this.fetchWithFallback('headlines', 'fetchHeadlines', params, priorityOrder);
  }

  /**
   * Fetch news by category with automatic provider fallback
   * @param {string} category - Category name
   * @param {object} params - Query parameters
   * @param {Array<string>} priorityOrder - Optional custom provider priority
   * @returns {Promise<object>} - Result with articles and metadata
   */
  async fetchByCategoryWithFallback(category, params = {}, priorityOrder = null) {
    return this.fetchWithFallback('category', 'fetchByCategory', params, priorityOrder, category);
  }

  /**
   * Search news with automatic provider fallback
   * @param {string} query - Search query
   * @param {object} params - Query parameters
   * @param {Array<string>} priorityOrder - Optional custom provider priority
   * @returns {Promise<object>} - Result with articles and metadata
   */
  async searchWithFallback(query, params = {}, priorityOrder = null) {
    return this.fetchWithFallback('search', 'search', params, priorityOrder, query);
  }

  /**
   * Core fallback logic - try providers in priority order until one succeeds
   * @param {string} requestType - Request type (headlines, category, search)
   * @param {string} method - Provider method name
   * @param {object} params - Query parameters
   * @param {Array<string>} priorityOrder - Custom priority order
   * @param {string} firstArg - First argument for method (category or query)
   * @returns {Promise<object>} - Result with articles and metadata
   */
  async fetchWithFallback(requestType, method, params = {}, priorityOrder = null, firstArg = null) {
    // Get priority order (custom or default)
    const priority = priorityOrder || getProviderPriority(requestType);
    const attempts = [];

    console.log(`🔄 Attempting ${requestType} request with fallback chain: [${priority.join(' → ')}]`);

    for (const providerName of priority) {
      const provider = this.providers[providerName];

      // Skip if provider not initialized or disabled
      if (!provider) {
        console.log(`⏭️  Skipping ${providerName}: not initialized`);
        continue;
      }

      if (!provider.enabled) {
        console.log(`⏭️  Skipping ${providerName}: disabled`);
        continue;
      }

      const startTime = Date.now();

      try {
        // Check rate limit before attempting
        provider.checkRateLimit();

        // Execute provider method
        let rawArticles;
        if (firstArg) {
          rawArticles = await provider[method](firstArg, params);
        } else {
          rawArticles = await provider[method](params);
        }

        const fetchDuration = Date.now() - startTime;

        // Validate and normalize articles
        const validation = provider.validateArticles(rawArticles);

        if (validation.validCount === 0) {
          throw new Error(`All ${validation.total} articles failed validation`);
        }

        // Add quality weight to each article
        const articlesWithQuality = validation.valid.map(article => ({
          ...article,
          qualityWeight: getProviderQuality(providerName)
        }));

        // Increment rate limit counter
        provider.incrementCount();

        // Record success
        this.recordSuccess(providerName, fetchDuration, validation.validCount);

        console.log(
          `✅ ${provider.displayName} SUCCESS: ` +
          `${validation.validCount}/${validation.total} articles valid, ` +
          `${fetchDuration}ms, ` +
          `${provider.getRemainingQuota()} requests remaining`
        );

        // Log warnings if any
        if (validation.warnings.length > 0) {
          console.warn(`⚠️  ${provider.displayName} had ${validation.warnings.length} validation warnings`);
        }

        return {
          success: true,
          provider: providerName,
          qualityWeight: getProviderQuality(providerName),
          articles: articlesWithQuality,
          meta: {
            totalFetched: validation.total,
            validCount: validation.validCount,
            invalidCount: validation.invalidCount,
            duration: fetchDuration,
            warnings: validation.warnings.length,
            attempts: attempts.length + 1,
            quota: provider.getRateLimitStatus()
          }
        };
      } catch (error) {
        const duration = Date.now() - startTime;

        // Record failure
        this.recordFailure(providerName, error.message, duration);

        console.warn(
          `❌ ${provider.displayName} FAILED: ${error.message} (${duration}ms)`
        );

        attempts.push({
          provider: providerName,
          error: error.message,
          duration
        });

        // Continue to next provider in fallback chain
        continue;
      }
    }

    // All providers failed
    const errorMessage = `All providers failed for ${requestType} request`;
    console.error(`❌ ${errorMessage}`, {
      attempts: attempts.length,
      failures: attempts.map(a => `${a.provider}: ${a.error}`)
    });

    throw new Error(`${errorMessage}. Attempts: ${JSON.stringify(attempts.map(a => ({
      provider: a.provider,
      error: a.error
    })))}`);
  }

  /**
   * Record successful request
   * @param {string} providerName - Provider name
   * @param {number} duration - Response time in ms
   * @param {number} count - Number of articles returned
   */
  recordSuccess(providerName, duration, count) {
    if (!this.healthMetrics[providerName]) {
      this.initHealthMetrics(providerName);
    }

    const metrics = this.healthMetrics[providerName];
    metrics.success++;
    metrics.totalResponseTime += duration;
    metrics.avgResponseTime = Math.round(metrics.totalResponseTime / metrics.success);
    metrics.lastSuccess = new Date();
  }

  /**
   * Record failed request
   * @param {string} providerName - Provider name
   * @param {string} error - Error message
   * @param {number} duration - Response time in ms
   */
  recordFailure(providerName, error, duration) {
    if (!this.healthMetrics[providerName]) {
      this.initHealthMetrics(providerName);
    }

    const metrics = this.healthMetrics[providerName];
    metrics.failure++;
    metrics.lastFailure = new Date();
    metrics.lastError = error;
  }

  /**
   * Get health status for all providers
   * @returns {object} - Health metrics for all providers
   */
  getHealthStatus() {
    const status = {};

    Object.entries(this.providers).forEach(([name, provider]) => {
      const metrics = this.healthMetrics[name] || {};
      const total = metrics.success + metrics.failure;
      const successRate = total > 0 ? (metrics.success / total * 100).toFixed(2) : 0;

      status[name] = {
        displayName: provider.displayName,
        enabled: provider.enabled,
        priority: provider.priority,
        qualityWeight: provider.qualityWeight,
        health: {
          status: parseFloat(successRate) >= 50 ? 'healthy' : 'degraded',
          successRate: `${successRate}%`,
          totalRequests: total,
          successCount: metrics.success,
          failureCount: metrics.failure,
          avgResponseTime: `${metrics.avgResponseTime}ms`,
          lastSuccess: metrics.lastSuccess,
          lastFailure: metrics.lastFailure,
          lastError: metrics.lastError
        },
        quota: provider.getRateLimitStatus()
      };
    });

    return status;
  }

  /**
   * Get overall system health
   * @returns {object} - Overall health summary
   */
  getOverallHealth() {
    const providerHealth = this.getHealthStatus();
    const providers = Object.values(providerHealth);

    const healthyCount = providers.filter(p => p.health.status === 'healthy').length;
    const degradedCount = providers.filter(p => p.health.status === 'degraded').length;
    const disabledCount = providers.filter(p => !p.enabled).length;

    return {
      status: healthyCount > 0 ? 'operational' : 'degraded',
      totalProviders: providers.length,
      healthy: healthyCount,
      degraded: degradedCount,
      disabled: disabledCount,
      timestamp: new Date()
    };
  }

  /**
   * Get a specific provider instance
   * @param {string} providerName - Provider name
   * @returns {object|null} - Provider instance or null
   */
  getProvider(providerName) {
    return this.providers[providerName] || null;
  }

  /**
   * Get all provider names
   * @returns {Array<string>} - Array of provider names
   */
  getProviderNames() {
    return Object.keys(this.providers);
  }

  /**
   * Enable or disable a provider
   * @param {string} providerName - Provider name
   * @param {boolean} enabled - Enable/disable
   * @returns {boolean} - Success status
   */
  setProviderEnabled(providerName, enabled) {
    const provider = this.providers[providerName];
    if (provider) {
      provider.setEnabled(enabled);
      return true;
    }
    return false;
  }
}

// Singleton instance
let instance = null;

module.exports = {
  /**
   * Get or create ProviderManager instance
   * @returns {ProviderManager} - Singleton instance
   */
  getInstance: () => {
    if (!instance) {
      instance = new ProviderManager();
    }
    return instance;
  },
  ProviderManager
};
