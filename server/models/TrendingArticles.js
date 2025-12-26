const mongoose = require('mongoose');

/**
 * Trending Articles Cache Model
 * Stores daily trending articles from all categories
 * Regenerates once per day at 8 AM to maximize API usage
 */
const trendingArticlesSchema = new mongoose.Schema({
  // Generation metadata
  date: {
    type: String, // Format: YYYY-MM-DD
    required: true,
    unique: true,
    index: true
  },
  generatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  // Articles organized by category
  articles: {
    all: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }],
    tech: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }],
    business: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }],
    sports: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }],
    health: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }],
    politics: [{
      title: String,
      description: String,
      url: String,
      imageUrl: String,
      source: {
        id: String,
        name: String
      },
      category: String,
      publishedAt: Date,
      author: String,
      content: String
    }]
  },

  // Metadata
  totalArticles: {
    type: Number,
    default: 0
  },
  categoryCounts: {
    all: { type: Number, default: 0 },
    tech: { type: Number, default: 0 },
    business: { type: Number, default: 0 },
    sports: { type: Number, default: 0 },
    health: { type: Number, default: 0 },
    politics: { type: Number, default: 0 }
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

// Static method to get today's trending articles
trendingArticlesSchema.statics.getTodayArticles = async function() {
  const today = new Date().toISOString().split('T')[0];

  return await this.findOne({
    date: today,
    status: 'completed'
  });
};

// Static method to check if generation is needed
trendingArticlesSchema.statics.needsGeneration = async function() {
  const now = new Date();
  const hour = now.getHours();
  const today = now.toISOString().split('T')[0];

  // Only generate if it's past 8 AM and no cache exists for today
  if (hour < 8) {
    return false; // Too early, use yesterday's cache
  }

  const existing = await this.findOne({
    date: today,
    status: { $in: ['completed', 'generating'] }
  });

  return !existing; // Generate if doesn't exist
};

module.exports = mongoose.model('TrendingArticles', trendingArticlesSchema);
