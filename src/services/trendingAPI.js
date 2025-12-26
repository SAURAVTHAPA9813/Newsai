import apiClient from "./apiClient";

// Trending articles API - serves cached articles that update once daily at 8 AM
const trendingAPI = {
  // GET /api/trending?category=all
  // Returns cached trending articles for the specified category
  // All users get the same articles throughout the day
  getTrendingArticles: async (category = 'all') => {
    const response = await apiClient.get("/trending", {
      params: { category },
    });
    return response;
  },

  // GET /api/trending/status
  // Returns cache status (for debugging/admin)
  getCacheStatus: async () => {
    const response = await apiClient.get("/trending/status");
    return response;
  },

  // POST /api/trending/regenerate
  // Force regenerate the cache (admin use)
  regenerateCache: async () => {
    const response = await apiClient.post("/trending/regenerate");
    return response;
  },
};

export default trendingAPI;

// Named exports for convenience
export const getTrendingArticles = trendingAPI.getTrendingArticles;
export const getCacheStatus = trendingAPI.getCacheStatus;
export const regenerateCache = trendingAPI.regenerateCache;
