/**
 * NewsAPI.org Provider
 * Implementation of NewsAPI.org integration
 */

const axios = require('axios');
const BaseNewsProvider = require('./BaseNewsProvider');
const { getProviderConfig } = require('../../config/providers');

class NewsApiProvider extends BaseNewsProvider {
  constructor() {
    const config = getProviderConfig('newsapi');

    if (!config) {
      throw new Error('NewsAPI configuration not found');
    }

    // Get API key from config or environment
    config.apiKey = config.apiKey || process.env.NEWS_API_KEY;

    if (!config.apiKey) {
      throw new Error('NEWS_API_KEY environment variable is required');
    }

    super(config);

    // NewsAPI specific settings
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

    try {
      console.log(`🔍 Fetching headlines from ${this.displayName} (page ${page})`);

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          country: this.defaultCountry,
          page,
          pageSize
        },
        timeout: 10000 // 10 second timeout
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from NewsAPI');
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

      if (error.response?.status === 401) {
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

    // Map UI category to NewsAPI category
    const newsapiCategory = this.mapCategory(category);

    try {
      console.log(`🔍 Fetching ${category} (${newsapiCategory}) from ${this.displayName}`);

      const response = await axios.get(`${this.baseUrl}/top-headlines`, {
        params: {
          apiKey: this.apiKey,
          category: newsapiCategory,
          country: this.defaultCountry,
          page,
          pageSize
        },
        timeout: 10000
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from NewsAPI');
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

    try {
      console.log(`🔍 Searching "${query}" in ${this.displayName}`);

      // NewsAPI uses /everything endpoint for search
      const response = await axios.get(`${this.baseUrl}/everything`, {
        params: {
          apiKey: this.apiKey,
          q: query,
          language: this.defaultLanguage,
          sortBy: 'relevancy',
          page,
          pageSize
        },
        timeout: 10000
      });

      if (!response.data || !response.data.articles) {
        throw new Error('Invalid response format from NewsAPI');
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
   * Normalize NewsAPI article to common schema
   * @param {object} rawArticle - Raw article from NewsAPI
   * @returns {object} - Normalized article
   */
  normalizeArticle(rawArticle) {
    if (!rawArticle || typeof rawArticle !== 'object') {
      throw new Error('Invalid article object');
    }

    // NewsAPI response structure:
    // {
    //   source: { id, name },
    //   author,
    //   title,
    //   description,
    //   url,
    //   urlToImage,
    //   publishedAt,
    //   content
    // }

    return {
      title: rawArticle.title || '',
      description: rawArticle.description || rawArticle.title || '',
      content: rawArticle.content || rawArticle.description || '',
      url: rawArticle.url || '',
      urlToImage: rawArticle.urlToImage || null,
      publishedAt: rawArticle.publishedAt ? new Date(rawArticle.publishedAt) : new Date(),
      source: {
        id: rawArticle.source?.id || this.name,
        name: rawArticle.source?.name || this.displayName
      },
      author: rawArticle.author || 'Unknown',
      category: rawArticle.category || 'general',
      provider: this.name
    };
  }
}

module.exports = NewsApiProvider;
