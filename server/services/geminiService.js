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

    const prompt = `Analyze the potential market impact of this news article:

Title: ${article.title}
Description: ${article.description || 'No description'}
Category: ${article.category || 'general'}

Provide a market impact analysis in the following JSON format:
{
  "overallImpact": "HIGH|MEDIUM|LOW",
  "impactScore": 0-100,
  "affectedSectors": [
    {
      "sector": "Sector name",
      "impact": "HIGH|MEDIUM|LOW",
      "percentage": 0-100,
      "description": "Brief explanation"
    }
  ],
  "keyInsights": [
    "Key insight 1",
    "Key insight 2"
  ],
  "timeframe": "Short-term|Medium-term|Long-term"
}

Analyze:
- Which sectors/industries are most affected
- How strong the impact will be (score and level)
- Key insights for investors
- Expected timeframe of impact

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
      "viewpoint": "Name of perspective",
      "stance": "POSITIVE|NEGATIVE|BALANCED",
      "mainArguments": ["Argument 1", "Argument 2"],
      "representativeSources": ["Source type 1", "Source type 2"]
    }
  ],
  "commonGround": ["Point of agreement 1", "Point of agreement 2"],
  "openQuestions": ["Question 1", "Question 2"]
}

Include at least 3 perspectives:
1. Proponents (positive view)
2. Critics (negative view)
3. Neutral analysts (balanced view)

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
  "summary": "Brief summary of the story's development",
  "timeline": [
    {
      "date": "YYYY-MM-DD",
      "event": "Event description",
      "importance": "HIGH|MEDIUM|LOW",
      "description": "Details"
    }
  ],
  "relatedEvents": ["Related event 1", "Related event 2"],
  "backgroundInfo": "Additional context and background"
}

Include 3-5 key timeline events that led to this story.

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
