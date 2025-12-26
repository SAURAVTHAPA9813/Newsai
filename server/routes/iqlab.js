const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { UserStats } = require('../models/UserStats');
const { UserQuizAttempt } = require('../models/Quiz');
const dailyQuizService = require('../services/dailyQuizService');

/**
 * @desc    Get complete IQ Lab state
 * @route   GET /api/iqlab/state
 * @access  Protected
 */
router.get('/state', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user stats
    let userStats = await UserStats.findOne({ user: userId });
    if (!userStats) {
      userStats = new UserStats({ user: userId });
      await userStats.save();
    }

    // Calculate News IQ score (average quiz accuracy)
    const newsIq = calculateNewsIQ(userStats);

    // Get today's quiz
    const dailyQuiz = await dailyQuizService.getDailyQuiz();

    // Check if user already attempted today's quiz
    const todayAttempts = await UserQuizAttempt.find({
      user: userId,
      quiz: dailyQuiz.quizId
    }).sort({ completedAt: -1 });

    // Calculate skill scores from category performance
    const skillScores = calculateSkillScores(userStats);

    // Get streak info with 30-day history
    const streakInfo = generateStreakHistory(userStats);

    // Auto-check and unlock eligible badges
    const stats = require('./stats');
    if (stats.checkAndUnlockBadges) {
      try {
        const newlyUnlocked = await stats.checkAndUnlockBadges(userStats);
        if (newlyUnlocked.length > 0) {
          console.log(`🎖️  Auto-unlocked ${newlyUnlocked.length} badges for user ${userId}`);
        }
      } catch (error) {
        console.error('Badge unlock error:', error);
      }
    }

    // Get badges with unlock status and progress
    const badges = await getBadgesWithProgress(userStats);

    // Build today's question for UI
    const todayQuestion = {
      id: dailyQuiz.quizId.toString(),
      questions: dailyQuiz.questions.map(q => ({
        question: q.question,
        options: q.options,
        difficulty: q.difficulty,
        category: q.category
      })),
      totalPoints: dailyQuiz.totalPoints,
      attempted: todayAttempts.length > 0,
      lastAttempt: todayAttempts[0] || null
    };

    res.json({
      success: true,
      timestamp: new Date().toISOString(),
      data: {
        newsIq,
        todayQuestion,
        todayAttempts: todayAttempts.map(a => ({
          score: a.score,
          percentage: a.percentage,
          completedAt: a.completedAt
        })),
        skillScores,
        streak: streakInfo,
        badges,
        // Philosophy quotes handled in frontend (mockIQLabAPI.js)
      }
    });

  } catch (error) {
    console.error('❌ IQ Lab state error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch IQ Lab state',
      message: error.message
    });
  }
});

/**
 * Helper: Calculate News IQ from quiz performance
 */
function calculateNewsIQ(userStats) {
  const avgScore = userStats.quizStats.averageScore || 0;
  const totalQuizzes = userStats.quizStats.totalCompleted || 0;
  const xpBonus = Math.min(Math.floor(userStats.totalXP / 100), 20);

  // News IQ = Average quiz % + XP bonus (max 20)
  return {
    score: Math.round(avgScore + xpBonus),
    xpTotal: userStats.totalXP,
    level: userStats.level,
    quizzesCompleted: totalQuizzes
  };
}

/**
 * Helper: Calculate skill scores from category performance
 */
function calculateSkillScores(userStats) {
  const catStats = userStats.quizStats.categoriesCompleted;

  // Map categories to skills
  const skillMapping = {
    factVerification: ['news', 'general'],
    biasDetection: ['politics'],
    marketAnalysis: ['business'],
    geopolitics: ['politics', 'general']
  };

  const skills = [];
  Object.entries(skillMapping).forEach(([skill, categories]) => {
    const totalAttempts = categories.reduce((sum, cat) => sum + (catStats[cat] || 0), 0);
    const score = Math.min(totalAttempts * 5, 100); // 5% per quiz, max 100%

    skills.push({
      skill,
      value: score,
      change7d: 0, // TODO: track historical changes
      sampleSize: totalAttempts
    });
  });

  return skills;
}

/**
 * Helper: Generate 30-day streak history
 */
