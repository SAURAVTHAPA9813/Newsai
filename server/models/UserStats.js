const mongoose = require("mongoose");

// Badge Schema - Achievement definitions and user unlocks
const badgeSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    category: {
      type: String,
      enum: ["quiz", "streak", "reading", "expertise", "special"],
      default: "quiz",
    },
    tier: {
      type: String,
      enum: ["bronze", "silver", "gold", "platinum", "diamond"],
      default: "bronze",
    },
    xpReward: { type: Number, default: 50 },
    unlockCondition: {
      type: String, // e.g., "complete_10_quizzes", "7_day_streak", "90_percent_score"
      required: true,
    },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// User Stats Schema - Tracks user progress, XP, streaks, badges
const userStatsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    // Experience Points
    totalXP: { type: Number, default: 0 },
    level: { type: Number, default: 1 },

    // Quiz Stats
    quizStats: {
      totalCompleted: { type: Number, default: 0 },
      totalCorrect: { type: Number, default: 0 },
      totalQuestions: { type: Number, default: 0 },
      averageScore: { type: Number, default: 0 },
      highestScore: { type: Number, default: 0 },
      perfectScores: { type: Number, default: 0 },
      categoriesCompleted: {
        news: { type: Number, default: 0 },
        politics: { type: Number, default: 0 },
        technology: { type: Number, default: 0 },
        science: { type: Number, default: 0 },
        business: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        entertainment: { type: Number, default: 0 },
        general: { type: Number, default: 0 },
      },
    },

    // Streak Tracking
    streaks: {
      current: { type: Number, default: 0 },
      longest: { type: Number, default: 0 },
      lastActivityDate: { type: Date, default: Date.now },
      dailyGoalMet: { type: Boolean, default: false },
    },

    // Reading Stats
    readingStats: {
      articlesRead: { type: Number, default: 0 },
      articlesSaved: { type: Number, default: 0 },
      timeSpentReading: { type: Number, default: 0 }, // in minutes
      categoriesRead: {
        news: { type: Number, default: 0 },
        politics: { type: Number, default: 0 },
        technology: { type: Number, default: 0 },
        science: { type: Number, default: 0 },
        business: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        entertainment: { type: Number, default: 0 },
      },
    },

    // Topic Measuring - tracks user interest levels
    topicMeasuring: {
      // Interest scores by category (0-100)
      interests: {
        news: { type: Number, default: 0 },
        politics: { type: Number, default: 0 },
        technology: { type: Number, default: 0 },
        science: { type: Number, default: 0 },
        business: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        entertainment: { type: Number, default: 0 },
        health: { type: Number, default: 0 },
        finance: { type: Number, default: 0 },
        environment: { type: Number, default: 0 },
      },
      // Click counts for measuring
      clickCounts: {
        news: { type: Number, default: 0 },
        politics: { type: Number, default: 0 },
        technology: { type: Number, default: 0 },
        science: { type: Number, default: 0 },
        business: { type: Number, default: 0 },
        sports: { type: Number, default: 0 },
        entertainment: { type: Number, default: 0 },
        health: { type: Number, default: 0 },
        finance: { type: Number, default: 0 },
        environment: { type: Number, default: 0 },
      },
      // Last updated timestamp
      lastUpdated: { type: Date, default: Date.now },
    },

    // Activity Stats
    activityStats: {
      totalTimeSpent: { type: Number, default: 0 }, // in minutes, total platform time
      pageVisits: {
        dashboard: { type: Number, default: 0 },
        trending: { type: Number, default: 0 },
        neural_analytics: { type: Number, default: 0 },
        topic_matrix: { type: Number, default: 0 },
        verify_hub: { type: Number, default: 0 },
        iqlab: { type: Number, default: 0 },
      },
      lastActivityDate: { type: Date, default: Date.now },
    },

    // Unlocked Badges
    badges: [
      {
        badgeId: { type: String, required: true },
        unlockedAt: { type: Date, default: Date.now },
        name: String,
        icon: String,
        tier: String,
      },
    ],

    // Recent Activity
    recentActivity: [
      {
        type: {
          type: String,
          enum: [
            "quiz_completed",
            "badge_unlocked",
            "level_up",
            "streak_milestone",
            "article_read",
          ],
          required: true,
        },
        description: String,
        xpEarned: { type: Number, default: 0 },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Calculate level based on XP
userStatsSchema.methods.calculateLevel = function () {
  // Level formula: Level = floor(sqrt(XP / 100))
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP
  // Level 4: 900-1599 XP
  // etc.
  return Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
};

// Add XP and check for level up
userStatsSchema.methods.addXP = function (xp) {
  const oldLevel = this.level;
  this.totalXP += xp;
  this.level = this.calculateLevel();

  const leveledUp = this.level > oldLevel;

  if (leveledUp) {
    this.recentActivity.unshift({
      type: "level_up",
      description: `Reached Level ${this.level}!`,
      xpEarned: 0,
      timestamp: new Date(),
    });
  }

  return { leveledUp, newLevel: this.level, totalXP: this.totalXP };
};

// Update streak
userStatsSchema.methods.updateStreak = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const lastActivity = new Date(this.streaks.lastActivityDate);
  lastActivity.setHours(0, 0, 0, 0);

  const daysDiff = Math.floor((today - lastActivity) / (1000 * 60 * 60 * 24));

  if (daysDiff === 0) {
    // Same day - no change to streak
    return { streakContinued: true, current: this.streaks.current };
  } else if (daysDiff === 1) {
    // Consecutive day - increment streak
    this.streaks.current += 1;
    this.streaks.lastActivityDate = today;

    if (this.streaks.current > this.streaks.longest) {
      this.streaks.longest = this.streaks.current;
    }

    return { streakContinued: true, current: this.streaks.current };
  } else {
    // Streak broken - reset to 1
    this.streaks.current = 1;
    this.streaks.lastActivityDate = today;

    return { streakContinued: false, current: this.streaks.current };
  }
};

// Unlock badge
userStatsSchema.methods.unlockBadge = function (badge) {
  // Check if already unlocked
  const alreadyUnlocked = this.badges.some((b) => b.badgeId === badge.id);

  if (alreadyUnlocked) {
    return { unlocked: false, message: "Badge already unlocked" };
  }

  this.badges.push({
    badgeId: badge.id,
    name: badge.name,
    icon: badge.icon,
    tier: badge.tier,
    unlockedAt: new Date(),
  });

  this.recentActivity.unshift({
    type: "badge_unlocked",
    description: `Unlocked: ${badge.name}`,
    xpEarned: badge.xpReward,
    timestamp: new Date(),
  });

  this.addXP(badge.xpReward);

  return { unlocked: true, badge: badge.name, xpEarned: badge.xpReward };
};

// Update topic measuring based on clicks
userStatsSchema.methods.updateTopicMeasuring = function (
  category,
  increment = 1
) {
  if (this.topicMeasuring.interests.hasOwnProperty(category)) {
    // Increment click count
    this.topicMeasuring.clickCounts[category] += increment;

    // Update interest score (simple algorithm: score increases with clicks, max 100)
    const clicks = this.topicMeasuring.clickCounts[category];
    const newScore = Math.min(
      100,
      Math.round(clicks * 2 + Math.sqrt(clicks) * 5)
    );
    this.topicMeasuring.interests[category] = newScore;

    this.topicMeasuring.lastUpdated = new Date();
  }
};

// Update activity stats
userStatsSchema.methods.updateActivityStats = function (
  page,
  timeSpentMinutes = 0
) {
  if (this.activityStats.pageVisits.hasOwnProperty(page)) {
    this.activityStats.pageVisits[page] += 1;
  }
  this.activityStats.totalTimeSpent += timeSpentMinutes;
  this.activityStats.lastActivityDate = new Date();
};

// Update topic measuring from activity data with weighted scoring
userStatsSchema.methods.updateFromActivities = function (activityData) {
  /**
   * Update topic interests based on comprehensive activity data
   * @param {Object} activityData - Activity analytics from activityAggregationService
   * @param {Object} activityData.breakdown - Page and topic breakdown
   * @param {Array} activityData.breakdown.byTopic - Topic interest scores
   * @param {Array} activityData.breakdown.byPage - Page activity breakdown
   *
   * Algorithm:
   * - Weighted scoring: 40% time, 30% clicks, 20% saves, 10% sessions
   * - Decay factor: Old scores decay by 10% each update
   * - Momentum scoring: 70% old score + 30% new signal
   * - Normalization: Scores kept in 0-100 range
   */

  if (!activityData || !activityData.breakdown) {
    return;
  }

  const topicInterests = activityData.breakdown.byTopic || [];
  const pageBreakdown = activityData.breakdown.byPage || [];

  // Map topic names to category keys
  const topicToCategoryMap = {
    'general': 'news',
    'trending': 'news',
    'analytics': 'technology',
    'topics': 'news',
    'verification': 'news',
    'learning': 'science',
    'finance': 'finance',
    'business': 'business',
    'technology': 'technology',
    'tech': 'technology',
    'health': 'health',
    'politics': 'politics',
    'sports': 'sports',
    'entertainment': 'entertainment',
    'science': 'science',
    'environment': 'environment'
  };

  // Apply decay factor (10%) to all existing interest scores
  Object.keys(this.topicMeasuring.interests).forEach(category => {
    this.topicMeasuring.interests[category] = Math.round(
      this.topicMeasuring.interests[category] * 0.9
    );
  });

  // Update from topic interest scores
  topicInterests.forEach(({ topic, score, interactions }) => {
    const category = topicToCategoryMap[topic.toLowerCase()] || 'news';

    if (this.topicMeasuring.interests.hasOwnProperty(category)) {
      // Get current score
      const oldScore = this.topicMeasuring.interests[category];

      // Calculate new score with momentum: 70% old + 30% new
      const newScore = Math.round(oldScore * 0.7 + score * 0.3);

      // Ensure score stays in 0-100 range
      this.topicMeasuring.interests[category] = Math.min(100, Math.max(0, newScore));

      // Update click counts
      if (interactions && interactions.clicks) {
        this.topicMeasuring.clickCounts[category] += interactions.clicks;
      }
    }
  });

  // Update from page breakdown (map pages to categories)
  pageBreakdown.forEach(({ page, timeSpent, actions }) => {
    const category = topicToCategoryMap[page] || 'news';

    if (this.topicMeasuring.interests.hasOwnProperty(category)) {
      // Time-based score boost (each minute = 0.5 points, max +10 per update)
      const timeBoost = Math.min(10, Math.round(timeSpent * 0.5));

      // Action-based score boost (each action = 0.2 points, max +5 per update)
      const actionBoost = Math.min(5, Math.round(actions * 0.2));

      // Apply boosts to current score
      const currentScore = this.topicMeasuring.interests[category];
      const boostedScore = currentScore + timeBoost + actionBoost;

      this.topicMeasuring.interests[category] = Math.min(100, boostedScore);
    }
  });

  // Normalize all scores to ensure at least one category has a decent score
  const maxScore = Math.max(...Object.values(this.topicMeasuring.interests));

  if (maxScore > 0 && maxScore < 20) {
    // If all scores are very low, boost them proportionally
    const boostFactor = 20 / maxScore;
    Object.keys(this.topicMeasuring.interests).forEach(category => {
      if (this.topicMeasuring.interests[category] > 0) {
        this.topicMeasuring.interests[category] = Math.min(
          100,
          Math.round(this.topicMeasuring.interests[category] * boostFactor)
        );
      }
    });
  }

  this.topicMeasuring.lastUpdated = new Date();
};

// Indexes
userStatsSchema.index({ user: 1 });
userStatsSchema.index({ totalXP: -1 });
userStatsSchema.index({ level: -1 });
userStatsSchema.index({ "streaks.current": -1 });

const Badge = mongoose.model("Badge", badgeSchema);
const UserStats = mongoose.model("UserStats", userStatsSchema);

module.exports = { Badge, UserStats };
