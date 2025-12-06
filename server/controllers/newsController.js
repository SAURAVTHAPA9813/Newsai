const SavedArticle = require('../models/SavedArticle');
const Article = require('../models/Article');
const User = require('../models/User');
const newsService = require('../services/newsService');

// @desc    Get latest headlines
// @route   GET /api/news/headlines
// @access  Public
exports.getHeadlines = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 20;

    const articles = await newsService.getHeadlines(page, pageSize);

    res.json({
      success: true,
      count: articles.length,
      page,
      data: articles
    });
  } catch (err) {
    console.error('Get headlines error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch latest news'
    });
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
exports.getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const page = parseInt(req.query.page) || 1;

    const articles = await newsService.getNewsByCategory(category, page);

    res.json({
      success: true,
      count: articles.length,
      category,
      data: articles
    });
  } catch (err) {
    console.error('Get category news error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to fetch category news'
    });
  }
};

// @desc    Search news
// @route   GET /api/news/search
// @access  Public
exports.searchNews = async (req, res) => {
  try {
    const { q } = req.query;
    const page = parseInt(req.query.page) || 1;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const articles = await newsService.searchNews(q, page);

    res.json({
      success: true,
      count: articles.length,
      query: q,
      data: articles
    });
  } catch (err) {
    console.error('Search news error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to search news'
    });
  }
};

// @desc    Save article for user
// @route   POST /api/news/save
// @access  Private
exports.saveArticle = async (req, res) => {
  try {
    const userId = req.user._id;
    const articleData = req.body;

    // Validate required fields
    if (!articleData.title || !articleData.url) {
      return res.status(400).json({
        success: false,
        message: 'Article title and URL are required'
      });
    }

    // Find or create article
    let article = await Article.findOne({ url: articleData.url });

    if (!article) {
      article = await Article.create({
        title: articleData.title,
        description: articleData.description,
        url: articleData.url,
        urlToImage: articleData.urlToImage || articleData.imageUrl,
        source: articleData.source,
        category: articleData.category || 'general',
        publishedAt: articleData.publishedAt || new Date(),
        author: articleData.author
      });
    }

    // Check if already saved
    const existingSave = await SavedArticle.findOne({
      user: userId,
      article: article._id
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'Article already saved'
      });
    }

    // Create saved article
    const saved = await SavedArticle.create({
      user: userId,
      article: article._id,
      articleData: {
        title: article.title,
        description: article.description,
        url: article.url,
        imageUrl: article.urlToImage,
        source: article.source,
        category: article.category,
        publishedAt: article.publishedAt
      }
    });

    // Add to user's savedArticles array
    await User.findByIdAndUpdate(userId, {
      $addToSet: { savedArticles: article._id }
    });

    res.status(201).json({
      success: true,
      message: 'Article saved successfully',
      data: saved
    });
  } catch (err) {
    console.error('Save article error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to save article'
    });
  }
};

// @desc    Get user's saved articles
// @route   GET /api/news/saved
// @access  Private
exports.getSavedArticles = async (req, res) => {
  try {
    const userId = req.user._id;
    const saved = await SavedArticle.find({ user: userId })
      .sort('-createdAt')
      .populate('article');

    res.json({
      success: true,
      count: saved.length,
      data: saved
    });
  } catch (err) {
    console.error('Get saved articles error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to load saved articles'
    });
  }
};

// @desc    Remove saved article
// @route   DELETE /api/news/saved/:articleId
// @access  Private
exports.removeSavedArticle = async (req, res) => {
  try {
    const userId = req.user._id;
    const { articleId } = req.params;

    const deleted = await SavedArticle.findOneAndDelete({
      _id: articleId,
      user: userId
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Saved article not found'
      });
    }

    // Remove from user's savedArticles array
    await User.findByIdAndUpdate(userId, {
      $pull: { savedArticles: deleted.article }
    });

    res.json({
      success: true,
      message: 'Article removed from saved'
    });
  } catch (err) {
    console.error('Delete saved article error:', err);
    res.status(500).json({
      success: false,
      message: err.message || 'Failed to delete saved article'
    });
  }
};