function generateStreakHistory(userStats) {
  const dayHistory = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Check if user had quiz activity on this day
    const hasActivity = userStats.recentActivity.some(a => {
      const actDate = new Date(a.timestamp).toISOString().split('T')[0];
      return actDate === dateStr && a.type === 'quiz_completed';
    });

    dayHistory.push({
      date: dateStr,
      completed: hasActivity,
      xp: hasActivity ? 50 : 0 // Estimate XP
    });
  }

  return {
    currentStreak: userStats.streaks.current,
    bestStreak: userStats.streaks.longest,
    lastActiveDate: userStats.streaks.lastActivityDate,
    dayHistory
  };
}

/**
 * Helper: Get badges with progress
 */
async function getBadgesWithProgress(userStats) {
  try {
    // Get default badges from stats route
    const stats = require('./stats');
    const DEFAULT_BADGES = stats.DEFAULT_BADGES;

    if (!DEFAULT_BADGES) {
      console.warn('DEFAULT_BADGES not found in stats route');
      return [];
    }

    return DEFAULT_BADGES.map(badge => {
      const unlocked = userStats.badges.find(b => b.badgeId === badge.id);

      if (unlocked) {
        return {
          ...badge,
          status: 'unlocked',
          unlockedAt: unlocked.unlockedAt,
          progress: 100
        };
      }

      // Calculate progress for locked badges
      const progress = calculateBadgeProgress(badge, userStats);

      return {
        ...badge,
        status: 'locked',
        progress,
        criteria: getBadgeCriteriaText(badge, userStats)
      };
    });
  } catch (error) {
    console.error('Error getting badges:', error);
    return [];
  }
}

/**
 * Helper: Calculate badge progress percentage
 */
function calculateBadgeProgress(badge, userStats) {
  const condition = badge.unlockCondition;

  if (condition.includes('complete_1_quiz')) {
    return Math.min((userStats.quizStats.totalCompleted / 1) * 100, 100);
  }
  if (condition.includes('complete_10_quiz')) {
    return Math.min((userStats.quizStats.totalCompleted / 10) * 100, 100);
  }
  if (condition.includes('complete_50_quiz')) {
    return Math.min((userStats.quizStats.totalCompleted / 50) * 100, 100);
  }
  if (condition.includes('perfect_score_1')) {
    return Math.min((userStats.quizStats.perfectScores / 1) * 100, 100);
  }
  if (condition.includes('perfect_score_10')) {
    return Math.min((userStats.quizStats.perfectScores / 10) * 100, 100);
  }
  if (condition.includes('7_day_streak')) {
    return Math.min((userStats.streaks.current / 7) * 100, 100);
  }
  if (condition.includes('30_day_streak')) {
    return Math.min((userStats.streaks.current / 30) * 100, 100);
  }
  if (condition.includes('100_day_streak')) {
    return Math.min((userStats.streaks.current / 100) * 100, 100);
  }
  if (condition.includes('read_10_articles')) {
    return Math.min((userStats.readingStats.articlesRead / 10) * 100, 100);
  }
  if (condition.includes('read_100_articles')) {
    return Math.min((userStats.readingStats.articlesRead / 100) * 100, 100);
  }

  return 0;
}

/**
 * Helper: Get badge criteria text with current progress
 */
function getBadgeCriteriaText(badge, userStats) {
  const condition = badge.unlockCondition;

  if (condition.includes('complete_1_quiz')) {
    return `${userStats.quizStats.totalCompleted}/1 quizzes completed`;
  }
  if (condition.includes('complete_10_quiz')) {
    return `${userStats.quizStats.totalCompleted}/10 quizzes completed`;
  }
  if (condition.includes('complete_50_quiz')) {
    return `${userStats.quizStats.totalCompleted}/50 quizzes completed`;
  }
  if (condition.includes('perfect_score_1')) {
    return `${userStats.quizStats.perfectScores}/1 perfect scores`;
  }
  if (condition.includes('perfect_score_10')) {
    return `${userStats.quizStats.perfectScores}/10 perfect scores`;
  }
  if (condition.includes('7_day_streak')) {
    return `${userStats.streaks.current}/7 day streak`;
  }
  if (condition.includes('30_day_streak')) {
    return `${userStats.streaks.current}/30 day streak`;
  }
  if (condition.includes('100_day_streak')) {
    return `${userStats.streaks.current}/100 day streak`;
  }
  if (condition.includes('read_10_articles')) {
    return `${userStats.readingStats.articlesRead}/10 articles read`;
  }
  if (condition.includes('read_100_articles')) {
    return `${userStats.readingStats.articlesRead}/100 articles read`;
  }

  return badge.description;
}

module.exports = router;
