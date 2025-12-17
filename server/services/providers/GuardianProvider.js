/**
 * Guardian Content API Provider
 * Implementation of The Guardian newspaper API integration
 */

const axios = require('axios');
const BaseNewsProvider = require('./BaseNewsProvider');
const { getProviderConfig } = require('../../config/providers');

class GuardianProvider extends BaseNewsProvider {
  constructor() {
    const config = getProviderConfig('guardian');

    if (!config) {
      throw new Error('Guardian configuration not found');
    }

    // Get API key from config or environment
    config.apiKey = config.apiKey || process.env.GUARDIAN_API_KEY;

    if (!config.apiKey) {
      throw new Error('GUARDIAN_API_KEY environment variable is required');
    }

    super(config);

    // Guardian specific settings
    this.searchUrl = `${this.baseUrl}/search`;
    this.defaultPageSize = 20;
  }

  /**
   * Fetch top headlines (latest content)
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async fetchHeadlines(params = {}) {
    const { page = 1, pageSize = 20 } = params;

    try {
      console.log(`🔍 Fetching headlines from ${this.displayName} (page ${page})`);

      const response = await axios.get(this.searchUrl, {
        params: {
          'api-key': this.apiKey,
          'show-fields': 'headline,trailText,bodyText,thumbnail,short-url',
          'show-tags': 'contributor',
          'order-by': 'newest',
          'page-size': pageSize,
          page
        },
        timeout: 10000
      });

      if (!response.data || !response.data.response || !response.data.response.results) {
        throw new Error('Invalid response format from Guardian API');
      }

      // Normalize articles
      const normalized = response.data.response.results.map(article =>
        this.normalizeArticle(article)
      );

      console.log(`✅ ${this.displayName} returned ${normalized.length} headlines`);

      return normalized;
    } catch (error) {
      console.error(`❌ ${this.displayName} fetchHeadlines error:`, error.response?.data || error.message);

      if (error.response?.status === 429) {
        throw new Error(`Rate limit exceeded for ${this.displayName}`);
      }

      if (error.response?.status === 401 || error.response?.status === 403) {
        throw new Error(`Invalid API key for ${this.displayName}`);
      }

      throw new Error(`${this.displayName} request failed: ${error.message}`);
    }
  }

  /**
   * Fetch news by section (category)
   * @param {string} category - Category name (UI category)
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async fetchByCategory(category, params = {}) {
    const { page = 1, pageSize = 20 } = params;

    // Map UI category to Guardian section
    const guardianSection = this.mapCategory(category);

    try {
      console.log(`🔍 Fetching ${category} (${guardianSection}) from ${this.displayName}`);

      const response = await axios.get(this.searchUrl, {
        params: {
          'api-key': this.apiKey,
          'section': guardianSection,
          'show-fields': 'headline,trailText,bodyText,thumbnail,short-url',
          'show-tags': 'contributor',
          'order-by': 'newest',
          'page-size': pageSize,
          page
        },
        timeout: 10000
      });

      if (!response.data || !response.data.response || !response.data.response.results) {
        throw new Error('Invalid response format from Guardian API');
      }

      // Normalize articles and add category
      const normalized = response.data.response.results.map(article =>
        this.normalizeArticle({ ...article, uiCategory: category })
      );

      console.log(`✅ ${this.displayName} returned ${normalized.length} ${category} articles`);

      return normalized;
    } catch (error) {
      console.error(`❌ ${this.displayName} fetchByCategory error:`, error.response?.data || error.message);

      if (error.response?.status === 429) {
        throw new Error(`Rate limit exceeded for ${this.displayName}`);
      }

      throw new Error(`${this.displayName} request failed: ${error.message}`);
    }
  }

  /**
   * Search news by keyword
   * @param {string} query - Search query
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async search(query, params = {}) {
    const { page = 1, pageSize = 20 } = params;

    if (!query || query.trim() === '') {
      throw new Error('Search query is required');
    }

    try {
      console.log(`🔍 Searching "${query}" in ${this.displayName}`);

      const response = await axios.get(this.searchUrl, {
        params: {
          'api-key': this.apiKey,
          'q': query,
          'show-fields': 'headline,trailText,bodyText,thumbnail,short-url',
          'show-tags': 'contributor',
          'order-by': 'relevance',
          'page-size': pageSize,
          page
        },
        timeout: 10000
      });

      if (!response.data || !response.data.response || !response.data.response.results) {
        throw new Error('Invalid response format from Guardian API');
      }

      // Normalize articles
      const normalized = response.data.response.results.map(article =>
        this.normalizeArticle(article)
      );

      console.log(`✅ ${this.displayName} search returned ${normalized.length} results for "${query}"`);

      return normalized;
    } catch (error) {
      console.error(`❌ ${this.displayName} search error:`, error.response?.data || error.message);

      if (error.response?.status === 429) {
        throw new Error(`Rate limit exceeded for ${this.displayName}`);
      }

      throw new Error(`${this.displayName} search failed: ${error.message}`);
    }
  }

  /**
   * Normalize Guardian article to common schema
   * @param {object} rawArticle - Raw article from Guardian API
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      throw new Error('Invalid article object');
    }

    // Guardian response structure:
    // {
    //   id,
    //   type,
    //   sectionId,
    //   sectionName,
    //   webPublicationDate,
    //   webTitle,
    //   webUrl,
    //   apiUrl,
    //   fields: {
    //     headline,
    //     trailText,
    //     bodyText,
    //     thumbnail
    //   },
    //   tags: [{ webTitle }]
    // }

    const fields = rawArticle.fields || {};
    const tags = rawArticle.tags || [];
    const author = tags.length > 0 ? tags[0].webTitle : 'The Guardian';

    // Determine category
    let category = 'general';
    if (rawArticle.uiCategory) {
      category = rawArticle.uiCategory;
    } else if (rawArticle.sectionId) {
      category = this.normalizeCategory(rawArticle.sectionId);
    }

    return {
      title: fields.headline || rawArticle.webTitle || '',
      description: fields.trailText || fields.headline || '',
      content: fields.bodyText || fields.trailText || '',
      url: rawArticle.webUrl || '',
      urlToImage: fields.thumbnail || null,
      publishedAt: rawArticle.webPublicationDate ? new Date(rawArticle.webPublicationDate) : new Date(),
      source: {
        id: 'the-guardian',
        name: 'The Guardian'
      },
      author: author,
      category: category,
      provider: this.name
    };
  }
}

module.exports = GuardianProvider;
