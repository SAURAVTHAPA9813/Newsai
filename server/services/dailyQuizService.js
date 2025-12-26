const mongoose = require('mongoose');
const DailyQuiz = require('../models/DailyQuiz');
const { QuizTemplate } = require('../models/Quiz');
const trendingArticlesService = require('./trendingArticlesService');
const quizGenerator = require('./quizGenerator');

/**
 * Generate daily quiz from trending news articles
 * Creates 10 questions from different categories
 */
const generateDailyQuiz = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log(`🧠 Generating daily quiz for ${today}...`);

    // Get trending articles from cache (all categories)
    const allArticles = await trendingArticlesService.getTrendingArticles('all');

    if (!allArticles || allArticles.length === 0) {
      throw new Error('No trending articles available for quiz generation');
    }

    // Select articles from different categories for diverse questions
    const categories = ['tech', 'business', 'sports', 'health', 'politics'];
    const selectedArticles = [];

    // Pick 1 article from each category
    categories.forEach(cat => {
      const catArticles = allArticles.filter(a => a.category === cat);
      if (catArticles.length > 0) {
        selectedArticles.push(catArticles[0]);
      }
    });

    // Add 5 more from 'all' to reach 10 total
    const generalArticles = allArticles.filter(a =>
      !selectedArticles.some(s => s.url === a.url)
    ).slice(0, 5);

    selectedArticles.push(...generalArticles);

    // Ensure we have at least 10 articles
    const finalArticles = selectedArticles.slice(0, 10);

    if (finalArticles.length < 5) {
      throw new Error('Not enough articles to generate quiz');
    }

    console.log(`📰 Selected ${finalArticles.length} articles from categories:`,
      [...new Set(finalArticles.map(a => a.category))]);

    // Generate quiz with Gemini (10 questions)
    const questions = await quizGenerator.generateQuizFromArticles(
      finalArticles,
      10  // 10 questions
    );

    // Tag each question with category based on source article
    const questionsWithCategories = questions.map((q, idx) => ({
      ...q,
      category: finalArticles[idx]?.category || 'general'
    }));

    console.log(`✅ Generated ${questionsWithCategories.length} questions`);

    // Create QuizTemplate
    const quiz = new QuizTemplate({
      title: `Daily News Quiz - ${today}`,
      description: 'Test your knowledge of today\'s news',
      category: 'news',
      type: 'daily',
      difficulty: 'medium',
      questions: questionsWithCategories,
      isActive: true,
      startDate: new Date(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours
    });

    await quiz.save();
    console.log(`✅ Created QuizTemplate with ID: ${quiz._id}`);

    // Cache in DailyQuiz model
    const cache = new DailyQuiz({
      date: today,
      quizId: quiz._id,
      questions: questionsWithCategories,
      categories: [...new Set(questionsWithCategories.map(q => q.category))],
      totalPoints: quiz.totalPoints,
      status: 'completed'
    });

    await cache.save();
    console.log(`✅ Daily quiz cache created: ${cache.totalPoints} points, ${cache.categories.length} categories`);

    return cache;

  } catch (error) {
    console.error('❌ Error generating daily quiz:', error);

    // Log failed attempt
    const today = new Date().toISOString().split('T')[0];
    await DailyQuiz.create({
      date: today,
      quizId: new mongoose.Types.ObjectId(), // Dummy ID
      questions: [],
      categories: [],
      totalPoints: 0,
      status: 'failed',
      error: error.message
    });

    throw error;
  }
};

/**
 * Get today's daily quiz (from cache or generate if needed)
 */
const getDailyQuiz = async () => {
  try {
    // Check if generation needed
    const needsGen = await DailyQuiz.needsGeneration();

    if (needsGen) {
      console.log('🔄 Generating new daily quiz...');
      await generateDailyQuiz();
    }

    // Get today's quiz
    let cache = await DailyQuiz.getTodayQuiz();

    if (!cache) {
      // If still no cache (before 8 AM), try yesterday's cache
      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
      cache = await DailyQuiz.findOne({
        date: yesterday,
        status: 'completed'
      });

      if (cache) {
        console.log(`✅ Retrieved yesterday's quiz (${cache.date})`);
        return cache;
      }

      // No cache available, generate immediately
      console.log('⚠️  No cache available, generating now...');
      cache = await generateDailyQuiz();
    }

    console.log(`✅ Retrieved daily quiz from cache (${cache.date})`);
    return cache;

  } catch (error) {
    console.error('❌ Error getting daily quiz:', error);
    throw error;
  }
};

module.exports = {
  generateDailyQuiz,
  getDailyQuiz
};
