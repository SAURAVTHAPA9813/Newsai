const mongoose = require('mongoose');

const savedArticleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  article: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Article',
    required: true
  },
  articleData: {
    title: {
      type: String,
      required: true
    },
    description: String,
    url: {
      type: String,
      required: true
    },
    imageUrl: String,
    source: {
      id: String,
      name: String
    },
    category: {
      type: String,
      default: 'general'
    },
    publishedAt: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Compound index for faster queries (user + createdAt)
savedArticleSchema.index({ user: 1, createdAt: -1 });

// Prevent duplicate saves (user can't save same article twice)
savedArticleSchema.index({ user: 1, article: 1 }, { unique: true });

module.exports = mongoose.model('SavedArticle', savedArticleSchema);
