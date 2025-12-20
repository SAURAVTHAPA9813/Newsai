import apiClient from './apiClient';

// Backend news endpoints from server/routes/news.js
const newsAPI = {
  // GET /api/news/headlines?page=1&pageSize=20&country=us
  getHeadlines: async (page = 1, pageSize = 20, country = 'us') => {
    const response = await apiClient.get('/news/headlines', {
      params: { page, pageSize, country },
    });
    return response; // { success: true, data: { articles: [], totalResults, page, pageSize } }
  },

  // GET /api/news/category/:category?page=1&pageSize=20
  getNewsByCategory: async (category, page = 1, pageSize = 20) => {
    const response = await apiClient.get(`/news/category/${category}`, {
      params: { page, pageSize },
    });
    return response;
  },

  // GET /api/news/search?q=query&page=1&pageSize=20
  searchNews: async (query, page = 1, pageSize = 20) => {
    const response = await apiClient.get('/news/search', {
      params: { q: query, page, pageSize },
    });
    return response;
  },

  // GET /api/news/trending-topics
  getTrendingTopics: async () => {
    const response = await apiClient.get('/news/trending-topics');
    return response; // { success: true, data: { topics: [] } }
  },

  // POST /api/news/personalized (requires auth)
  getPersonalizedNews: async (preferences) => {
    const response = await apiClient.post('/news/personalized', preferences);
    return response;
  },

  // POST /api/news/save (requires auth)
  saveArticle: async (articleData) => {
    const response = await apiClient.post('/news/save', articleData);
    return response;
  },

  // GET /api/news/saved (requires auth)
  getSavedArticles: async () => {
    const response = await apiClient.get('/news/saved');
    return response; // { success: true, data: { articles: [] } }
  },

  // DELETE /api/news/saved/:articleId (requires auth)
  removeSavedArticle: async (articleId) => {
    const response = await apiClient.delete(`/news/saved/${articleId}`);
    return response;
  },
};

export default newsAPI;
