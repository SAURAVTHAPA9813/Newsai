const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { Badge, UserStats } = require('../models/UserStats');

// Default badges definition
const DEFAULT_BADGES = [
  // Quiz Badges
  {
    id: 'first_quiz',
    name: 'Getting Started',
    description: 'Complete your first quiz',
    icon: 'FiTarget',
    category: 'quiz',
    tier: 'bronze',
    xpReward: 25,
    unlockCondition: 'complete_1_quiz'
  },
  {
    id: 'quiz_master_10',
    name: 'Quiz Enthusiast',
    description: 'Complete 10 quizzes',
    icon: 'FiBook',
    category: 'quiz',
    tier: 'silver',
    xpReward: 50,
    unlockCondition: 'complete_10_quizzes'
  },
  {
    id: 'quiz_master_50',
    name: 'Quiz Master',
    description: 'Complete 50 quizzes',
    icon: 'FiAward',
    category: 'quiz',
    tier: 'gold',
    xpReward: 100,
    unlockCondition: 'complete_50_quizzes'
  },
  {
    id: 'perfect_score',
    name: 'Perfectionist',
    description: 'Get a perfect score on any quiz',
    icon: 'FiCheckCircle',
    category: 'quiz',
    tier: 'gold',
    xpReward: 75,
    unlockCondition: 'perfect_score_1'
  },
  {
    id: 'perfect_score_10',
    name: 'Flawless Victory',
    description: 'Get 10 perfect scores',
    icon: 'FiStar',
    category: 'quiz',
    tier: 'platinum',
    xpReward: 150,
    unlockCondition: 'perfect_score_10'
  },

  // Streak Badges
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'FiZap',
    category: 'streak',
    tier: 'silver',
    xpReward: 50,
    unlockCondition: '7_day_streak'
  },
  {
    id: 'streak_30',
    name: 'Monthly Champion',
    description: 'Maintain a 30-day streak',
    icon: 'FiZap',
    category: 'streak',
    tier: 'gold',
    xpReward: 150,
    unlockCondition: '30_day_streak'
  },
  {
    id: 'streak_100',
    name: 'Centurion',
    description: 'Maintain a 100-day streak',
    icon: 'FiStar',
    category: 'streak',
    tier: 'diamond',
    xpReward: 500,
    unlockCondition: '100_day_streak'
  },

  // Reading Badges
  {
    id: 'reader_10',
    name: 'Curious Reader',
    description: 'Read 10 articles',
    icon: 'FiBook',
    category: 'reading',
    tier: 'bronze',
    xpReward: 25,
    unlockCondition: 'read_10_articles'
  },
  {
    id: 'reader_100',
    name: 'Avid Reader',
    description: 'Read 100 articles',
    icon: 'FiBook',
    category: 'reading',
    tier: 'silver',
    xpReward: 75,
    unlockCondition: 'read_100_articles'
  },

  // Expertise Badges
  {
    id: 'tech_expert',
    name: 'Tech Savvy',
    description: 'Complete 20 technology quizzes',
    icon: 'FiMonitor',
    category: 'expertise',
    tier: 'gold',
    xpReward: 100,
    unlockCondition: 'category_tech_20'
  },
  {
    id: 'science_expert',
    name: 'Science Guru',
    description: 'Complete 20 science quizzes',
    icon: 'FiActivity',
    category: 'expertise',
    tier: 'gold',
    xpReward: 100,
    unlockCondition: 'category_science_20'
  }
];

// @desc    Get user stats and badges
// @route   GET /api/stats
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    let userStats = await UserStats.findOne({ user: req.user._id });

    if (!userStats) {
      userStats = new UserStats({ user: req.user._id });
      await userStats.save();
    }

    res.json({
      success: true,
      data: {
        level: userStats.level,
        totalXP: userStats.totalXP,
        quizStats: userStats.quizStats,
        streaks: userStats.streaks,
        readingStats: userStats.readingStats,
        badges: userStats.badges,
        recentActivity: userStats.recentActivity.slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stats'
    });
  }
});

// @desc    Get all available badges
// @route   GET /api/stats/badges
// @access  Private
router.get('/badges', protect, async (req, res) => {
  try {
    const userStats = await UserStats.findOne({ user: req.user._id });
    const unlockedBadgeIds = userStats ? userStats.badges.map(b => b.badgeId) : [];

    const badges = DEFAULT_BADGES.map(badge => ({
      ...badge,
      unlocked: unlockedBadgeIds.includes(badge.id),
      unlockedAt: userStats?.badges.find(b => b.badgeId === badge.id)?.unlockedAt
    }));

    res.json({
      success: true,
      data: badges
    });
  } catch (error) {
    console.error('Get badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching badges'
    });
  }
});

