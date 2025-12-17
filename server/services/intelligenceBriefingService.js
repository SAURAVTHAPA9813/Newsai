const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate intelligence briefing based on articles
 * @param {array} articles - Array of article objects
 * @param {string} mode - Briefing mode (Global, Markets, Tech, My Life)
 * @returns {Promise<object>} - Intelligence briefing data
 */
exports.generateBriefing = async (articles, mode = 'Global') => {
  try {
    // Using new SDK

    // Extract article summaries for context
    const articleContext = articles
      .slice(0, 20) // Use top 20 articles
      .map((a, i) => `${i + 1}. ${a.title} - ${a.description || 'No description'}`)
      .join('\n');

    const modePrompts = {
      Global: `Analyze these news articles and provide a global intelligence briefing focused on world events, geopolitics, and macro trends.`,
      Markets: `Analyze these news articles and provide a markets intelligence briefing focused on financial markets, stocks, bonds, commodities, and economic indicators.`,
      Tech: `Analyze these news articles and provide a technology intelligence briefing focused on AI, startups, big tech, innovation, and digital trends.`,
      'My Life': `Analyze these news articles and provide a personalized intelligence briefing focused on how these events impact everyday life, jobs, cost of living, and local concerns.`
    };

    const prompt = `${modePrompts[mode] || modePrompts.Global}

Current Top News Articles:
${articleContext}

Provide a comprehensive intelligence briefing in the following JSON format:
{
  "globalSituation": "A 2-3 sentence overview of the current situation based on the articles",
  "globalDelta": "A 1-2 sentence summary of what changed in the last 24 hours (key movements, events, shifts)",
  "impactOnYou": {
    "industry": "The primary industry/sector affected (e.g., 'Technology', 'Finance', 'General')",
    "region": "The geographic focus (e.g., 'Global', 'US Markets', 'Tech Sector')",
    "summary": "A 2 sentence summary of how this impacts people",
    "keyPoints": [
      "First key actionable insight or trend",
      "Second key actionable insight or trend",
      "Third key actionable insight or trend"
    ]
  }
}

Guidelines:
- Be concise and informative
- Focus on actionable insights
- Use specific data points from the articles when available
- Maintain a professional, analytical tone
- For "My Life" mode, make it more personal and relatable
- Ensure all content is directly derived from the provided articles

Return ONLY valid JSON, no markdown formatting.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    // Response available
    const text = response.text;

    // Parse the JSON response
    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    const briefingData = JSON.parse(cleanText);

    return briefingData;
  } catch (error) {
    console.error('Gemini API Error (generateBriefing):', error.message);

    // Return fallback data instead of throwing
    return {
      globalSituation: 'Unable to generate briefing at this time. Please try again later.',
      globalDelta: 'Briefing service temporarily unavailable.',
      impactOnYou: {
        industry: 'General',
        region: 'Global',
        summary: 'Please refresh to try loading the intelligence briefing again.',
        keyPoints: [
          'Intelligence briefing is currently unavailable',
          'Please check your internet connection',
          'Try refreshing the page in a few moments'
        ]
      }
    };
  }
};
