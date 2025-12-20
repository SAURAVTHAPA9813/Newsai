import apiClient from "./apiClient";

// Backend verification endpoints from server/routes/verification.js
const verifyAPI = {
  // POST /api/verification/verify
  // Body: { claimText, inputType, verificationMode }
  // Returns: { success: true, data: { score, verdict, verdictHuman, verdictColor, summary, tabData: { summaryTab, evidenceTab, biasTab, timelineTab, riskTab } } }
  verifyContent: async (
    claimText,
    inputType = "HEADLINE",
    verificationMode = "STANDARD"
  ) => {
    const response = await apiClient.post("/verification/verify", {
      claimText,
      inputType,
      verificationMode,
    });

    // Transform backend response to match frontend component expectations
    const data = response.data;
    return {
      truthDial: {
        score: data.score,
        verdictLabel: data.verdict,
        verdictLabelHuman: data.verdictHuman,
        scoreColor: data.verdictColor,
        verdictSummary: data.summary,
      },
      summaryTab: data.tabData.summaryTab,
      evidenceTab: data.tabData.evidenceTab,
      biasSentimentTab: data.tabData.biasTab || {
        corporateBiasLevel: "UNKNOWN",
        corporateBiasExplanation: "Analysis not available",
        politicalLean: "UNKNOWN",
        politicalLeanExplanation: "Analysis not available",
        emotionalTriggerLevel: "UNKNOWN",
        emotionalTriggerExplanation: "Analysis not available",
        biasChips: [],
        saferAlternativeFraming: "Analysis not available",
      },
      timelineTab: data.tabData.timelineTab,
      riskGuidanceTab: data.tabData.riskTab,
      auxiliary: {
        shortClaimSummary:
          claimText.length > 60
            ? claimText.substring(0, 57) + "..."
            : claimText,
        primaryStatusBadge: `${data.verdictHuman} · ${verificationMode}`,
        runMetadata: {
          modelName: "Gemini Pro",
          modelVersion: "v1.2",
          effectiveVerificationMode: verificationMode,
          estimatedLatencySeconds: 0.8 + Math.random() * 0.5,
        },
      },
    };
  },

  // GET /api/verification/history
  // Returns: { success: true, data: { history: [], message: "History feature coming soon" } }
  getVerificationHistory: async () => {
    const response = await apiClient.get("/verification/history");
    return response; // { success: true, data: { history, message } }
  },

  // GET /api/verification/stats
  // Returns: { success: true, data: { requestsThisHour, maxRequestsPerHour, remainingRequests } }
  getVerificationStats: async () => {
    const response = await apiClient.get("/verification/stats");
    return response; // { success: true, data: { requestsThisHour, maxRequestsPerHour, remainingRequests } }
  },

  // Helper function to get model status (mock for now, could be real endpoint later)
  getModelStatus: async () => {
    // This could be a real endpoint, but for now returning mock data
    return {
      modelName: "Gemini Pro",
      modelVersion: "v1.2",
      status: "ONLINE",
      reliability: 98.4,
      lastUpdate: "2h ago",
      averageLatency: 0.85,
    };
  },
};

// Export default object
export default verifyAPI;

// Also export individual functions as named exports for convenience
export const verifyContent = verifyAPI.verifyContent;
export const getVerificationHistory = verifyAPI.getVerificationHistory;
export const getVerificationStats = verifyAPI.getVerificationStats;
export const getModelStatus = verifyAPI.getModelStatus;
