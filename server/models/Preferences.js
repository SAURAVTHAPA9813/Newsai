const mongoose = require('mongoose');

const topicPreferenceSchema = new mongoose.Schema({
  topicId: { type: String, required: true },
  // New Topic Matrix fields
  priorityOverride: { type: Number, default: 50, min: 0, max: 100 },
  firewallStatus: {
    type: String,
    enum: ['ALLOWED', 'LIMITED', 'BLOCKED'],
    default: 'ALLOWED'
  },
  feedPreferences: {
    showMore: { type: Boolean, default: false },
    onlyHighCredibility: { type: Boolean, default: false },
    includeExplainers: { type: Boolean, default: false }
  },
  // Legacy fields (kept for backward compatibility)
  priority: { type: Number, default: 5, min: 0, max: 10 },
  keywords: [String],
  blockedKeywords: [String],
  notificationEnabled: { type: Boolean, default: true },
  frequencyPreference: {
    type: String,
    enum: ['high', 'medium', 'low'],
    default: 'medium'
  }
}, { _id: false });

const preferencesSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true
    },

    // Context Profile (for Topic Matrix)
    contextProfile: {
      industry: {
        type: String,
        default: 'Software Engineering',
      },
      region: {
        type: String,
        default: 'United States',
      },
      lifeStage: {
        type: String,
        default: 'Career Professional'
      },
      interests: [{
        type: String,
      }],
      expertise: [String]
    },

    // Legacy field (kept for compatibility)
    lifeImpactProfile: {
      industry: {
        type: String,
        default: 'Software Engineering',
      },
      region: {
        type: String,
        default: 'United States',
      },
      interests: [{
        type: String,
      }],
    },

    // Firewall Settings (for Topic Matrix)
    firewallSettings: {
      anxietyFilter: {
        enabled: { type: Boolean, default: true },
        threshold: { type: Number, default: 70, min: 0, max: 100 }
      },
      contentWarnings: {
        enabled: { type: Boolean, default: true },
        categories: {
          type: [String],
          default: ['violence', 'disturbing', 'graphic']
        }
      },
      blockedSources: [String],
      blockedTopics: [String],
      blockedKeywords: [String], // Added for feed filtering
      sensationalismFilter: {
        enabled: { type: Boolean, default: true },
        aggressiveness: {
          type: String,
          enum: ['low', 'medium', 'high'],
          default: 'medium'
        }
      }
    },

    // Legacy noise suppression (kept for compatibility)
    noiseSuppression: {
      celebrityGossip: {
        type: Boolean,
        default: true,
      },
      sports: {
        type: Boolean,
        default: false,
      },
      politicalOpinions: {
        type: Boolean,
        default: false,
      },
    },

    // AI Policy (for Topic Matrix)
    aiPolicy: {
      tone: {
        type: String,
        enum: ['neutral', 'analytical', 'conversational', 'formal'],
        default: 'neutral'
      },
      depth: {
        type: String,
        enum: ['brief', 'standard', 'detailed'],
        default: 'standard'
      },
      perspective: {
        type: String,
        enum: ['balanced', 'critical', 'optimistic'],
        default: 'balanced'
      },
      summaryStyle: {
        type: String,
        enum: ['bullets', 'paragraph', 'mixed'],
        default: 'mixed'
      },
      includeContext: { type: Boolean, default: true },
      includeImplications: { type: Boolean, default: true }
    },

    // Topic Preferences (for Topic Matrix)
    topicPreferences: [topicPreferenceSchema],

    // Legacy vector management (kept for compatibility)
    vectorManagement: [
      {
        topic: String,
        priority: {
          type: String,
          enum: ['HIGH', 'MEDIUM', 'LOW'],
          default: 'MEDIUM',
        },
        enabled: {
          type: Boolean,
          default: true,
        },
      },
    ],
    notificationSettings: {
      breakingNews: {
        type: Boolean,
        default: true,
      },
      dailyDigest: {
        type: Boolean,
        default: true,
      },
      digestTime: {
        type: String,
        default: '08:00',
      },
      weeklyReport: {
        type: Boolean,
        default: true,
      },
    },
    readingPreferences: {
      defaultReadingMode: {
        type: String,
        enum: ['5m', '15m', '30m'],
        default: '15m',
      },
      preferredCategories: [{
        type: String,
      }],
      excludedSources: [{
        type: String,
      }],
      autoPlayArticles: { type: Boolean, default: false },
      focusModeDefault: { type: Boolean, default: false }
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
preferencesSchema.index({ user: 1 });
preferencesSchema.index({ 'topicPreferences.topicId': 1 });

module.exports = mongoose.model('Preferences', preferencesSchema);
