const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI-powered command suggestions based on user input
 * @param {string} query - User's search/command query
 * @param {array} recentArticles - Recent articles for context (optional)
 * @returns {Promise<array>} - Array of command suggestions
 */
exports.generateCommandSuggestions = async (query, recentArticles = []) => {
  try {
    if (!query || query.trim().length === 0) {
      return [];
    }

    // Using new SDK

    // Build context from recent articles
    const articleContext = recentArticles.slice(0, 10).map((a, i) =>
      `${i + 1}. ${a.title}`
    ).join('\n');

    const prompt = `You are an AI assistant for a news dashboard. A user has typed: "${query}"

${articleContext ? `Recent news headlines:\n${articleContext}\n\n` : ''}Generate 3-5 intelligent command suggestions based on this input. Commands can be:
- "Summarize [topic]" - to get AI summary
- "Explain [topic]" - to get detailed explanation
- "Filter by [category/topic]" - to filter news
- "Search [keywords]" - to search for specific news
- "Show trends in [topic]" - to see trending topics
- "Market impact of [topic]" - to analyze economic impact

Return ONLY a JSON array with this format:
[
  {
    "title": "Command title",
    "description": "What this command does",
    "action": "summarize" | "explain" | "filter" | "search" | "trends" | "market",
    "params": { "topic": "..." } or { "query": "..." } or { "category": "..." }
  }
]

Make suggestions highly relevant to the user's query. If the query mentions specific topics like "AI", "economy", "climate", etc., tailor suggestions to those topics.

Return ONLY valid JSON, no markdown formatting.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    // Response available
    const text = response.text;

    // Parse JSON response
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const suggestions = JSON.parse(cleanText);

    // Validate and limit to 5 suggestions
    if (Array.isArray(suggestions)) {
      return suggestions.slice(0, 5);
    }

    return [];
  } catch (error) {
    console.error('AI Command Suggestions Error:', error.message);

    // Return fallback suggestions based on query
    const query = query.toLowerCase();
    const fallbackSuggestions = [];

    if (query.includes('ai') || query.includes('tech')) {
      fallbackSuggestions.push({
        title: 'Filter Technology News',
        description: 'Show only technology-related articles',
        action: 'filter',
        params: { category: 'technology' }
      });
      fallbackSuggestions.push({
        title: 'Summarize AI Developments',
        description: 'Get AI summary of recent AI news',
        action: 'summarize',
        params: { topic: 'AI' }
      });
    } else if (query.includes('market') || query.includes('stock') || query.includes('economy')) {
      fallbackSuggestions.push({
        title: 'Market Impact Analysis',
        description: 'Analyze market impact of current events',
        action: 'market',
        params: { topic: query }
      });
      fallbackSuggestions.push({
        title: 'Filter Business News',
        description: 'Show only business and finance articles',
        action: 'filter',
        params: { category: 'business' }
      });
    } else {
      fallbackSuggestions.push({
        title: `Search "${query}"`,
        description: 'Search news articles',
        action: 'search',
        params: { query }
      });
      fallbackSuggestions.push({
        title: `Explain ${query}`,
        description: 'Get detailed explanation',
        action: 'explain',
        params: { topic: query }
      });
    }

    fallbackSuggestions.push({
      title: 'Show Trending Topics',
      description: 'View what\'s trending now',
      action: 'trends',
      params: {}
    });

    return fallbackSuggestions.slice(0, 5);
  }
};

/**
 * Execute a command action
 * @param {string} action - Action type (summarize, explain, filter, search, trends, market)
 * @param {object} params - Action parameters
 * @returns {Promise<object>} - Command execution result with redirect info
 */
exports.executeCommand = async (action, params) => {
  try {
    // Return execution plan (frontend will handle actual execution)
    const executionPlan = {
      action,
      params,
      success: true
    };

    switch (action) {
      case 'summarize':
      case 'explain':
        executionPlan.redirect = '/dashboard';
        executionPlan.module = action;
        break;

      case 'filter':
        executionPlan.redirect = '/dashboard';
        executionPlan.filter = params.category || params.topic;
        break;

      case 'search':
        executionPlan.redirect = '/dashboard';
        executionPlan.search = params.query;
        break;

      case 'trends':
        executionPlan.redirect = '/dashboard';
        executionPlan.view = 'trends';
        break;

      case 'market':
        executionPlan.redirect = '/dashboard';
        executionPlan.module = 'market-impact';
        break;

      default:
        executionPlan.success = false;
        executionPlan.error = 'Unknown action';
    }

    return executionPlan;
  } catch (error) {
    console.error('Execute command error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
