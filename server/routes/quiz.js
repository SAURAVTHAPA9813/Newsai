const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { QuizTemplate, UserQuizAttempt } = require('../models/Quiz');
const { UserStats } = require('../models/UserStats');
const { generateQuizFromArticles } = require('../services/quizGenerator');
const newsService = require('../services/newsService');

// @desc    Get daily quiz
// @route   GET /api/quiz/daily
// @access  Private
router.get('/daily', protect, async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Find today's active quiz
    let quiz = await QuizTemplate.findOne({
      type: 'daily',
      isActive: true,
      startDate: { $gte: today }
    });

    // If no quiz exists, generate from today's news
    if (!quiz) {
      console.log('No quiz found for today, generating from news...');

      // Fetch top 10 headlines from NewsAPI
      const articles = await newsService.getHeadlines(1, 10);

      // Generate 5-10 questions using Gemini AI
      const questions = await generateQuizFromArticles(articles, 7);

      // Create new quiz
      quiz = new QuizTemplate({
        title: `Daily News Quiz - ${today.toLocaleDateString()}`,
        description: 'Test your knowledge of today\'s top news stories',
        category: 'news',
        type: 'daily',
        difficulty: 'medium',
        timeLimit: 10,
        questions,
        startDate: today,
        articleReference: {
          title: articles[0]?.title || 'Today\'s News',
          url: articles[0]?.url || '',
          summary: `Quiz based on ${articles.length} top headlines`
        }
      });

      await quiz.save();
      console.log('New quiz created successfully with', questions.length, 'questions');
    }

    // Check if user has already attempted this quiz
    const attempt = await UserQuizAttempt.findOne({
      user: req.user._id,
      quiz: quiz._id
    });

    res.json({
      success: true,
      data: {
        quiz: {
          _id: quiz._id,
          title: quiz.title,
          description: quiz.description,
          category: quiz.category,
          difficulty: quiz.difficulty,
          totalPoints: quiz.totalPoints,
          timeLimit: quiz.timeLimit,
          questionsCount: quiz.questions.length
        },
        hasAttempted: !!attempt,
        attempt: attempt ? {
          score: attempt.score,
          percentage: attempt.percentage,
          completed: attempt.completed,
          completedAt: attempt.completedAt
        } : null
      }
    });
  } catch (error) {
    console.error('Get daily quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching daily quiz'
    });
  }
});

// @desc    Get quiz questions
// @route   GET /api/quiz/:id/questions
// @access  Private
router.get('/:id/questions', protect, async (req, res) => {
  try {
    const quiz = await QuizTemplate.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Return questions without correct answers
    const questions = quiz.questions.map((q, index) => ({
      index,
      question: q.question,
      options: q.options,
      difficulty: q.difficulty,
      points: q.points
    }));

    res.json({
      success: true,
      data: {
        quizId: quiz._id,
        title: quiz.title,
        timeLimit: quiz.timeLimit,
        questions
      }
    });
  } catch (error) {
    console.error('Get quiz questions error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz questions'
    });
  }
});

