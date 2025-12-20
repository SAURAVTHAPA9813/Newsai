/**
 * Cached Article Model
 * Stores articles for long-term persistent caching
 * Used as fallback when API providers hit rate limits
 */

const mongoose = require('mongoose');

const cachedArticleSchema = new mongoose.Schema({
  // Article content
  title: {
    type: String,
    required: true,
    index: true
  },
  description: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  url: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  urlToImage: {
    type: String,
    default: null
  },
  publishedAt: {
    type: Date,
    required: true,
    index: true
  },

  // Source information
  source: {
    id: String,
    name: String
  },
  author: {
    type: String,
    default: 'Unknown'
  },

  // Categorization
  category: {
    type: String,
    required: true,
    index: true,
    enum: ['technology', 'business', 'health', 'general', 'finance', 'markets', 'science', 'sports', 'entertainment', 'world', 'politics']
  },

  // Provider metadata
  provider: {
    type: String,
    required: true,
    index: true
  },
  qualityWeight: {
    type: Number,
    default: 50,
    min: 0,
    max: 100
  },

  // Analysis data (from articleAnalysisService)
  sourceScore: Number,
  stressScore: Number,
  verificationBadge: String,
  lifeImpact: {
    personal: Number,
    financial: Number,
    career: Number
  },
  engagement: Number,
  sourceTier: String,
  stressLevel: String,

  // Cache metadata
  fetchedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  lastAccessedAt: {
    type: Date,
    default: Date.now
  },
  accessCount: {
    type: Number,
    default: 0
  },

  // Cache control
  cacheExpiry: {
    type: Date,
    index: true,
    default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
  }
}, {
  timestamps: true
});

// Compound indexes for efficient queries
cachedArticleSchema.index({ category: 1, fetchedAt: -1 });
cachedArticleSchema.index({ provider: 1, category: 1, fetchedAt: -1 });
cachedArticleSchema.index({ publishedAt: -1, category: 1 });

// TTL index to auto-delete expired articles
cachedArticleSchema.index({ cacheExpiry: 1 }, { expireAfterSeconds: 0 });

/**
 * Static method: Get cached articles by category
 * @param {string} category - Category name
 * @param {number} limit - Number of articles to return
 * @param {number} maxAgeHours - Maximum age in hours (default: 48)
 * @returns {Promise<Array>} - Cached articles
 */
cachedArticleSchema.statics.getCachedByCategory = async function(category, limit = 20, maxAgeHours = 48) {
  const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);

  return await this.find({
    category: category,
    fetchedAt: { $gte: cutoffDate }
  })
    .sort({ publishedAt: -1, fetchedAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Static method: Get recent cached articles (mixed categories)
 * @param {number} limit - Number of articles to return
 * @param {number} maxAgeHours - Maximum age in hours (default: 48)
 * @returns {Promise<Array>} - Cached articles
 */
cachedArticleSchema.statics.getRecentCached = async function(limit = 20, maxAgeHours = 48) {
  const cutoffDate = new Date(Date.now() - maxAgeHours * 60 * 60 * 1000);

  return await this.find({
    fetchedAt: { $gte: cutoffDate }
  })
    .sort({ publishedAt: -1, fetchedAt: -1 })
    .limit(limit)
    .lean();
};

/**
 * Static method: Bulk upsert articles to cache
 * @param {Array} articles - Articles to cache
 * @param {string} provider - Provider name
 * @returns {Promise<Object>} - Upsert result summary
 */
cachedArticleSchema.statics.bulkUpsertArticles = async function(articles, provider) {
  if (!articles || articles.length === 0) {
    return { inserted: 0, updated: 0 };
  }

  try {
    const bulkOps = articles.map(article => ({
      updateOne: {
        filter: { url: article.url },
        update: {
          $set: {
            title: article.title,
            description: article.description,
            content: article.content,
            urlToImage: article.urlToImage,
            publishedAt: article.publishedAt,
            source: article.source,
            author: article.author,
            category: article.category || 'general',
            provider: provider,
            qualityWeight: article.qualityWeight || 50,
            sourceScore: article.sourceScore,
            stressScore: article.stressScore,
            verificationBadge: article.verificationBadge,
            lifeImpact: article.lifeImpact,
            engagement: article.engagement,
            sourceTier: article.sourceTier,
            stressLevel: article.stressLevel,
            fetchedAt: new Date(),
            cacheExpiry: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
          },
          $inc: { accessCount: 1 },
          $setOnInsert: {
            lastAccessedAt: new Date()
          }
        },
        upsert: true
      }
    }));

    const result = await this.bulkWrite(bulkOps);

    console.log(`💾 Cached ${articles.length} articles: ${result.upsertedCount} new, ${result.modifiedCount} updated`);

    return {
      inserted: result.upsertedCount,
      updated: result.modifiedCount,
      total: articles.length
    };
  } catch (error) {
    console.error('❌ Error caching articles:', error.message);
    throw error;
  }
};

/**
 * Static method: Update access timestamp when articles are served from cache
 * @param {Array<string>} urls - Article URLs that were accessed
 * @returns {Promise<void>}
 */
cachedArticleSchema.statics.recordAccess = async function(urls) {
  if (!urls || urls.length === 0) return;

  try {
    await this.updateMany(
      { url: { $in: urls } },
      {
        $set: { lastAccessedAt: new Date() },
        $inc: { accessCount: 1 }
      }
    );
  } catch (error) {
    console.error('❌ Error recording cache access:', error.message);
  }
};

/**
 * Static method: Get cache statistics
 * @returns {Promise<Object>} - Cache statistics
 */
cachedArticleSchema.statics.getCacheStats = async function() {
  const now = new Date();
  const oneDayAgo = new Date(now - 24 * 60 * 60 * 1000);
  const twoDaysAgo = new Date(now - 48 * 60 * 60 * 1000);

  const [
    totalCount,
    recentCount,
    categoryBreakdown,
    providerBreakdown
  ] = await Promise.all([
    this.countDocuments({}),
    this.countDocuments({ fetchedAt: { $gte: oneDayAgo } }),
    this.aggregate([
      { $match: { fetchedAt: { $gte: twoDaysAgo } } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]),
    this.aggregate([
      { $match: { fetchedAt: { $gte: twoDaysAgo } } },
      { $group: { _id: '$provider', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ])
  ]);

  return {
    totalArticles: totalCount,
    recentArticles: recentCount,
    byCategory: categoryBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {}),
    byProvider: providerBreakdown.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {})
  };
};

const CachedArticle = mongoose.model('CachedArticle', cachedArticleSchema);

module.exports = CachedArticle;
