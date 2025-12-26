import apiClient from "./apiClient";

// Backend user endpoints for saved articles and profile
const userAPI = {
  // POST /api/user/saved-articles - Save an article
  // Body: { articleData: { title, url, description, imageUrl, source, category, publishedAt, author, content } }
  // Returns: { success: true, message: "Article saved successfully", data: savedArticle }
  saveArticle: async (articleData) => {
    const response = await apiClient.post("/user/saved-articles", {
      articleData,
    });
    return response;
  },

  // DELETE /api/user/saved-articles?url=<articleUrl> - Unsave an article
  // Returns: { success: true, message: "Article removed from saved items" }
  unsaveArticle: async (articleUrl) => {
    const response = await apiClient.delete("/user/saved-articles", {
      params: { url: articleUrl },
    });
    return response;
  },

  // GET /api/user/saved-articles - Get all saved articles
  // Returns: { success: true, count: number, data: savedArticles[] }
  getSavedArticles: async () => {
    const response = await apiClient.get("/user/saved-articles");
    return response;
  },

  // GET /api/user/saved-articles/check?url=<articleUrl> - Check if article is saved
  // Returns: { success: true, isSaved: boolean, savedArticle: object|null }
  checkSavedStatus: async (articleUrl) => {
    const response = await apiClient.get("/user/saved-articles/check", {
      params: { url: articleUrl },
    });
    return response;
  },

  // GET /api/user/profile - Get user profile
  // Returns: { success: true, data: { _id, name, email, preferences, savedArticlesCount, createdAt } }
  getProfile: async () => {
    const response = await apiClient.get("/user/profile");
    return response;
  },

  // GET /api/user/preferences - Get user preferences
  // Returns: { success: true, data: { categories: [], topics: [] } }
  getPreferences: async () => {
    const response = await apiClient.get("/user/preferences");
    return response;
  },

  // PUT /api/user/preferences - Update user preferences
  // Body: { categories: [], topics: [] }
  // Returns: { success: true, message: "Preferences updated successfully", data: preferences }
  updatePreferences: async (preferences) => {
    const response = await apiClient.put("/user/preferences", preferences);
    return response;
  },
};

// Export default object
export default userAPI;

// Also export individual functions as named exports for convenience
export const saveArticle = userAPI.saveArticle;
export const unsaveArticle = userAPI.unsaveArticle;
export const getSavedArticles = userAPI.getSavedArticles;
export const checkSavedStatus = userAPI.checkSavedStatus;
export const getProfile = userAPI.getProfile;
export const getPreferences = userAPI.getPreferences;
export const updatePreferences = userAPI.updatePreferences;
