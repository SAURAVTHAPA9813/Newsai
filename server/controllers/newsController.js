const axios = require('axios');
const Article = require('../models/Article');
const User = require('../models/User');

// @desc    Get top headlines
// @route   GET /api/news/headlines
// @access  Public
const getHeadlines = async (req, res) => {
  try {
    const { category, country = 'us', pageSize = 10 } = req.query;

    const params = {
      apiKey: process.env.NEWS_API_KEY,
      country,
      pageSize
    };

    if (category) {
      params.category = category;
    }

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params
    });

    res.status(200).json({
      success: true,
      data: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('Get headlines error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching headlines',
      error: error.response?.data?.message || error.message
    });
  }
};

// @desc    Search news articles
// @route   GET /api/news/search
// @access  Public
const searchNews = async (req, res) => {
  try {
    const { q, from, to, sortBy = 'publishedAt', pageSize = 10, page = 1 } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    const params = {
      apiKey: process.env.NEWS_API_KEY,
      q,
      sortBy,
      pageSize,
      page
    };

    if (from) params.from = from;
    if (to) params.to = to;

    const response = await axios.get('https://newsapi.org/v2/everything', {
      params
    });

    res.status(200).json({
      success: true,
      data: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('Search news error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error searching news',
      error: error.response?.data?.message || error.message
    });
  }
};

// @desc    Get news by category
// @route   GET /api/news/category/:category
// @access  Public
const getNewsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { pageSize = 10, page = 1 } = req.query;

    const response = await axios.get('https://newsapi.org/v2/top-headlines', {
      params: {
        apiKey: process.env.NEWS_API_KEY,
        category,
        pageSize,
        page
      }
    });

    res.status(200).json({
      success: true,
      data: response.data.articles,
      totalResults: response.data.totalResults
    });
  } catch (error) {
    console.error('Get category news error:', error.response?.data || error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching category news',
      error: error.response?.data?.message || error.message
    });
  }
};

// @desc    Save an article
// @route   POST /api/news/save
// @access  Private
const saveArticle = async (req, res) => {
  try {
    const { title, description, content, url, urlToImage, publishedAt, source, author, category } = req.body;

    // Check if article already exists
    let article = await Article.findOne({ url });

    if (!article) {
      // Create new article
      article = await Article.create({
        title,
        description,
        content,
        url,
        urlToImage,
        publishedAt,
        source,
        author,
        category,
        savedBy: [req.user._id]
      });
    } else {
      // Check if user already saved this article
      if (article.savedBy.includes(req.user._id)) {
        return res.status(400).json({
          success: false,
          message: 'Article already saved'
        });
      }

      // Add user to savedBy array
      article.savedBy.push(req.user._id);
      await article.save();
    }

    // Add article to user's savedArticles
    await User.findByIdAndUpdate(
      req.user._id,
      { $addToSet: { savedArticles: article._id } }
    );

    res.status(201).json({
      success: true,
      data: article,
      message: 'Article saved successfully'
    });
  } catch (error) {
    console.error('Save article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error saving article',
      error: error.message
    });
  }
};

// @desc    Get saved articles
// @route   GET /api/news/saved
// @access  Private
const getSavedArticles = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('savedArticles');

    res.status(200).json({
      success: true,
      data: user.savedArticles
    });
  } catch (error) {
    console.error('Get saved articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching saved articles',
      error: error.message
    });
  }
};

// @desc    Remove saved article
// @route   DELETE /api/news/saved/:articleId
// @access  Private
const removeSavedArticle = async (req, res) => {
  try {
    const { articleId } = req.params;

    // Remove article from user's savedArticles
    await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { savedArticles: articleId } }
    );

    // Remove user from article's savedBy array
    const article = await Article.findById(articleId);
    if (article) {
      article.savedBy = article.savedBy.filter(
        userId => userId.toString() !== req.user._id.toString()
      );
      await article.save();

      // If no users have saved this article, delete it
      if (article.savedBy.length === 0) {
        await Article.findByIdAndDelete(articleId);
      }
    }

    res.status(200).json({
      success: true,
      message: 'Article removed from saved list'
    });
  } catch (error) {
    console.error('Remove saved article error:', error);
    res.status(500).json({
      success: false,
      message: 'Error removing saved article',
      error: error.message
    });
  }
};

module.exports = {
  getHeadlines,
  searchNews,
  getNewsByCategory,
  saveArticle,
  getSavedArticles,
  removeSavedArticle
};
