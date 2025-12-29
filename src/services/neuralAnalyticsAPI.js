import apiClient from "./apiClient";

// Map frontend timeRange values to backend format
const mapTimeRange = (timeRange) => {
  const mapping = {
    'LAST_7_DAYS': '7d',
    'LAST_30_DAYS': '30d',
    'LAST_90_DAYS': '90d',
    'ALL_TIME': 'all'
  };
  return mapping[timeRange] || '30d'; // Default to 30 days
};

// Map frontend device values to backend format
const mapDevice = (device) => {
  return device?.toLowerCase(); // mobile, desktop, tablet
};

// Backend analytics endpoints from server/routes/analytics.js
const neuralAnalyticsAPI = {
  // GET /api/analytics/overview?timeRange=30d&device=&topicId=
  // Returns: { success: true, data: { kpiCards, kpis, dailyAggregates, topicMetrics, sourceMetrics, insights, readingSessions, filters } }
  getNeuralAnalyticsData: async (filters = {}) => {
    const params = new URLSearchParams();

    if (filters.timeRange) params.append("timeRange", mapTimeRange(filters.timeRange));
    if (filters.deviceFilter && filters.deviceFilter.length > 0) {
      // For now, just use the first device filter
      params.append("device", mapDevice(filters.deviceFilter[0]));
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

    if (filters.timeRange) params.append("timeRange", mapTimeRange(filters.timeRange));
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

    if (filters.timeRange) params.append("timeRange", mapTimeRange(filters.timeRange));

    const response = await apiClient.get(
      `/analytics/integrity?${params.toString()}`
    );
    return response; // { success: true, data: integrity }
  },

  // POST /api/analytics/activity/batch
  // Logs batched user activities
  // Returns: { success: true, message: string, data: { count, sessionId } }
  logActivityBatch: async (batchData) => {
    const response = await apiClient.post('/analytics/activity/batch', batchData);
    return response; // { success: true, message: "...", data: { count, sessionId } }
  },

  // POST /api/analytics/sessions
  // Creates a reading session record
  // Returns: { success: true, message: string, data: session }
  createReadingSession: async (sessionData) => {
    const response = await apiClient.post('/analytics/sessions', sessionData);
    return response; // { success: true, message: "Session tracked successfully", data: session }
  },
};

// Export default object
export default neuralAnalyticsAPI;

// Also export individual functions as named exports for convenience
export const getNeuralAnalyticsData = neuralAnalyticsAPI.getNeuralAnalyticsData;
export const getTopicTrendData = neuralAnalyticsAPI.getTopicTrendData;
export const getIntegrityData = neuralAnalyticsAPI.getIntegrityData;
export const createReadingSession = neuralAnalyticsAPI.createReadingSession;
