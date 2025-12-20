import apiClient from "./apiClient";

// Backend topic matrix endpoints from server/routes/topicMatrix.js
const topicMatrixAPI = {
  // GET /api/user/topic-matrix
  // Returns: { success: true, data: { contextProfile, firewallSettings, aiPolicy, topics, topicPreferences, uiState } }
  getTopicMatrixState: async () => {
    const response = await apiClient.get("/user/topic-matrix");
    return response; // { success: true, data: state }
  },

  // PUT /api/user/context-profile
  // Body: { industry, region, lifeStage, interests, expertise }
  // Returns: { success: true, message: "Context profile updated", data: contextProfile }
  updateContextProfile: async (profile) => {
    const response = await apiClient.put("/user/context-profile", profile);
    return response; // { success: true, message, data }
  },

  // PUT /api/user/firewall-settings
  // Body: firewallSettings object
  // Returns: { success: true, message: "Firewall settings updated", data: firewallSettings }
  updateFirewallSettings: async (settings) => {
    const response = await apiClient.put("/user/firewall-settings", settings);
    return response; // { success: true, message, data }
  },

  // PUT /api/user/ai-policy
  // Body: aiPolicy object
  // Returns: { success: true, message: "AI policy updated", data: aiPolicy }
  updateAiPolicy: async (policy) => {
    const response = await apiClient.put("/user/ai-policy", policy);
    return response; // { success: true, message, data }
  },

  // PUT /api/user/topics/:topicId
  // Body: { priority, keywords, blockedKeywords, notificationEnabled, frequencyPreference }
  // Returns: { success: true, message: "Topic preference updated", data: preference }
  updateTopicPreference: async (topicId, preferences) => {
    const response = await apiClient.put(
      `/user/topics/${topicId}`,
      preferences
    );
    return response; // { success: true, message, data }
  },

  // Client-side only - UI state management (no backend call needed)
  updateUIState: async (uiState) => {
    // This is handled client-side only, no API call needed
    return { success: true, message: "UI state updated locally" };
  },
};

export default topicMatrixAPI;
