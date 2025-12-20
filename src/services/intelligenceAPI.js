import apiClient from './apiClient';

// Backend intelligence briefing endpoints
const intelligenceAPI = {
  /**
   * Get current intelligence briefing (cached if available)
   * Auto-generates if needed based on time (8 AM/8 PM schedule)
   * @returns {Promise} Briefing data with all modes (Global, Markets, Tech, My Life)
   */
  getCurrentBriefing: async () => {
    const response = await apiClient.get('/intelligence-briefing');
    return response.data; // { success: true, data: { briefing object } }
  },

  /**
   * Manually refresh the briefing (DEPRECATED - now just uses getCurrentBriefing)
   * This endpoint forces regeneration and uses 4 Gemini API calls
   * NOT RECOMMENDED: Use getCurrentBriefing() instead to preserve quota
   * @returns {Promise} Newly generated briefing
   */
  refreshBriefing: async () => {
    const response = await apiClient.post('/intelligence-briefing/refresh');
    return response.data; // { success: true, data: { briefing object }, refreshed: true }
  },

  /**
   * Check if briefing needs generation
   * @returns {Promise} Status information
   */
  getBriefingStatus: async () => {
    const response = await apiClient.get('/intelligence-briefing/status');
    return response.data; // { success: true, data: { needsGeneration, hasCurrent, etc } }
  },

  // Legacy single-mode briefing generation (deprecated)
  generateBriefing: async (mode = 'Global') => {
    const response = await apiClient.post('/intelligence/briefing', { mode });
    return response; // { success: true, data: { briefing object } }
  },
};

export default intelligenceAPI;
