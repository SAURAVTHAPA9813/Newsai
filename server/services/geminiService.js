const { GoogleGenAI } = require('@google/genai');

// Initialize Gemini AI with new SDK
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate simplified explanation of an article using Gemini AI
 * @param {object} article - Article object with title, description, content
 * @returns {Promise<object>} - Explanation data
 */
exports.explainArticle = async (article) => {
  try {
    const prompt = `You are an expert at explaining complex news articles in simple terms for teenagers (age 15).

Article Title: ${article.title}
Article Description: ${article.description || 'No description'}

Please provide a simplified explanation of this article in the following JSON format:
{
  "simplifiedVersion": "A clear, simple explanation of the article in 3-4 sentences, followed by key points as bullet points. Use simple language that a 15-year-old can understand.",
  "keyTermsExplained": [
    {
      "term": "Term name",
      "explanation": "Simple explanation of what this term means"
    }
  ],
  "analogies": [
    "A relatable analogy that helps understand the main concept"
  ]
}

Guidelines:
- Use everyday language and avoid jargon
- Include 2-3 key terms that need explanation
- Provide 1-2 analogies that relate to things teenagers understand
- Keep it concise and engaging
- Focus on WHY this matters, not just WHAT happened

Return ONLY valid JSON, no markdown formatting or code blocks.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text;

    // Parse the JSON response
    let explanationData;
    try {
      // Remove markdown code blocks if present
      const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      explanationData = JSON.parse(cleanText);
    } catch (parseError) {
      console.error('Failed to parse Gemini response:', text);
      // Return fallback data
      explanationData = {
        simplifiedVersion: `This article discusses: ${article.title}.\n\n${article.description || 'No additional details available.'}`,
        keyTermsExplained: [],
        analogies: []
      };
    }

    return explanationData;
  } catch (error) {
    console.error('Gemini API Error (explainArticle):', error.message);
    throw new Error('Failed to generate article explanation');
  }
};

/**
 * Get market impact analysis using Gemini AI
 * @param {object} article - Article object
 * @returns {Promise<object>} - Market impact data
 */
exports.getMarketImpact = async (article) => {
  try {
    // Using new SDK - see response below

    const prompt = `Analyze the potential market and financial impact of this news article:

Title: ${article.title}
Description: ${article.description || 'No description'}
Category: ${article.category || 'general'}

Provide a market impact analysis in the following JSON format:
{
  "overallRisk": "HIGH|MODERATE|LOW",
  "riskScore": 0-100,
  "affectedSectors": [
    {
      "sector": "Sector name (e.g., Technology, Finance, Healthcare)",
      "impact": "POSITIVE|NEGATIVE|NEUTRAL",
      "change": "+2.3% or -1.5% (estimated percentage change)",
      "reason": "Brief explanation of why this sector is affected"
    }
  ],
  "stocksToWatch": [
    {
      "ticker": "Stock ticker symbol (e.g., AAPL, MSFT, TSLA)",
      "name": "Company name",
      "movement": "UP|DOWN",
      "confidence": 0-100
    }
  ],
  "investmentRecommendations": [
    "Actionable recommendation 1 for investors",
    "Actionable recommendation 2 for investors"
  ]
}

Analyze:
- Overall risk level and score (0-100)
- Which sectors/industries are most affected (include 2-4 sectors)
- Specific stocks to watch (include 3-5 stocks with ticker symbols)
- Investment recommendations (2-3 actionable insights)

Return ONLY valid JSON, no markdown formatting.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    // Response already available
    const text = response.text;

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error (getMarketImpact):', error.message);
    throw new Error('Failed to generate market impact analysis');
  }
};

/**
 * Get different perspectives on an article using Gemini AI
 * @param {object} article - Article object
 * @returns {Promise<object>} - Perspectives data
 */
exports.getPerspectives = async (article) => {
  try {
    // Using new SDK - see response below

    const prompt = `Analyze different perspectives on this news article:

Title: ${article.title}
Description: ${article.description || 'No description'}

Provide a balanced perspective analysis in the following JSON format:
{
  "perspectives": [
    {
      "viewpoint": "Name of perspective (e.g., Proponents, Critics, Neutral Analysts)",
      "stance": "Detailed explanation of this viewpoint and their overall position on the issue",
      "keyArguments": [
        "Key argument 1 from this perspective",
        "Key argument 2 from this perspective"
      ],
      "sources": [
        "Type of sources that typically hold this view (e.g., Industry experts, Environmental advocates)",
        "Another source type"
      ]
    }
  ],
  "consensusAreas": [
    "Point where different perspectives agree",
    "Another area of consensus"
  ],
  "disagreementAreas": [
    "Major point of disagreement between perspectives",
    "Another contentious issue"
  ]
}

Include at least 3 perspectives:
1. Proponents (positive/supportive view)
2. Critics (negative/opposing view)
3. Neutral analysts (balanced/cautious view)

For each perspective, provide 2-3 key arguments and representative source types.
Include 2-3 areas of consensus and 2-3 areas of disagreement.

Return ONLY valid JSON, no markdown formatting.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    // Response already available
    const text = response.text;

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error (getPerspectives):', error.message);
    throw new Error('Failed to generate perspectives analysis');
  }
};

/**
 * Get historical context and timeline using Gemini AI
 * @param {object} article - Article object
 * @returns {Promise<object>} - Context data
 */
exports.getContext = async (article) => {
  try {
    // Using new SDK - see response below

    const prompt = `Provide historical context for this news article:

Title: ${article.title}
Description: ${article.description || 'No description'}

Provide context analysis in the following JSON format:
{
  "timelineEvents": [
    {
      "date": "YYYY-MM-DD or TODAY",
      "event": "Event title",
      "description": "Detailed description of what happened",
      "importance": "HIGH|MEDIUM|LOW"
    }
  ],
  "backgroundContext": "Comprehensive paragraph explaining the historical background and how we got to this point",
  "keyEntities": [
    {
      "name": "Person, organization, or entity name",
      "role": "Their role or position",
      "relevance": "Why they are important to this story"
    }
  ],
  "relatedTopics": ["Related topic 1", "Related topic 2", "Related topic 3"]
}

Include 3-5 key timeline events that led to this story.
Include 2-4 key entities (people, organizations) involved.
Include 3-5 related topics for further exploration.

Return ONLY valid JSON, no markdown formatting.`;

    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: prompt });
    // Response already available
    const text = response.text;

    const cleanText = text.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    return JSON.parse(cleanText);
  } catch (error) {
    console.error('Gemini API Error (getContext):', error.message);
    throw new Error('Failed to generate context analysis');
  }
};
