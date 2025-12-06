const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    readingStats: {
      articlesRead: {
        type: Number,
        default: 0,
      },
      totalReadingTime: {
        type: Number, // in minutes
        default: 0,
      },
      averageArticleLength: {
        type: Number, // in minutes
        default: 0,
      },
      categoriesRead: [
        {
          category: String,
          count: Number,
        },
      ],
    },
    wellnessMetrics: {
      cognitiveLoad: {
        type: Number,
        min: 0,
        max: 100,
        default: 50,
      },
      doomScrollRisk: {
        type: String,
        enum: ['LOW', 'MEDIUM', 'HIGH'],
        default: 'LOW',
      },
      dailyGoalProgress: {
        type: Number, // percentage
        min: 0,
        max: 100,
        default: 0,
      },
    },
    preferences: {
      preferredReadingTime: String, // e.g., "Morning (8-10 AM)"
      mostActiveDay: String, // e.g., "Saturday"
      topSources: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Analytics', analyticsSchema);
