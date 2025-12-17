/**
 * News Provider Configuration
 * Defines quality weights, rate limits, and priority for all news API providers
 */

/**
 * Provider Configuration
 * - priority: Lower number = higher priority (1 = first choice)
 * - qualityWeight: 0-100, higher = better quality/more trusted
 * - rateLimit: Maximum requests allowed per time window
 * - enabled: Whether provider is active (can be toggled via env vars)
 */
const PROVIDER_CONFIG = {
  // NewsAPI.org - Best metadata and coverage, but low free tier limit
  newsapi: {
    name: 'NewsAPI',
    priority: 1,
    qualityWeight: 100,
    rateLimit: {
      max: 80,           // Conservative limit (100/day free tier)
      window: '24h',
      resetHour: 0       // Reset at midnight UTC
    },
    baseUrl: 'https://newsapi.org/v2',
    enabled: true,
    requiresApiKey: true,
    features: {
      headlines: true,
      categoryFilter: true,
      search: true,
      dateRange: false   // Free tier doesn't support date filtering well
    },
    categories: ['business', 'entertainment', 'general', 'health', 'science', 'sports', 'technology']
  },

  // Guardian Content API - Quality journalism, higher limits
  guardian: {
    name: 'The Guardian',
    priority: 2,
    qualityWeight: 95,
    rateLimit: {
      max: 400,          // Conservative from 500/day limit
      window: '24h',
      resetHour: 0,
      perSecond: 10      // Also 12 calls/second limit
    },
    baseUrl: 'https://content.guardianapis.com',
    enabled: true,
    requiresApiKey: true,
    features: {
      headlines: true,
      categoryFilter: true,
      search: true,
      dateRange: true
    },
    sections: ['world', 'business', 'technology', 'sport', 'society', 'science', 'culture', 'politics']
  },

  // GNews API - Similar to NewsAPI, good backup
  gnews: {
    name: 'GNews',
    priority: 3,
    qualityWeight: 75,
    rateLimit: {
      max: 90,           // Conservative from 100/day free tier
      window: '24h',
      resetHour: 0
    },
    baseUrl: 'https://gnews.io/api/v4',
    enabled: true,
    requiresApiKey: true,
    features: {
      headlines: true,
      categoryFilter: true,
      search: true,
      dateRange: false
    },
    categories: ['general', 'world', 'nation', 'business', 'technology', 'entertainment', 'sports', 'science', 'health']
  },

  // NewsData.io - Highest free tier limit
  newsdata: {
    name: 'NewsData.io',
    priority: 4,
    qualityWeight: 70,
    rateLimit: {
      max: 150,          // Conservative from 200 credits/day
      window: '24h',
      resetHour: 0
    },
    baseUrl: 'https://newsdata.io/api/1',
    enabled: true,
    requiresApiKey: true,
    features: {
      headlines: true,
      categoryFilter: true,
      search: false,     // Limited in free tier
      dateRange: false
    },
    categories: ['top', 'business', 'technology', 'sports', 'health', 'science', 'entertainment', 'politics', 'world']
  },

  // Currents API - High free tier limit with good coverage
  currents: {
    name: 'Currents API',
    priority: 5,
    qualityWeight: 80,
    rateLimit: {
      max: 500,          // Conservative from 600 req/day free tier
      window: '24h',
      resetHour: 0
    },
    baseUrl: 'https://api.currentsapi.services/v1',
    enabled: true,
    requiresApiKey: true,
    features: {
      headlines: true,
      categoryFilter: true,
      search: true,
      dateRange: true
    },
    categories: ['regional', 'technology', 'lifestyle', 'business', 'general', 'programming', 'science', 'entertainment', 'world', 'sports', 'finance', 'academia', 'politics', 'health', 'opinion', 'food', 'game']
  }
};

/**
 * Get provider configuration by name
 * @param {string} providerName - Provider name
 * @returns {object|null} - Provider config or null if not found
 */
function getProviderConfig(providerName) {
  if (!providerName || typeof providerName !== 'string') {
    return null;
  }

  const normalized = providerName.toLowerCase().trim();
  return PROVIDER_CONFIG[normalized] || null;
}

/**
 * Get all enabled providers sorted by priority
 * @returns {Array<object>} - Array of enabled provider configs
 */
function getEnabledProviders() {
  return Object.entries(PROVIDER_CONFIG)
    .filter(([_, config]) => config.enabled)
    .map(([name, config]) => ({ name, ...config }))
    .sort((a, b) => a.priority - b.priority);
}

/**
 * Get provider priority order (array of provider names)
 * @param {string} requestType - Type of request (headlines, search, etc.)
 * @returns {Array<string>} - Provider names in priority order
 */
function getProviderPriority(requestType = 'headlines') {
  const enabled = getEnabledProviders();

  // Filter providers that support the requested feature
  const supporting = enabled.filter(provider => {
    if (requestType === 'headlines') return provider.features.headlines;
    if (requestType === 'search') return provider.features.search;
    if (requestType === 'category') return provider.features.categoryFilter;
    return true;
  });

  return supporting.map(p => p.name.toLowerCase().replace(/\s+/g, ''));
}

/**
 * Get quality weight for a provider
 * @param {string} providerName - Provider name
 * @returns {number} - Quality weight (0-100)
 */
function getProviderQuality(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.qualityWeight : 50; // Default to 50 if unknown
}

/**
 * Get rate limit configuration for a provider
 * @param {string} providerName - Provider name
 * @returns {object|null} - Rate limit config or null
 */
function getProviderRateLimit(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.rateLimit : null;
}

/**
 * Check if a provider is enabled
 * @param {string} providerName - Provider name
 * @returns {boolean} - True if enabled
 */
function isProviderEnabled(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.enabled : false;
}

/**
 * Get all provider names
 * @returns {Array<string>} - Array of provider names
 */
function getAllProviderNames() {
  return Object.keys(PROVIDER_CONFIG);
}

/**
 * Get provider base URL
 * @param {string} providerName - Provider name
 * @returns {string|null} - Base URL or null
 */
function getProviderBaseUrl(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.baseUrl : null;
}

/**
 * Check if provider requires API key
 * @param {string} providerName - Provider name
 * @returns {boolean} - True if requires API key
 */
function requiresApiKey(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.requiresApiKey : true; // Default to requiring key
}

/**
 * Get provider features
 * @param {string} providerName - Provider name
 * @returns {object|null} - Features object or null
 */
function getProviderFeatures(providerName) {
  const config = getProviderConfig(providerName);
  return config ? config.features : null;
}

/**
 * Update provider enabled status (for runtime toggling)
 * @param {string} providerName - Provider name
 * @param {boolean} enabled - Enable/disable
 * @returns {boolean} - True if updated successfully
 */
function setProviderEnabled(providerName, enabled) {
  const config = getProviderConfig(providerName);
  if (config) {
    config.enabled = Boolean(enabled);
    return true;
  }
  return false;
}

module.exports = {
  PROVIDER_CONFIG,
  getProviderConfig,
  getEnabledProviders,
  getProviderPriority,
  getProviderQuality,
  getProviderRateLimit,
  isProviderEnabled,
  getAllProviderNames,
  getProviderBaseUrl,
  requiresApiKey,
  getProviderFeatures,
  setProviderEnabled
};
