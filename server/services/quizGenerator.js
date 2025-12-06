const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Generate quiz questions from news articles using Gemini AI
 * @param {Array} articles - Array of news articles with title and description
 * @param {Number} questionCount - Number of questions to generate (5-10)
 * @returns {Promise<Array>} - Array of quiz questions
 */
async function generateQuizFromArticles(articles, questionCount = 7) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    // Create comprehensive prompt for quiz generation
    const articlesText = articles.map((article, index) => {
      return `Article ${index + 1}: ${article.title}\n${article.description || ''}\nSource: ${article.source?.name || 'Unknown'}`;
    }).join('\n\n');

    const prompt = `You are a quiz generator. Based on these recent news headlines, create ${questionCount} multiple choice quiz questions.

${articlesText}

IMPORTANT RULES:
1. Questions must be factual and based ONLY on the headlines provided
2. Create ${questionCount} questions total
3. Each question must have exactly 4 options
4. Only ONE option should be correct
5. Include a brief explanation for why the answer is correct
6. Make questions simple but informative
7. Questions should test comprehension of the headlines

Return ONLY a valid JSON array with this EXACT format (no markdown, no code blocks, just pure JSON):
[
  {
    "question": "What is the main topic of the headline about [topic]?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correctAnswer": 0,
    "explanation": "This is correct because...",
    "difficulty": "medium",
    "points": 10
  }
]

Make sure the JSON is valid and parseable. Return ONLY the JSON array, nothing else.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Extract JSON from response (handle markdown code blocks if present)
    let jsonText = responseText.trim();

    // Remove markdown code blocks if present
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '').trim();
    }

    // Parse JSON
    const questions = JSON.parse(jsonText);

    // Validate questions
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new Error('Generated quiz is not a valid array');
    }

    // Ensure each question has required fields
    const validatedQuestions = questions.map((q, index) => ({
      question: q.question || `Question ${index + 1}`,
      options: Array.isArray(q.options) && q.options.length === 4
        ? q.options
        : ['Option 1', 'Option 2', 'Option 3', 'Option 4'],
      correctAnswer: typeof q.correctAnswer === 'number' && q.correctAnswer >= 0 && q.correctAnswer < 4
        ? q.correctAnswer
        : 0,
      explanation: q.explanation || 'No explanation provided.',
      difficulty: 'medium',
      points: 10
    }));

    return validatedQuestions;

  } catch (error) {
    console.error('Quiz generation error:', error);

    // Fallback to sample questions if AI fails
    return createFallbackQuiz(articles);
  }
}

/**
 * Create fallback quiz if AI generation fails
 * @param {Array} articles - Array of news articles
 * @returns {Array} - Array of basic quiz questions
 */
function createFallbackQuiz(articles) {
  const questions = [];

  // Create simple questions from article titles
  articles.slice(0, 5).forEach((article, index) => {
    const words = article.title.split(' ');
    const topic = words.slice(0, 3).join(' ');

    questions.push({
      question: `What is this headline about: "${article.title}"?`,
      options: [
        article.source?.name || 'News Source',
        'Sports',
        'Entertainment',
        'Weather'
      ],
      correctAnswer: 0,
      explanation: `This article is from ${article.source?.name || 'a news source'}.`,
      difficulty: 'easy',
      points: 10
    });
  });

  return questions;
}

module.exports = { generateQuizFromArticles };