// @desc    Check and unlock badges
// @route   POST /api/stats/check-badges
// @access  Private
router.post('/check-badges', protect, async (req, res) => {
  try {
    const userStats = await UserStats.findOne({ user: req.user._id });

    if (!userStats) {
      return res.json({
        success: true,
        data: { newBadges: [] }
      });
    }

    const newBadges = [];

    // Check each badge condition
    for (const badgeDef of DEFAULT_BADGES) {
      // Skip if already unlocked
      if (userStats.badges.some(b => b.badgeId === badgeDef.id)) {
        continue;
      }

      let shouldUnlock = false;

      // Check unlock conditions
      switch (badgeDef.unlockCondition) {
        case 'complete_1_quiz':
          shouldUnlock = userStats.quizStats.totalCompleted >= 1;
          break;
        case 'complete_10_quizzes':
          shouldUnlock = userStats.quizStats.totalCompleted >= 10;
          break;
        case 'complete_50_quizzes':
          shouldUnlock = userStats.quizStats.totalCompleted >= 50;
          break;
        case 'perfect_score_1':
          shouldUnlock = userStats.quizStats.perfectScores >= 1;
          break;
        case 'perfect_score_10':
          shouldUnlock = userStats.quizStats.perfectScores >= 10;
          break;
        case '7_day_streak':
          shouldUnlock = userStats.streaks.longest >= 7;
          break;
        case '30_day_streak':
          shouldUnlock = userStats.streaks.longest >= 30;
          break;
        case '100_day_streak':
          shouldUnlock = userStats.streaks.longest >= 100;
          break;
        case 'read_10_articles':
          shouldUnlock = userStats.readingStats.articlesRead >= 10;
          break;
        case 'read_100_articles':
          shouldUnlock = userStats.readingStats.articlesRead >= 100;
          break;
        case 'category_tech_20':
          shouldUnlock = userStats.quizStats.categoriesCompleted.technology >= 20;
          break;
        case 'category_science_20':
          shouldUnlock = userStats.quizStats.categoriesCompleted.science >= 20;
          break;
      }

      if (shouldUnlock) {
        const result = userStats.unlockBadge(badgeDef);
        if (result.unlocked) {
          newBadges.push({
            ...badgeDef,
            unlockedAt: new Date()
          });
        }
      }
    }

    if (newBadges.length > 0) {
      await userStats.save();
    }

    res.json({
      success: true,
      data: {
        newBadges,
        totalXP: userStats.totalXP,
        level: userStats.level
      }
    });
  } catch (error) {
    console.error('Check badges error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking badges'
    });
  }
});

// @desc    Get leaderboard
// @route   GET /api/stats/leaderboard
// @access  Private
router.get('/leaderboard', protect, async (req, res) => {
  try {
    const { type = 'xp', limit = 10 } = req.query;

    let sortField;
    switch (type) {
      case 'xp':
        sortField = { totalXP: -1 };
        break;
      case 'quizzes':
        sortField = { 'quizStats.totalCompleted': -1 };
        break;
      case 'streak':
        sortField = { 'streaks.longest': -1 };
        break;
      default:
        sortField = { totalXP: -1 };
    }

    const topUsers = await UserStats.find()
      .populate('user', 'name email')
      .sort(sortField)
      .limit(parseInt(limit));

    res.json({
      success: true,
      data: topUsers.map((stat, index) => ({
        rank: index + 1,
        user: {
          name: stat.user.name,
          email: stat.user.email
        },
        level: stat.level,
        totalXP: stat.totalXP,
        quizzesCompleted: stat.quizStats.totalCompleted,
        longestStreak: stat.streaks.longest,
        badgesCount: stat.badges.length
      }))
    });
  } catch (error) {
    console.error('Get leaderboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching leaderboard'
    });
  }
});

// @desc    Get reading summary for today
// @route   GET /api/stats/reading-summary
// @access  Private
router.get('/reading-summary', protect, async (req, res) => {
  try {
    const userStats = await UserStats.findOne({ user: req.user._id });

    if (!userStats) {
      return res.json({
        success: true,
        data: {
          articlesReadToday: 0,
          timeSpentToday: 0,
          xpGainedToday: 0,
          currentStreak: 0
        }
      });
    }

    // Calculate today's stats from recent activity
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayActivities = userStats.recentActivity.filter(activity => {
      const activityDate = new Date(activity.timestamp);
      activityDate.setHours(0, 0, 0, 0);
      return activityDate.getTime() === today.getTime();
    });

    // Calculate articles read today (from reading stats or activity)
    const articlesReadToday = todayActivities.filter(a =>
      a.type === 'article_read' || a.type === 'reading'
    ).length;

    // Estimate time spent (avg 2 minutes per article)
    const timeSpentToday = articlesReadToday * 2;

    // Calculate XP gained today from activities
    const xpGainedToday = todayActivities.reduce((sum, activity) =>
      sum + (activity.xpGained || 0), 0
    );

    res.json({
      success: true,
      data: {
        articlesReadToday,
        timeSpentToday,
        xpGainedToday,
        currentStreak: userStats.streaks.current,
        totalArticlesRead: userStats.readingStats.articlesRead,
        level: userStats.level,
        totalXP: userStats.totalXP
      }
    });
  } catch (error) {
    console.error('Get reading summary error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching reading summary'
    });
  }
});

module.exports = router;
