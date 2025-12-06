const mongoose = require('mongoose');

// Badge Schema - Achievement definitions and user unlocks
const badgeSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: String, required: true },
  category: {
    type: String,
    enum: ['quiz', 'streak', 'reading', 'expertise', 'special'],
    default: 'quiz'
  },
  tier: {
    type: String,
    enum: ['bronze', 'silver', 'gold', 'platinum', 'diamond'],
    default: 'bronze'
  },
  xpReward: { type: Number, default: 50 },
  unlockCondition: {
    type: String, // e.g., "complete_10_quizzes", "7_day_streak", "90_percent_score"
    required: true
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// User Stats Schema - Tracks user progress, XP, streaks, badges
const userStatsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true
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
      general: { type: Number, default: 0 }
    }
  },

  // Streak Tracking
  streaks: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastActivityDate: { type: Date, default: Date.now },
    dailyGoalMet: { type: Boolean, default: false }
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
      entertainment: { type: Number, default: 0 }
    }
  },

  // Unlocked Badges
  badges: [{
    badgeId: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now },
    name: String,
    icon: String,
    tier: String
  }],

  // Recent Activity
  recentActivity: [{
    type: {
      type: String,
      enum: ['quiz_completed', 'badge_unlocked', 'level_up', 'streak_milestone', 'article_read'],
      required: true
    },
    description: String,
    xpEarned: { type: Number, default: 0 },
    timestamp: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Calculate level based on XP
userStatsSchema.methods.calculateLevel = function() {
  // Level formula: Level = floor(sqrt(XP / 100))
  // Level 1: 0-99 XP
  // Level 2: 100-399 XP
  // Level 3: 400-899 XP
  // Level 4: 900-1599 XP
  // etc.
  return Math.floor(Math.sqrt(this.totalXP / 100)) + 1;
};

// Add XP and check for level up
userStatsSchema.methods.addXP = function(xp) {
  const oldLevel = this.level;
  this.totalXP += xp;
  this.level = this.calculateLevel();

  const leveledUp = this.level > oldLevel;

  if (leveledUp) {
    this.recentActivity.unshift({
      type: 'level_up',
      description: `Reached Level ${this.level}!`,
      xpEarned: 0,
      timestamp: new Date()
    });
  }

  return { leveledUp, newLevel: this.level, totalXP: this.totalXP };
};

// Update streak
userStatsSchema.methods.updateStreak = function() {
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
userStatsSchema.methods.unlockBadge = function(badge) {
  // Check if already unlocked
  const alreadyUnlocked = this.badges.some(b => b.badgeId === badge.id);

  if (alreadyUnlocked) {
    return { unlocked: false, message: 'Badge already unlocked' };
  }

  this.badges.push({
    badgeId: badge.id,
    name: badge.name,
    icon: badge.icon,
    tier: badge.tier,
    unlockedAt: new Date()
  });

  this.recentActivity.unshift({
    type: 'badge_unlocked',
    description: `Unlocked: ${badge.name}`,
    xpEarned: badge.xpReward,
    timestamp: new Date()
  });

  this.addXP(badge.xpReward);

  return { unlocked: true, badge: badge.name, xpEarned: badge.xpReward };
};

// Indexes
userStatsSchema.index({ user: 1 });
userStatsSchema.index({ totalXP: -1 });
userStatsSchema.index({ level: -1 });
userStatsSchema.index({ 'streaks.current': -1 });

const Badge = mongoose.model('Badge', badgeSchema);
const UserStats = mongoose.model('UserStats', userStatsSchema);

module.exports = { Badge, UserStats };
