import apiClient from './apiClient';

// Backend AI endpoints from server/routes/ai.js
const aiAPI = {
  // POST /api/ai/explain
  // Body: { title, description, content }
  explainArticle: async (articleData) => {
    const response = await apiClient.post('/ai/explain', {
      title: articleData.title,
      description: articleData.description || articleData.summary?.['15m'],
      content: articleData.content || articleData.summary?.['30m'],
    });
    return response; // { success: true, data: { explanation object } }
  },

  // POST /api/ai/market-impact
  // Body: { title, description, category }
  getMarketImpact: async (articleData) => {
    const response = await apiClient.post('/ai/market-impact', {
      title: articleData.title,
      description: articleData.description || articleData.summary?.['15m'],
      category: articleData.category,
    });
    return response; // { success: true, data: { market impact object } }
  },

  // POST /api/ai/perspectives
  // Body: { title, description }
  getPerspectives: async (articleData) => {
    const response = await apiClient.post('/ai/perspectives', {
      title: articleData.title,
      description: articleData.description || articleData.summary?.['15m'],
    });
    return response; // { success: true, data: { perspectives array } }
  },

  // POST /api/ai/context
  // Body: { title, description }
  getHistoricalContext: async (articleData) => {
    const response = await apiClient.post('/ai/context', {
      title: articleData.title,
      description: articleData.description || articleData.summary?.['15m'],
    });
    return response; // { success: true, data: { context timeline } }
  },

  // POST /api/ai/bias-analysis
  // Body: { title, description, content }
  analyzeBias: async (articleData) => {
    const response = await apiClient.post('/ai/bias-analysis', {
      title: articleData.title,
      description: articleData.description || articleData.summary?.['15m'],
      content: articleData.content || articleData.summary?.['30m'],
    });
    return response;
  },

  // POST /api/ai/fact-check
  // Body: { claim, context }
  factCheck: async (claim, context = '') => {
    const response = await apiClient.post('/ai/fact-check', {
      claim,
      context,
    });
    return response;
  },
};

export default aiAPI;
