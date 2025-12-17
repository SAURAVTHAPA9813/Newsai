const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  content: {
    type: String,
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  urlToImage: {
    type: String,
  },
  publishedAt: {
    type: Date,
    index: true
  },
  source: {
    id: String,
    name: String,
  },
  author: {
    type: String,
  },
  category: {
    type: String,
    index: true
  },
  // Provider tracking
  provider: {
    type: String,
    index: true,
    default: 'newsapi'
  },
  qualityWeight: {
    type: Number,
    min: 0,
    max: 100,
    default: 50
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  savedAt: {
    type: Date,
    default: Date.now
  },
  // Historical tracking
  fetchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastSeenAt: {
    type: Date,
    default: Date.now
  },
  // Engagement metrics
  viewCount: {
    type: Number,
    default: 0
  },
  saveCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for efficient historical queries
articleSchema.index({ fetchedAt: -1, category: 1 });
articleSchema.index({ publishedAt: -1, category: 1 });

// Method to increment view count
articleSchema.methods.incrementViews = async function() {
  this.viewCount += 1;
  return this.save();
};

module.exports = mongoose.model('Article', articleSchema);
