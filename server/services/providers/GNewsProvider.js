/**
 * GNews API Provider
 * Implementation of GNews.io API integration
 */

const axios = require('axios');
const BaseNewsProvider = require('./BaseNewsProvider');
const { getProviderConfig } = require('../../config/providers');

class GNewsProvider extends BaseNewsProvider {
  constructor() {
    const config = getProviderConfig('gnews');

    if (!config) {
      throw new Error('GNews configuration not found');
    }

    // Get API key from config or environment
    config.apiKey = config.apiKey || process.env.GNEWS_API_KEY;

    if (!config.apiKey) {
      throw new Error('GNEWS_API_KEY environment variable is required');
    }

    super(config);

    // GNews specific settings
    this.defaultCountry = 'us';
    this.defaultLanguage = 'en';
  }

  /**
   * Fetch top headlines
   * @param {object} params - Query parameters
   * @param {number} params.page - Page number (default: 1)
   * @param {number} params.pageSize - Articles per page (default: 20)
   * @returns {Promise<Array>} - Array of normalized articles
   */
  async fetchHeadlines(params = {}) {
    const { page = 1, pageSize = 20 } = params;

    // GNews uses 'max' instead of 'pageSize'
    const max = Math.min(pageSize, 10); // GNews free tier max is 10

    try {
      console.log(`🔍 Fetching headlines from ${this.displayName} (page ${page})`);

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          token: this.apiKey,
          country: this.defaultCountry,
          lang: this.defaultLanguage,
          max
        },
        timeout: 10000
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from GNews API');
      }

      // Normalize articles
      const normalized = response.data.articles.map(article =>
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

    // Map UI category to GNews category
    const gnewsCategory = this.mapCategory(category);

    // GNews uses 'max' instead of 'pageSize'
    const max = Math.min(pageSize, 10); // GNews free tier max is 10

    try {
      console.log(`🔍 Fetching ${category} (${gnewsCategory}) from ${this.displayName}`);

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          token: this.apiKey,
          category: gnewsCategory,
          country: this.defaultCountry,
          lang: this.defaultLanguage,
          max
        },
        timeout: 10000
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from GNews API');
      }

      // Normalize articles and add category
      const normalized = response.data.articles.map(article =>
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

    // GNews uses 'max' instead of 'pageSize'
    const max = Math.min(pageSize, 10); // GNews free tier max is 10

    try {
      console.log(`🔍 Searching "${query}" in ${this.displayName}`);

      const response = await axios.get(`${this.baseUrl}/search`, {
        params: {
          token: this.apiKey,
          q: query,
          lang: this.defaultLanguage,
          max
        },
        timeout: 10000
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from GNews API');
      }

      // Normalize articles
      const normalized = response.data.articles.map(article =>
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
   * Normalize GNews article to common schema
   * @param {object} rawArticle - Raw article from GNews API
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      throw new Error('Invalid article object');
    }

    // GNews response structure (similar to NewsAPI):
    // {
    //   title,
    //   description,
    //   content,
    //   url,
    //   image,
    //   publishedAt,
    //   source: { name, url }
    // }

    return {
      title: rawArticle.title || '',
      description: rawArticle.description || rawArticle.title || '',
      content: rawArticle.content || rawArticle.description || '',
      url: rawArticle.url || '',
      urlToImage: rawArticle.image || null,
      publishedAt: rawArticle.publishedAt ? new Date(rawArticle.publishedAt) : new Date(),
      source: {
        id: this.name,
        name: rawArticle.source?.name || this.displayName
      },
      author: 'GNews', // GNews doesn't provide author info in free tier
      category: rawArticle.category || 'general',
      provider: this.name
    };
  }
}

module.exports = GNewsProvider;
