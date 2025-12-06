const axios = require('axios');

const NEWS_API_BASE = 'https://newsapi.org/v2';
const API_KEY = process.env.NEWS_API_KEY;

/**
 * Get latest top headlines
 * @param {number} page - Page number (default: 1)
 * @param {number} pageSize - Number of articles per page (default: 20)
 * @returns {Promise<Array>} Array of news articles
 */
exports.getLatestNews = async (page = 1, pageSize = 20) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country: 'us',
        page,
        pageSize
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('NewsAPI Error (getLatestNews):', error.response?.data || error.message);
    throw new Error('Failed to fetch latest news');
  }
};

/**
 * Get news by category
 * @param {string} category - Category (business, entertainment, general, health, science, sports, technology)
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of news articles
 */
exports.getNewsByCategory = async (category, page = 1) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        category,
        country: 'us',
        page,
        pageSize: 20
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('NewsAPI Error (getNewsByCategory):', error.response?.data || error.message);
    throw new Error(`Failed to fetch ${category} news`);
  }
};

/**
 * Get trending news (sorted by popularity)
 * @returns {Promise<Array>} Array of trending news articles
 */
exports.getTrendingNews = async () => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/top-headlines`, {
      params: {
        apiKey: API_KEY,
        country: 'us',
        sortBy: 'popularity',
        pageSize: 10
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('NewsAPI Error (getTrendingNews):', error.response?.data || error.message);
    throw new Error('Failed to fetch trending news');
  }
};

/**
 * Search news by query
 * @param {string} query - Search query
 * @param {number} page - Page number (default: 1)
 * @returns {Promise<Array>} Array of news articles
 */
exports.searchNews = async (query, page = 1) => {
  try {
    const response = await axios.get(`${NEWS_API_BASE}/everything`, {
      params: {
        apiKey: API_KEY,
        q: query,
        language: 'en',
        sortBy: 'relevancy',
        page,
        pageSize: 20
      }
    });
    return response.data.articles;
  } catch (error) {
    console.error('NewsAPI Error (searchNews):', error.response?.data || error.message);
    throw new Error('Failed to search news');
  }
};

/**
 * Get news headlines (wrapper for getLatestNews)
 * @param {number} page - Page number
 * @param {number} pageSize - Articles per page
 * @returns {Promise<Array>} Array of news articles
 */
exports.getHeadlines = async (page = 1, pageSize = 20) => {
  return exports.getLatestNews(page, pageSize);
};
