const { GoogleGenAI } = require('@google/genai');
const IntelligenceBriefing = require('../models/IntelligenceBriefing');
const newsService = require('./newsService');
const trendAnalysisService = require('./trendAnalysisService');

// Initialize Gemini AI with correct SDK
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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

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

/**
 * Generate complete briefing for all modes
 * @param {string} userId - Optional user ID for personalization
 * @returns {Promise<object>} - Complete briefing with all modes
 */
exports.generateCompleteBriefing = async (userId = null) => {
  try {
    console.log('📰 Generating complete intelligence briefing...');

    // Fetch latest headlines (50 articles for comprehensive analysis)
    const allArticles = await newsService.getHeadlines(1, 50);

    if (!allArticles || allArticles.length === 0) {
      throw new Error('No articles available for briefing generation');
    }

    console.log(`✅ Fetched ${allArticles.length} articles for briefing`);

    // Extract trending topics
    const { trends } = await trendAnalysisService.getTrendingTopics();
    const trendingTopics = trends.map(t => ({
      name: t.name,
      category: t.category,
      mentions: t.mentions || 0
    }));

    // Generate briefings for each mode
    const modes = ['Global', 'Markets', 'Tech', 'My Life'];
    const briefings = {};

    for (const mode of modes) {
      console.log(`🤖 Generating ${mode} briefing...`);
      const modeBriefing = await exports.generateBriefing(allArticles, mode);
      briefings[mode.toLowerCase().replace(/ /g, '')] = modeBriefing;

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Determine generation time (morning or evening)
    const now = new Date();
    const hour = now.getHours();
    const generationTime = hour >= 8 && hour < 20 ? 'morning' : 'evening';
    const date = now.toISOString().split('T')[0];

    // Save to database
    const briefingDoc = new IntelligenceBriefing({
      userId: userId,
      date: date,
      generationTime: generationTime,
      global: briefings.global,
      markets: briefings.markets,
      tech: briefings.tech,
      myLife: briefings.mylife,
      trendingTopics: trendingTopics,
      sourceHeadlines: allArticles.slice(0, 20).map(a => ({
        title: a.title,
        source: typeof a.source === 'string' ? a.source : (a.source?.name || 'Unknown'),
        category: a.category || 'general',
        publishedAt: a.publishedAt
      })),
      status: 'completed',
      geminiTokensUsed: allArticles.length * 4 // Rough estimate
    });

    await briefingDoc.save();

    console.log(`✅ Complete briefing generated and saved for ${generationTime} on ${date}`);

    return briefingDoc;
  } catch (error) {
    console.error('❌ Error generating complete briefing:', error);

    // Log failed attempt to database
    const now = new Date();
    const hour = now.getHours();
    const generationTime = hour >= 8 && hour < 20 ? 'morning' : 'evening';
    const date = now.toISOString().split('T')[0];

    await IntelligenceBriefing.create({
      userId: userId,
      date: date,
      generationTime: generationTime,
      status: 'failed',
      error: error.message
    });

    throw error;
  }
};

/**
 * Get current active briefing (fetch from DB or generate if needed)
 * @param {string} userId - Optional user ID
 * @param {boolean} forceRefresh - Force new generation
 * @returns {Promise<object>} - Briefing data
 */
exports.getCurrentBriefing = async (userId = null, forceRefresh = false) => {
  try {
    // Check if we need to generate new briefing
    const needsGen = await IntelligenceBriefing.needsGeneration(userId);

    if (forceRefresh || needsGen) {
      console.log('🔄 Generating new briefing...');
      return await exports.generateCompleteBriefing(userId);
    }

    // Get existing briefing
    const briefing = await IntelligenceBriefing.getCurrentBriefing(userId);

    if (!briefing) {
      console.log('⚠️  No existing briefing found, generating new one...');
      return await exports.generateCompleteBriefing(userId);
    }

    console.log(`✅ Retrieved existing ${briefing.generationTime} briefing from ${briefing.date}`);
    return briefing;

  } catch (error) {
    console.error('❌ Error getting current briefing:', error);

    // Return generic fallback briefing
    return {
      global: {
        globalSituation: 'Intelligence briefing service is temporarily unavailable.',
        globalDelta: 'Please try refreshing in a few moments.',
        impactOnYou: {
          industry: 'General',
          region: 'Global',
          summary: 'We are working to restore the briefing service.',
          keyPoints: [
            'Intelligence briefing generation failed',
            'Please check back in a few minutes',
            'You can still browse individual articles below'
          ]
        }
      },
      markets: null,
      tech: null,
      myLife: null,
      trendingTopics: [],
      status: 'failed',
      error: error.message
    };
  }
};

/**
 * Format briefing for frontend consumption
 * @param {object} briefingDoc - MongoDB briefing document
 * @returns {object} - Formatted briefing
 */
exports.formatBriefing = (briefingDoc) => {
  if (!briefingDoc) return null;

  return {
    id: briefingDoc._id,
    generatedAt: briefingDoc.generatedAt,
    generationTime: briefingDoc.generationTime,
    date: briefingDoc.date,
    global: briefingDoc.global,
    markets: briefingDoc.markets,
    tech: briefingDoc.tech,
    myLife: briefingDoc.myLife,
    trendingTopics: briefingDoc.trendingTopics || [],
    status: briefingDoc.status,
    lastUpdated: briefingDoc.updatedAt
  };
};
