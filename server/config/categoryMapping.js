/**
 * Category Mapping Configuration
 * Maps UI categories to provider-specific categories/sections
 * Ensures consistent categorization across all news providers
 */

/**
 * UI Categories - What the user sees in the frontend
 * These are the canonical categories used throughout the application
 */
const UI_CATEGORIES = [
  'general',
  'business',
  'technology',
  'sports',
  'health',
  'science',
  'entertainment',
  'politics',
  'world'
];

/**
 * Category Mappings - UI Category -> Provider Category
 * Maps each UI category to the equivalent category name for each provider
 */
const CATEGORY_MAP = {
  // NewsAPI.org category mappings
  newsapi: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'general', // NewsAPI doesn't have politics, map to general
    'world': 'general'      // NewsAPI doesn't have world, map to general
  },

  // Guardian Content API section mappings
  guardian: {
    'general': 'world',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sport',        // Note: Guardian uses 'sport' not 'sports'
    'health': 'society',      // Guardian health is under 'society'
    'science': 'science',
    'entertainment': 'culture', // Guardian uses 'culture' for entertainment
    'politics': 'politics',
    'world': 'world'
  },

  // GNews API category mappings
  gnews: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'nation',     // GNews uses 'nation' for politics
    'world': 'world'
  },

  // NewsData.io category mappings
  newsdata: {
    'general': 'top',         // NewsData uses 'top' for general news
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'politics',
    'world': 'world'
  },

  // Currents API category mappings
  currents: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'politics',
    'world': 'world'
  }
};

/**
 * Reverse Mappings - Provider Category -> UI Category
 * Used to normalize provider responses back to UI categories
 */
const REVERSE_CATEGORY_MAP = {
  // NewsAPI -> UI category
  newsapi: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment'
  },

  // Guardian -> UI category
  guardian: {
    'world': 'world',
    'business': 'business',
    'technology': 'technology',
    'sport': 'sports',
    'society': 'health',
    'science': 'science',
    'culture': 'entertainment',
    'politics': 'politics',
    'environment': 'science',
    'education': 'general',
    'media': 'entertainment',
    'law': 'politics'
  },

  // GNews -> UI category
  gnews: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'nation': 'politics',
    'world': 'world'
  },

  // NewsData.io -> UI category
  newsdata: {
    'top': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'politics',
    'world': 'world'
  },

  // Currents API -> UI category
  currents: {
    'general': 'general',
    'business': 'business',
    'technology': 'technology',
    'sports': 'sports',
    'health': 'health',
    'science': 'science',
    'entertainment': 'entertainment',
    'politics': 'politics',
    'world': 'world',
    'regional': 'general',
    'lifestyle': 'entertainment',
    'programming': 'technology',
    'finance': 'business',
    'academia': 'science',
    'opinion': 'general',
    'food': 'entertainment',
    'game': 'entertainment'
  }
};

/**
 * Map a UI category to a provider-specific category
 * @param {string} uiCategory - UI category (e.g., 'technology')
 * @param {string} provider - Provider name (e.g., 'newsapi')
 * @returns {string} - Provider-specific category, defaults to 'general' if not found
 */
function mapToProviderCategory(uiCategory, provider) {
  // Validate inputs
  if (!uiCategory || typeof uiCategory !== 'string') {
    console.warn('Invalid UI category, defaulting to "general"');
    return 'general';
  }

  if (!provider || typeof provider !== 'string') {
    console.warn('Invalid provider name, defaulting to "general"');
    return 'general';
  }

  const normalizedCategory = uiCategory.toLowerCase().trim();
  const normalizedProvider = provider.toLowerCase().trim();

  // Check if provider exists in mapping
  const providerMap = CATEGORY_MAP[normalizedProvider];
  if (!providerMap) {
    console.warn(`Unknown provider: ${provider}, using "general"`);
    return 'general';
  }

  // Get provider category
  const providerCategory = providerMap[normalizedCategory];
  if (!providerCategory) {
    console.warn(`Unknown category "${uiCategory}" for provider "${provider}", using "general"`);
    return providerMap['general'] || 'general';
  }

  return providerCategory;
}

/**
 * Normalize a provider-specific category back to a UI category
 * @param {string} providerCategory - Provider's category (e.g., 'sport')
 * @param {string} provider - Provider name (e.g., 'guardian')
 * @returns {string} - UI category, defaults to 'general' if not found
 */
function normalizeToUICategory(providerCategory, provider) {
  // Validate inputs
  if (!providerCategory || typeof providerCategory !== 'string') {
    return 'general';
  }

  if (!provider || typeof provider !== 'string') {
    return 'general';
  }

  const normalizedProviderCategory = providerCategory.toLowerCase().trim();
  const normalizedProvider = provider.toLowerCase().trim();

  // Check if provider exists in reverse mapping
  const reverseMap = REVERSE_CATEGORY_MAP[normalizedProvider];
  if (!reverseMap) {
    console.warn(`Unknown provider: ${provider} in reverse mapping, using "general"`);
    return 'general';
  }

  // Get UI category
  const uiCategory = reverseMap[normalizedProviderCategory];
  if (!uiCategory) {
    console.warn(`Unknown provider category "${providerCategory}" for "${provider}", using "general"`);
    return 'general';
  }

  return uiCategory;
}

/**
 * Get all supported categories for a specific provider
 * @param {string} provider - Provider name
 * @returns {Array<string>} - Array of provider-specific categories
 */
function getProviderCategories(provider) {
  if (!provider || typeof provider !== 'string') {
    return [];
  }

  const normalizedProvider = provider.toLowerCase().trim();
  const providerMap = CATEGORY_MAP[normalizedProvider];

  if (!providerMap) {
    return [];
  }

  // Return unique provider categories
  return [...new Set(Object.values(providerMap))];
}

/**
 * Check if a category is valid for a specific provider
 * @param {string} category - Category to check
 * @param {string} provider - Provider name
 * @returns {boolean} - True if category is valid for provider
 */
function isValidCategoryForProvider(category, provider) {
  if (!category || !provider) {
    return false;
  }

  const providerCategories = getProviderCategories(provider);
  return providerCategories.includes(category.toLowerCase());
}

/**
 * Get all UI categories
 * @returns {Array<string>} - Array of UI categories
 */
function getUICategories() {
  return [...UI_CATEGORIES];
}

module.exports = {
  UI_CATEGORIES,
  CATEGORY_MAP,
  REVERSE_CATEGORY_MAP,
  mapToProviderCategory,
  normalizeToUICategory,
  getProviderCategories,
  isValidCategoryForProvider,
  getUICategories
};
