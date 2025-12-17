const mongoose = require('mongoose');

const readingSessionSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },

  // Session timing
  startedAt: {
    type: Date,
    required: true
  },
  endedAt: {
    type: Date,
    required: true
  },
  durationMinutes: {
    type: Number,
    required: true,
    min: 0
  },

  // Device info
  device: {
    type: String,
    enum: ['mobile', 'tablet', 'desktop', 'unknown'],
    default: 'unknown'
  },

  // Content info (denormalized for fast aggregation)
  topic: {
    id: String,
    name: String,
    category: String
  },
  source: {
    id: String,
    name: String,
    tier: {
      type: String,
      enum: ['premium', 'standard', 'basic', 'unknown'],
      default: 'unknown'
    }
  },

  // Reading preferences
  readingMode: {
    type: String,
    enum: ['skim', 'standard', 'deep_dive', 'intentional'],
    default: 'standard'
  },
  wordCount: {
    type: Number,
    min: 0
  },

  // Mood & wellness tracking
  moodTag: {
    type: String,
    enum: ['calm', 'focused', 'curious', 'anxious', 'overwhelmed', 'inspired', 'neutral'],
    default: 'neutral'
  },
  selfReportedAnxiety: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },

  // Engagement tracking
  engagementEvents: [{
    eventType: {
      type: String,
      enum: ['scroll', 'highlight', 'share', 'save', 'verify', 'decompress', 'explain', 'perspectives'],
      required: true
    },
    timestamp: {
      type: Date,
      required: true
    },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Article metadata
  articleId: {
    type: String,
    index: true
  },
  articleTitle: String,
  articleUrl: String,

  // Computed metrics
  verifyUsed: {
    type: Boolean,
    default: false
  },
  aiToolsUsed: [{
    type: String,
    enum: ['verify', 'decompress', 'explain', 'perspectives', 'summary']
  }],

  // Session quality indicators
  completionRate: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  focusScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  }
}, {
  timestamps: true
});

// Indexes for common queries
readingSessionSchema.index({ user: 1, startedAt: -1 });
readingSessionSchema.index({ user: 1, 'topic.id': 1 });
readingSessionSchema.index({ user: 1, 'source.tier': 1 });
readingSessionSchema.index({ user: 1, readingMode: 1 });
readingSessionSchema.index({ createdAt: -1 });

// Virtual for reading speed (words per minute)
readingSessionSchema.virtual('wordsPerMinute').get(function() {
  if (this.wordCount && this.durationMinutes > 0) {
    return Math.round(this.wordCount / this.durationMinutes);
  }
  return 0;
});

// Pre-save hook to compute derived fields
readingSessionSchema.pre('save', function(next) {
  // Check if verify was used
  this.verifyUsed = this.engagementEvents.some(e => e.eventType === 'verify');

  // Extract AI tools used
  const aiTools = new Set();
  this.engagementEvents.forEach(e => {
    if (['verify', 'decompress', 'explain', 'perspectives'].includes(e.eventType)) {
      aiTools.add(e.eventType);
    }
  });
  this.aiToolsUsed = Array.from(aiTools);

  // Calculate focus score based on engagement
  if (this.durationMinutes > 0) {
    const engagementRate = this.engagementEvents.length / this.durationMinutes;
    // Higher engagement = higher focus, cap at 100
    this.focusScore = Math.min(100, Math.round(50 + engagementRate * 25));
  }

  next();
});

module.exports = mongoose.model('ReadingSession', readingSessionSchema);
