const { GoogleGenAI } = require('@google/genai');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * Generate AI-personalized summary based on user preferences
 * @param {Object} article - Article data
 * @param {Object} preferences - User AI preferences
 * @returns {Promise<Object>} Enhanced article with AI summary
 */
exports.generatePersonalizedSummary = async (article, preferences = {}) => {
  // Default preferences
  const {
    depth = 'standard',           // basic, standard, comprehensive
    summaryStyle = 'mixed',        // brief, mixed, full
    tone = 'neutral'               // positive, neutral, analytical
  } = preferences;

  try {
    // Build prompt based on preferences
    const prompt = buildPrompt(article, depth, summaryStyle, tone);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const summaryText = response.text.trim();

    return {
      ...article,
      aiSummary: summaryText,
      enhancedBy: 'Gemini AI',
      preferences: { depth, summaryStyle, tone }
    };
  } catch (error) {
    console.error('AI Summary Generation Error:', error.message);

    // Check if it's a quota error
    if (error.status === 429) {
      console.warn('⚠️  Gemini API quota exceeded. Using fallback summary.');
    }

    // Return original article with fallback summary on error
    return {
      ...article,
      aiSummary: article.description || 'Summary unavailable',
      enhancedBy: 'fallback',
      preferences: { depth, summaryStyle, tone }
    };
  }
};

/**
 * Generate summaries for multiple articles in batch
 * @param {Array} articles - Array of articles
 * @param {Object} preferences - User AI preferences
 * @returns {Promise<Array>} Articles with AI summaries
 */
exports.generateBatchSummaries = async (articles, preferences = {}) => {
  const BATCH_SIZE = 5; // Process 5 articles at a time to avoid rate limits
  const results = [];

  for (let i = 0; i < articles.length; i += BATCH_SIZE) {
    const batch = articles.slice(i, i + BATCH_SIZE);
    const batchPromises = batch.map(article =>
      exports.generatePersonalizedSummary(article, preferences)
    );
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
  }

  return results;
};

/**
 * Build AI prompt based on user preferences
 */
function buildPrompt(article, depth, summaryStyle, tone) {
  const { title, description, content } = article;
  const articleText = content || description || title;

  // Reading Level Instructions
  const depthInstructions = {
    basic: `
      - Use simple language (8th grade reading level)
      - Explain technical terms in plain English
      - Avoid jargon and acronyms (or explain them)
      - Include context: "This matters because..."
    `,
    standard: `
      - Use clear, professional language
      - Balance technical terms with explanations
      - Provide moderate context and background
      - Assume general knowledge of current events
    `,
    comprehensive: `
      - Use technical/industry language freely
      - Deep dive into implications and nuances
      - Connect to broader trends and historical context
      - Assume expert-level domain knowledge
    `
  };

  // Story Length Instructions
  const lengthInstructions = {
    brief: `
      - Write 2-3 concise sentences (50-75 words)
      - Focus ONLY on the core news event
      - Skip background details
    `,
    mixed: `
      - Write 1-2 short paragraphs (100-150 words)
      - Include key facts + brief context
      - Mention 2-3 most important points
    `,
    full: `
      - Write 3-4 detailed paragraphs (200-300 words)
      - Include comprehensive background
      - Explore multiple angles and implications
      - Add expert-level analysis
    `
  };

  // Tone Instructions
  const toneInstructions = {
    positive: `
      - Emphasize opportunities, solutions, and positive outcomes
      - Frame challenges as growth opportunities
      - Highlight success stories and progress
      - Use optimistic but realistic language
    `,
    neutral: `
      - Present facts objectively without bias
      - Balance positive and negative aspects
      - Use neutral, journalistic language
      - Avoid emotional or loaded terms
    `,
    analytical: `
      - Take a critical, questioning approach
      - Explore risks, challenges, and potential issues
      - Question assumptions and examine trade-offs
      - Use skeptical but fair analysis
    `
  };

  return `You are a news summarization AI helping users understand current events.

**Original Article:**
Title: ${title}
Content: ${articleText}

**User's Preferences:**

**Reading Level: ${depth.toUpperCase()}**
${depthInstructions[depth]}

**Story Length: ${summaryStyle.toUpperCase()}**
${lengthInstructions[summaryStyle]}

**Tone: ${tone.toUpperCase()}**
${toneInstructions[tone]}

**Your Task:**
Generate a personalized summary that matches ALL the user's preferences above.

**Output Format:**
Return ONLY the summary text. No labels, no prefixes, no "Summary:" header.
Start directly with the content.

**Summary:**`;
}

/**
 * Get reading time estimate based on summary style
 * @param {string} summaryStyle - brief, mixed, full
 * @returns {string} Estimated reading time
 */
exports.getReadingTime = (summaryStyle) => {
  const times = {
    brief: '30 sec',
    mixed: '1-2 min',
    full: '3-5 min'
  };
  return times[summaryStyle] || '1 min';
};

/**
 * Extract key insights from article based on preferences
 * @param {Object} article - Article data
 * @param {Object} preferences - User preferences
 * @returns {Promise<Array>} Key insights
 */
exports.extractKeyInsights = async (article, preferences = {}) => {
  const { tone = 'neutral' } = preferences;

  try {
    const prompt = `Analyze this article and extract 3 key insights:

Title: ${article.title}
Content: ${article.description || article.content}

Tone: ${tone}
${tone === 'positive' ? 'Focus on opportunities and positive developments.' : ''}
${tone === 'analytical' ? 'Focus on critical analysis and potential concerns.' : ''}

Return EXACTLY 3 bullet points (start each with "- "). Keep each under 20 words.

Insights:`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text.trim();
    const insights = text
      .split('\n')
      .filter(line => line.trim().startsWith('-'))
      .map(line => line.replace(/^-\s*/, '').trim())
      .slice(0, 3);

    return insights.length > 0 ? insights : [
      'Article analysis in progress',
      'Key points being extracted',
      'Summary will be available shortly'
    ];
  } catch (error) {
    console.error('Key Insights Error:', error.message);
    return ['Summary unavailable'];
  }
};
