/**
 * Currents API Provider
 * Implementation of Currents API integration (https://currentsapi.services/)
 */

const axios = require('axios');
const BaseNewsProvider = require('./BaseNewsProvider');
const { getProviderConfig } = require('../../config/providers');

class CurrentsProvider extends BaseNewsProvider {
  constructor() {
    const config = getProviderConfig('currents');

    if (!config) {
      throw new Error('Currents configuration not found');
    }

    // Get API key from config or environment
    config.apiKey = config.apiKey || process.env.CURRENTS_API_KEY;

    if (!config.apiKey) {
      throw new Error('CURRENTS_API_KEY environment variable is required');
    }

    super(config);

    // Currents specific settings
    this.defaultLanguage = 'en';
    this.defaultRegion = 'US';
  }

  /**
   * Fetch latest news (top headlines)
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async fetchHeadlines(params = {}) {
    const { page = 1, pageSize = 20 } = params;

    try {
      console.log(`🔍 Fetching headlines from ${this.displayName} (page ${page})`);

      // Currents uses page_number and page_size
      const response = await axios.get(`${this.baseUrl}/latest-news`, {
        params: {
          apiKey: this.apiKey,
          language: this.defaultLanguage,
          page_number: page,
          page_size: Math.min(pageSize, 200) // Currents max is 200
        },
        timeout: 10000
      });

      if (!response.data || !response.data.news) {
        throw new Error('Invalid response format from Currents API');
      }

      // Normalize articles
      const normalized = response.data.news.map(article =>
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
   * Fetch news by category
   * @param {string} category - Category name (UI category)
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async fetchByCategory(category, params = {}) {
    const { page = 1, pageSize = 20 } = params;

    // Map UI category to Currents category
    const currentsCategory = this.mapCategory(category);

    try {
      console.log(`🔍 Fetching ${category} (${currentsCategory}) from ${this.displayName}`);

      const response = await axios.get(`${this.baseUrl}/latest-news`, {
        params: {
          apiKey: this.apiKey,
          category: currentsCategory,
          language: this.defaultLanguage,
          page_number: page,
          page_size: Math.min(pageSize, 200)
        },
        timeout: 10000
      });

      if (!response.data || !response.data.news) {
        throw new Error('Invalid response format from Currents API');
      }

      // Normalize articles and add category
      const normalized = response.data.news.map(article =>
        this.normalizeArticle({ ...article, category })
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

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          apiKey: this.apiKey,
          keywords: query,
          language: this.defaultLanguage,
          page_number: page,
          page_size: Math.min(pageSize, 200)
        },
        timeout: 10000
      });

      if (!response.data || !response.data.news) {
        throw new Error('Invalid response format from Currents API');
      }

      // Normalize articles
      const normalized = response.data.news.map(article =>
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
   * Normalize Currents article to common schema
   * @param {object} rawArticle - Raw article from Currents API
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      throw new Error('Invalid article object');
    }

    // Currents response structure:
    // {
    //   id,
    //   title,
    //   description,
    //   url,
    //   author,
    //   image,
    //   language,
    //   category: [],
    //   published
    // }

    // Currents categories come as array
    const categories = Array.isArray(rawArticle.category) ? rawArticle.category : [];
    const primaryCategory = rawArticle.category || categories[0] || 'general';

    return {
      title: rawArticle.title || '',
      description: rawArticle.description || rawArticle.title || '',
      content: rawArticle.description || '', // Currents doesn't provide full content in free tier
      url: rawArticle.url || '',
      urlToImage: rawArticle.image || null,
      publishedAt: rawArticle.published ? new Date(rawArticle.published) : new Date(),
      source: {
        id: this.name,
        name: this.displayName
      },
      author: rawArticle.author || 'Currents',
      category: primaryCategory,
      provider: this.name
    };
  }
}

module.exports = CurrentsProvider;
