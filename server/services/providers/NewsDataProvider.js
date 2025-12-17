/**
 * NewsData.io API Provider
 * Implementation of NewsData.io API integration
 */

const axios = require('axios');
const BaseNewsProvider = require('./BaseNewsProvider');
const { getProviderConfig } = require('../../config/providers');

class NewsDataProvider extends BaseNewsProvider {
  constructor() {
    const config = getProviderConfig('newsdata');

    if (!config) {
      throw new Error('NewsData configuration not found');
    }

    // Get API key from config or environment
    config.apiKey = config.apiKey || process.env.NEWSDATA_API_KEY;

    if (!config.apiKey) {
      throw new Error('NEWSDATA_API_KEY environment variable is required');
    }

    super(config);

    // NewsData specific settings
    this.defaultCountry = 'us';
    this.defaultLanguage = 'en';
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

      // NewsData uses pagination with 'page' parameter
      const requestParams = {
        apikey: this.apiKey,
        country: this.defaultCountry,
        language: this.defaultLanguage
      };

      // Only add page if not first page (NewsData starts at page 0 or uses nextPage token)
      if (page > 1) {
        requestParams.page = page - 1; // NewsData is 0-indexed
      }

      const response = await axios.get(`${this.baseUrl}/news`, {
        params: requestParams,
        timeout: 10000
      });

      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format from NewsData API');
      }

      // Normalize articles
      const normalized = response.data.results
        .slice(0, pageSize) // Limit to requested page size
        .map(article => this.normalizeArticle(article));

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

    // Map UI category to NewsData category
    const newsdataCategory = this.mapCategory(category);

    try {
      console.log(`🔍 Fetching ${category} (${newsdataCategory}) from ${this.displayName}`);

      const requestParams = {
        apikey: this.apiKey,
        country: this.defaultCountry,
        language: this.defaultLanguage,
        category: newsdataCategory
      };

      if (page > 1) {
        requestParams.page = page - 1; // NewsData is 0-indexed
      }

      const response = await axios.get(`${this.baseUrl}/news`, {
        params: requestParams,
        timeout: 10000
      });

      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format from NewsData API');
      }

      // Normalize articles and add category
      const normalized = response.data.results
        .slice(0, pageSize)
        .map(article => this.normalizeArticle({ ...article, category }));

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

      const requestParams = {
        apikey: this.apiKey,
        q: query,
        language: this.defaultLanguage
      };

      if (page > 1) {
        requestParams.page = page - 1;
      }

      const response = await axios.get(`${this.baseUrl}/news`, {
        params: requestParams,
        timeout: 10000
      });

      if (!response.data || !response.data.results) {
        throw new Error('Invalid response format from NewsData API');
      }

      // Normalize articles
      const normalized = response.data.results
        .slice(0, pageSize)
        .map(article => this.normalizeArticle(article));

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
   * Normalize NewsData article to common schema
   * @param {object} rawArticle - Raw article from NewsData API
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      throw new Error('Invalid article object');
    }

    // NewsData response structure:
    // {
    //   title,
    //   description,
    //   content,
    //   link,
    //   image_url,
    //   pubDate,
    //   source_id,
    //   category: []
    // }

    // NewsData categories come as array
    const categories = Array.isArray(rawArticle.category) ? rawArticle.category : [];
    const primaryCategory = rawArticle.category || categories[0] || 'general';

    return {
      title: rawArticle.title || '',
      description: rawArticle.description || rawArticle.title || '',
      content: rawArticle.content || rawArticle.description || '',
      url: rawArticle.link || '',
      urlToImage: rawArticle.image_url || null,
      publishedAt: rawArticle.pubDate ? new Date(rawArticle.pubDate) : new Date(),
      source: {
        id: rawArticle.source_id || this.name,
        name: rawArticle.source_id || this.displayName
      },
      author: rawArticle.creator?.[0] || 'NewsData', // Creator is an array
      category: primaryCategory,
      provider: this.name
    };
  }
}

module.exports = NewsDataProvider;
