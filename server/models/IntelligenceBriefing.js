const mongoose = require('mongoose');

/**
 * Intelligence Briefing Model
 * Stores AI-generated briefings that update twice daily (8 AM and 8 PM)
 */
const intelligenceBriefingSchema = new mongoose.Schema({
  // Generation metadata
  generatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },
  generationTime: {
    type: String,
    enum: ['morning', 'evening'], // 8 AM = morning, 8 PM = evening
    required: true
  },
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    index: true
  },

  // User personalization (null = global briefing for all users)
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },

  // Global Mode Content
  global: {
    globalSituation: String,
    globalDelta: String,
    impactOnYou: {
      industry: String,
      region: String,
      summary: String,
      keyPoints: [String]
    }
  },

  // Markets Mode Content
  markets: {
    globalSituation: String,
    globalDelta: String,
    impactOnYou: {
      industry: String,
      region: String,
      summary: String,
      keyPoints: [String]
    }
  },

  // Tech Mode Content
  tech: {
    globalSituation: String,
    globalDelta: String,
    impactOnYou: {
      industry: String,
      region: String,
      summary: String,
      keyPoints: [String]
    }
  },

  // My Life Mode Content (personalized)
  myLife: {
    globalSituation: String,
    globalDelta: String,
    impactOnYou: {
      industry: String,
      region: String,
      summary: String,
      keyPoints: [String]
    }
  },

  // Trending topics extracted from headlines
  trendingTopics: [{
    name: String,
    category: String,
    mentions: Number
  }],

  // Source headlines used for generation
  sourceHeadlines: [{
    title: String,
    source: String,
    category: String,
    publishedAt: Date
  }],

  // API usage tracking
  geminiTokensUsed: {
    type: Number,
    default: 0
  },

  // Status
  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'generating'
  },
  error: String

}, {
  timestamps: true
});

// Index for quick retrieval of latest briefing
intelligenceBriefingSchema.index({ date: -1, generationTime: -1 });
intelligenceBriefingSchema.index({ userId: 1, date: -1 });

// Static method to get current active briefing
intelligenceBriefingSchema.statics.getCurrentBriefing = async function(userId = null) {
  const now = new Date();
  const hour = now.getHours();

  const today = now.toISOString().split('T')[0];
  const yesterday = new Date(now - 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // If it's before 8 AM, show yesterday's briefing
  const targetDate = hour < 8 ? yesterday : today;

  // Find today's briefing (all briefings are 'morning' now since we only generate once daily)
  const briefing = await this.findOne({
    userId: userId,
    date: targetDate,
    generationTime: 'morning',
    status: 'completed'
  }).sort({ generatedAt: -1 });

  // If no briefing for target date, try the most recent one
  if (!briefing) {
    return await this.findOne({
      userId: userId,
      status: 'completed'
    }).sort({ generatedAt: -1 });
  }

  return briefing;
};

// Static method to check if briefing needs generation
intelligenceBriefingSchema.statics.needsGeneration = async function(userId = null) {
  const now = new Date();
  const hour = now.getHours();
  const today = now.toISOString().split('T')[0];

  // Only generate if it's past 8 AM and no briefing exists for today
  if (hour < 8) {
    return false; // Too early, use yesterday's briefing
  }

  // Check if today's briefing exists
  const existing = await this.findOne({
    userId: userId,
    date: today,
    generationTime: 'morning',
    status: { $in: ['completed', 'generating'] }
  });

  return !existing; // Generate if doesn't exist
};

module.exports = mongoose.model('IntelligenceBriefing', intelligenceBriefingSchema);
