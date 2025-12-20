import apiClient from "./apiClient";

// Backend analytics endpoints from server/routes/analytics.js
const neuralAnalyticsAPI = {
  // GET /api/analytics/overview?timeRange=30d&device=&topicId=
  // Returns: { success: true, data: { kpiCards, kpis, dailyAggregates, topicMetrics, sourceMetrics, insights, readingSessions, filters } }
  getNeuralAnalyticsData: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.append("timeRange", filters.timeRange);
    if (filters.deviceFilter && filters.deviceFilter.length > 0) {
      // For now, just use the first device filter
      params.append("device", filters.deviceFilter[0]);
    }
    if (filters.topicFilterId) params.append("topicId", filters.topicFilterId);

    const response = await apiClient.get(
      `/analytics/overview?${params.toString()}`
    );
    return response; // { success: true, data: analyticsData }
  },

  // GET /api/analytics/trends?timeRange=30d&topicId=
  // Returns: { success: true, data: trends[] }
  getTopicTrendData: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.append("timeRange", filters.timeRange);
    if (filters.topicFilterId) params.append("topicId", filters.topicFilterId);

    const response = await apiClient.get(
      `/analytics/trends?${params.toString()}`
    );
    return response; // { success: true, data: trends }
  },

  // GET /api/analytics/integrity?timeRange=30d
  // Returns: { success: true, data: { verified, opinion, total, score } }
  getIntegrityData: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.append("timeRange", filters.timeRange);

    const response = await apiClient.get(
      `/analytics/integrity?${params.toString()}`
    );
    return response; // { success: true, data: integrity }
  },
};

export default neuralAnalyticsAPI;