// @desc    Submit quiz answers
// @route   POST /api/quiz/:id/submit
// @access  Private
router.post('/:id/submit', protect, async (req, res) => {
  try {
    const { answers, timeSpent } = req.body;

    const quiz = await QuizTemplate.findById(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if already attempted
    const existingAttempt = await UserQuizAttempt.findOne({
      user: req.user._id,
      quiz: quiz._id
    });

    if (existingAttempt && existingAttempt.completed) {
      return res.status(400).json({
        success: false,
        message: 'Quiz already completed'
      });
    }

    // Grade the quiz
    let score = 0;
    const gradedAnswers = answers.map((answer, index) => {
      const question = quiz.questions[index];
      const isCorrect = answer === question.correctAnswer;
      const pointsEarned = isCorrect ? question.points : 0;
      score += pointsEarned;

      return {
        questionIndex: index,
        userAnswer: answer,
        isCorrect,
        pointsEarned
      };
    });

    // Create or update attempt
    const attempt = new UserQuizAttempt({
      user: req.user._id,
      quiz: quiz._id,
      answers: gradedAnswers,
      score,
      totalPoints: quiz.totalPoints,
      timeSpent: timeSpent || 0,
      completed: true,
      completedAt: new Date()
    });

    await attempt.save();

    // Update user stats
    let userStats = await UserStats.findOne({ user: req.user._id });

    if (!userStats) {
      userStats = new UserStats({ user: req.user._id });
    }

    // Update quiz stats
    const correctAnswers = gradedAnswers.filter(a => a.isCorrect).length;
    userStats.quizStats.totalCompleted += 1;
    userStats.quizStats.totalCorrect += correctAnswers;
    userStats.quizStats.totalQuestions += quiz.questions.length;
    userStats.quizStats.averageScore = Math.round(
      (userStats.quizStats.averageScore * (userStats.quizStats.totalCompleted - 1) + attempt.percentage) /
      userStats.quizStats.totalCompleted
    );
    userStats.quizStats.highestScore = Math.max(userStats.quizStats.highestScore, attempt.percentage);

    if (attempt.percentage === 100) {
      userStats.quizStats.perfectScores += 1;
    }

    // Increment category count
    if (userStats.quizStats.categoriesCompleted[quiz.category] !== undefined) {
      userStats.quizStats.categoriesCompleted[quiz.category] += 1;
    }

    // Update streak
    const streakResult = userStats.updateStreak();

    // Add XP (10 XP per correct answer + bonus for perfect score)
    const xpEarned = correctAnswers * 10 + (attempt.percentage === 100 ? 50 : 0);
    const xpResult = userStats.addXP(xpEarned);

    // Add activity
    userStats.recentActivity.unshift({
      type: 'quiz_completed',
      description: `Completed: ${quiz.title} (${attempt.percentage}%)`,
      xpEarned,
      timestamp: new Date()
    });

    // Limit recent activity to 50 items
    if (userStats.recentActivity.length > 50) {
      userStats.recentActivity = userStats.recentActivity.slice(0, 50);
    }

    await userStats.save();

    res.json({
      success: true,
      message: 'Quiz submitted successfully',
      data: {
        attempt: {
          score: attempt.score,
          totalPoints: attempt.totalPoints,
          percentage: attempt.percentage,
          correctAnswers,
          totalQuestions: quiz.questions.length
        },
        results: gradedAnswers.map((a, index) => ({
          questionIndex: a.questionIndex,
          userAnswer: a.userAnswer,
          correctAnswer: quiz.questions[index].correctAnswer,
          isCorrect: a.isCorrect,
          pointsEarned: a.pointsEarned,
          explanation: quiz.questions[index].explanation
        })),
        stats: {
          xpEarned,
          totalXP: userStats.totalXP,
          level: userStats.level,
          leveledUp: xpResult.leveledUp,
          streak: streakResult.current,
          streakContinued: streakResult.streakContinued
        }
      }
    });
  } catch (error) {
    console.error('Submit quiz error:', error);
    res.status(500).json({
      success: false,
      message: 'Error submitting quiz'
    });
  }
});

// @desc    Get user quiz history
// @route   GET /api/quiz/history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const attempts = await UserQuizAttempt.find({
      user: req.user._id,
      completed: true
    })
      .populate('quiz', 'title category difficulty totalPoints')
      .sort({ completedAt: -1 })
      .limit(50);

    res.json({
      success: true,
      data: attempts.map(a => ({
        _id: a._id,
        quiz: a.quiz,
        score: a.score,
        totalPoints: a.totalPoints,
        percentage: a.percentage,
        timeSpent: a.timeSpent,
        completedAt: a.completedAt
      }))
    });
  } catch (error) {
    console.error('Get quiz history error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching quiz history'
    });
  }
});

module.exports = router;
