/**
 * Article Validation and Normalization
 * Ensures all articles from any provider meet schema requirements
 */

const { isValidUrl } = require('../../utils/urlValidator');
const { sanitizeUserInput, sanitizeArticleContent, capitalize } = require('../../utils/sanitizer');

// Required fields that must be present and valid
const REQUIRED_FIELDS = ['title', 'url', 'publishedAt'];

// Optional fields with safe defaults
const OPTIONAL_FIELDS = ['description', 'urlToImage', 'content', 'author', 'source', 'category'];

/**
 * Validate a date string or Date object
 * @param {string|Date} dateValue - Date to validate
 * @returns {boolean} - True if valid date
 */
function isValidDate(dateValue) {
  if (!dateValue) return false;

  const date = new Date(dateValue);
  return date instanceof Date && !isNaN(date.getTime());
}

/**
 * Parse date string to ISO format
 * @param {string|Date} dateValue - Date to parse
 * @returns {Date} - Parsed date
 */
function parseDate(dateValue) {
  if (dateValue instanceof Date) {
    return dateValue;
  }

  const parsed = new Date(dateValue);
  if (isNaN(parsed.getTime())) {
    return new Date(); // Fallback to now
  }

  return parsed;
}

/**
 * Get default placeholder image based on category
 * @param {string} category - Article category
 * @returns {string} - Default image URL
 */
function getDefaultImage(category) {
  const defaults = {
    business: 'https://via.placeholder.com/800x450/2563eb/ffffff?text=Business+News',
    technology: 'https://via.placeholder.com/800x450/7c3aed/ffffff?text=Technology+News',
    sports: 'https://via.placeholder.com/800x450/059669/ffffff?text=Sports+News',
    health: 'https://via.placeholder.com/800x450/dc2626/ffffff?text=Health+News',
    science: 'https://via.placeholder.com/800x450/0891b2/ffffff?text=Science+News',
    entertainment: 'https://via.placeholder.com/800x450/db2777/ffffff?text=Entertainment+News',
    general: 'https://via.placeholder.com/800x450/64748b/ffffff?text=News'
  };

  return defaults[category] || defaults.general;
}

/**
 * Validate and normalize a single article from any provider
 * @param {object} article - Raw article from provider
 * @param {string} provider - Provider name (newsapi, guardian, gnews, etc.)
 * @returns {object} - Normalized article with validation metadata
 */
function validateArticle(article, provider) {
  if (!article || typeof article !== 'object') {
    throw new Error('Article must be an object');
  }

  if (!provider || typeof provider !== 'string') {
    throw new Error('Provider name is required');
  }

  const errors = [];
  const warnings = [];

  // Validate required fields
  if (!article.title || typeof article.title !== 'string' || article.title.trim() === '') {
    errors.push('Missing or empty title');
  }

  if (!article.url || !isValidUrl(article.url)) {
    errors.push('Invalid or missing URL');
  }

  if (!article.publishedAt || !isValidDate(article.publishedAt)) {
    errors.push('Invalid or missing publishedAt date');
  }

  // If critical errors exist, return error object
  if (errors.length > 0) {
    return {
      valid: false,
      errors,
      article: null
    };
  }

  // Validate and normalize optional fields with safe defaults
  const title = sanitizeUserInput(article.title, 500);
  const url = article.url;
  const publishedAt = parseDate(article.publishedAt);

  // Description: fallback to title if missing
  let description = article.description;
  if (!description || description.trim() === '') {
    description = title;
    warnings.push('Missing description, using title as fallback');
  }
  description = sanitizeUserInput(description, 1000);

  // Image URL: validate or use default
  let urlToImage = article.urlToImage;
  if (!urlToImage || !isValidUrl(urlToImage)) {
    const category = article.category || 'general';
    urlToImage = getDefaultImage(category);
    warnings.push('Missing or invalid image URL, using placeholder');
  }

  // Content: fallback to description if missing
  let content = article.content;
  if (!content || content.trim() === '') {
    content = description;
    warnings.push('Missing content, using description as fallback');
  }
  content = sanitizeArticleContent(content);

  // Author: default to 'Unknown'
  let author = article.author;
  if (!author || author.trim() === '') {
    author = 'Unknown';
  }
  author = sanitizeUserInput(author, 200);

  // Source: normalize structure
  let source = {
    id: null,
    name: null
  };

  if (article.source && typeof article.source === 'object') {
    source.id = article.source.id || provider;
    source.name = article.source.name || capitalize(provider);
  } else if (typeof article.source === 'string') {
    source.id = provider;
    source.name = article.source;
  } else {
    source.id = provider;
    source.name = capitalize(provider);
    warnings.push('Missing source, using provider as source');
  }

  source.id = sanitizeUserInput(source.id, 100);
  source.name = sanitizeUserInput(source.name, 200);

  // Category: default to 'general'
  let category = article.category;
  if (!category || category.trim() === '') {
    category = 'general';
    warnings.push('Missing category, using "general" as fallback');
  }
  category = sanitizeUserInput(category.toLowerCase(), 50);

  // Build normalized article
  const normalized = {
    title,
    description,
    content,
    url,
    urlToImage,
    publishedAt,
    source,
    author,
    category,
    provider,
    // Validation metadata (for debugging/monitoring)
    _validation: {
      valid: true,
      errors: [],
      warnings: warnings.length > 0 ? warnings : null,
      validatedAt: new Date()
    }
  };

  return {
    valid: true,
    errors: [],
    warnings,
    article: normalized
  };
}

/**
 * Validate and normalize multiple articles in batch
 * @param {Array<object>} articles - Array of raw articles
 * @param {string} provider - Provider name
 * @returns {object} - Validation results with valid/invalid articles
 */
function validateArticlesBatch(articles, provider) {
  if (!Array.isArray(articles)) {
    throw new Error('Articles must be an array');
  }

  const results = {
    valid: [],
    invalid: [],
    total: articles.length,
    validCount: 0,
    invalidCount: 0,
    warnings: []
  };

  articles.forEach((article, index) => {
    try {
      const validation = validateArticle(article, provider);

      if (validation.valid && validation.article) {
        results.valid.push(validation.article);
        results.validCount++;

        // Collect warnings
        if (validation.warnings && validation.warnings.length > 0) {
          results.warnings.push({
            index,
            url: article.url,
            warnings: validation.warnings
          });
        }
      } else {
        results.invalid.push({
          index,
          url: article.url,
          errors: validation.errors
        });
        results.invalidCount++;
      }
    } catch (error) {
      results.invalid.push({
        index,
        url: article.url,
        errors: [`Validation exception: ${error.message}`]
      });
      results.invalidCount++;
    }
  });

  return results;
}

/**
 * Check if an article has all required fields (quick validation)
 * @param {object} article - Article to check
 * @returns {boolean} - True if has all required fields
 */
function hasRequiredFields(article) {
  if (!article || typeof article !== 'object') {
    return false;
  }

  return REQUIRED_FIELDS.every(field => {
    const value = article[field];
    return value !== undefined && value !== null && value !== '';
  });
}

module.exports = {
  validateArticle,
  validateArticlesBatch,
  hasRequiredFields,
  isValidDate,
  parseDate,
  getDefaultImage,
  REQUIRED_FIELDS,
  OPTIONAL_FIELDS
};
