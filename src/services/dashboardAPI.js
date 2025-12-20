import apiClient from './apiClient';

// Backend dashboard endpoints from server/routes/dashboard.js
const dashboardAPI = {
  // GET /api/dashboard/overview?page=1&limit=20&readingMode=15m&category=all
  // Returns: { articles, briefing, volatility, trendingTopics, globalVectors }
  getDashboardOverview: async (options = {}) => {
    const {
      page = 1,
      limit = 20,
      readingMode = '15m',
      category = 'all',
    } = options;

    const response = await apiClient.get('/dashboard/overview', {
      params: {
        page,
        limit,
        readingMode,
        category,
        _t: Date.now(), // Cache busting: ensures fresh data every request
      },
    });
    return response; // { success: true, data: { articles, briefing, volatility, ... } }
  },

  // GET /api/dashboard/volatility
  getGlobalVolatility: async () => {
    const response = await apiClient.get('/dashboard/volatility');
    return response; // { success: true, data: { volatility, sourceCount, ... } }
  },

  // GET /api/dashboard/market-data (public)
  getMarketData: async () => {
    const response = await apiClient.get('/dashboard/market-data');
    return response; // { success: true, data: { sp500, btc, vix } }
  },

  // GET /api/dashboard/global-vectors
  getGlobalVectors: async () => {
    const response = await apiClient.get('/dashboard/global-vectors');
    return response; // { success: true, data: { vectors: [] } }
  },
};

export default dashboardAPI;
