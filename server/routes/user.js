const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const User = require('../models/User');
const Preferences = require('../models/Preferences');

// Default topics list with full UI-compatible shape
const DEFAULT_TOPICS = [
  {
    id: 'tech',
    name: 'Technology',
    categories: ['industry', 'tech'],
    priority: 70,
    trendScore: 75,
    firewallStatus: 'ALLOWED',
    description: 'Latest technology news and innovations',
    stats: { mentions7d: 1250, avgCredibility: 82 },
    relatedIds: ['ai', 'business']
  },
  {
    id: 'ai',
    name: 'Artificial Intelligence',
    categories: ['tech', 'science'],
    priority: 80,
    trendScore: 92,
    firewallStatus: 'ALLOWED',
    description: 'AI developments, machine learning, and automation',
    stats: { mentions7d: 2100, avgCredibility: 85 },
    relatedIds: ['tech', 'science']
  },
  {
    id: 'crypto',
    name: 'Cryptocurrency',
    categories: ['finance', 'tech'],
    priority: 50,
    trendScore: 65,
    firewallStatus: 'ALLOWED',
    description: 'Cryptocurrency markets and blockchain technology',
    stats: { mentions7d: 890, avgCredibility: 70 },
    relatedIds: ['economy', 'tech']
  },
  {
    id: 'politics',
    name: 'Politics',
    categories: ['general', 'politics'],
    priority: 50,
    trendScore: 70,
    firewallStatus: 'ALLOWED',
    description: 'Political news and government policy',
    stats: { mentions7d: 3200, avgCredibility: 75 },
    relatedIds: ['economy', 'climate']
  },
  {
    id: 'economy',
    name: 'Economy',
    categories: ['finance', 'business'],
    priority: 70,
    trendScore: 78,
    firewallStatus: 'ALLOWED',
    description: 'Economic trends, markets, and financial news',
    stats: { mentions7d: 1800, avgCredibility: 80 },
    relatedIds: ['business', 'crypto']
  },
  {
    id: 'climate',
    name: 'Climate Change',
    categories: ['environment', 'science'],
    priority: 60,
    trendScore: 72,
    firewallStatus: 'ALLOWED',
    description: 'Climate science, environmental policy, and sustainability',
    stats: { mentions7d: 950, avgCredibility: 88 },
    relatedIds: ['science', 'politics']
  },
  {
    id: 'health',
    name: 'Health & Medicine',
    categories: ['health', 'science'],
    priority: 70,
    trendScore: 80,
    firewallStatus: 'ALLOWED',
    description: 'Medical breakthroughs, public health, and wellness',
    stats: { mentions7d: 1600, avgCredibility: 90 },
    relatedIds: ['science', 'ai']
  },
  {
    id: 'science',
    name: 'Science',
    categories: ['general', 'science'],
    priority: 60,
    trendScore: 68,
    firewallStatus: 'ALLOWED',
    description: 'Scientific discoveries and research',
    stats: { mentions7d: 720, avgCredibility: 92 },
    relatedIds: ['health', 'climate', 'ai']
  },
  {
    id: 'business',
    name: 'Business',
    categories: ['industry', 'business'],
    priority: 60,
    trendScore: 74,
    firewallStatus: 'ALLOWED',
    description: 'Corporate news, startups, and industry trends',
    stats: { mentions7d: 1400, avgCredibility: 78 },
    relatedIds: ['economy', 'tech']
  },
  {
    id: 'sports',
    name: 'Sports',
    categories: ['entertainment', 'sports'],
    priority: 30,
    trendScore: 55,
    firewallStatus: 'ALLOWED',
    description: 'Sports news, scores, and athlete updates',
    stats: { mentions7d: 2500, avgCredibility: 72 },
    relatedIds: []
  }
];

// @desc    Get user preferences
// @route   GET /api/user/preferences
// @access  Private
router.get('/preferences', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.preferences || { categories: [], topics: [] }
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching preferences'
    });
  }
});

// @desc    Update user preferences
// @route   PUT /api/user/preferences
// @access  Private
router.put('/preferences', protect, async (req, res) => {
  try {
    const { categories, topics } = req.body;

    // Validate input
    if (!Array.isArray(categories) && !Array.isArray(topics)) {
      return res.status(400).json({
        success: false,
        message: 'Categories or topics must be provided as arrays'
      });
    }

    const updateData = {};
    if (categories) updateData['preferences.categories'] = categories;
    if (topics) updateData['preferences.topics'] = topics;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('preferences');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'Preferences updated successfully',
      data: user.preferences
    });
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating preferences'
    });
  }
});

// @desc    Get user profile
// @route   GET /api/user/profile
// @access  Private
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('savedArticles');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        preferences: user.preferences,
        savedArticlesCount: user.savedArticles.length,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching profile'
    });
  }
});

// ===== TOPIC MATRIX ENDPOINTS =====

// @desc    Get complete topic matrix state
// @route   GET /api/user/topic-matrix
// @access  Private
router.get('/topic-matrix', protect, async (req, res) => {
  try {
    let preferences = await Preferences.findOne({ user: req.user._id });

    // Create default preferences if none exist
    if (!preferences) {
      preferences = new Preferences({
        user: req.user._id,
        contextProfile: {
          industry: 'General',
          region: 'United States',
          lifeStage: 'Career Professional',
          interests: [],
          expertise: []
        },
        firewallSettings: {
          anxietyFilter: { enabled: true, threshold: 70 },
          contentWarnings: { enabled: true, categories: ['violence', 'disturbing', 'graphic'] },
          blockedSources: [],
          blockedTopics: [],
          sensationalismFilter: { enabled: true, aggressiveness: 'medium' }
        },
        aiPolicy: {
          tone: 'neutral',
          depth: 'standard',
          perspective: 'balanced',
          summaryStyle: 'mixed',
          includeContext: true,
          includeImplications: true
        },
        topicPreferences: []
      });
      await preferences.save();
    }

    // Build complete topic matrix state
    const state = {
      contextProfile: preferences.contextProfile || {
        industry: 'General',
        region: 'United States',
        lifeStage: 'Career Professional',
        interests: [],
        expertise: []
      },
      firewallSettings: preferences.firewallSettings || {
        anxietyFilter: { enabled: true, threshold: 70 },
        contentWarnings: { enabled: true, categories: ['violence', 'disturbing', 'graphic'] },
        blockedSources: [],
        blockedTopics: [],
        sensationalismFilter: { enabled: true, aggressiveness: 'medium' }
      },
      aiPolicy: preferences.aiPolicy || {
        tone: 'neutral',
        depth: 'standard',
        perspective: 'balanced',
        summaryStyle: 'mixed',
        includeContext: true,
        includeImplications: true
      },
      topics: DEFAULT_TOPICS,
      topicPreferences: preferences.topicPreferences || [],
      uiState: {
        selectedTopicId: null,
        searchQuery: '',
        activeFilter: 'all',
        sortMode: 'priority'
      }
    };

    res.json({
      success: true,
      data: state
    });
  } catch (error) {
    console.error('Get topic matrix error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching topic matrix'
    });
  }
});

// @desc    Update context profile
// @route   PUT /api/user/context-profile
// @access  Private
router.put('/context-profile', protect, async (req, res) => {
  try {
    const { industry, region, lifeStage, interests, expertise } = req.body;

    const updateData = { contextProfile: {} };
    if (industry !== undefined) updateData.contextProfile.industry = industry;
    if (region !== undefined) updateData.contextProfile.region = region;
    if (lifeStage !== undefined) updateData.contextProfile.lifeStage = lifeStage;
    if (interests !== undefined) updateData.contextProfile.interests = interests;
    if (expertise !== undefined) updateData.contextProfile.expertise = expertise;

    const preferences = await Preferences.findOneAndUpdate(
      { user: req.user._id },
      { $set: updateData },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Context profile updated',
      data: preferences.contextProfile
    });
  } catch (error) {
    console.error('Update context profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating context profile'
    });
  }
});

// @desc    Update firewall settings
// @route   PUT /api/user/firewall-settings
// @access  Private
router.put('/firewall-settings', protect, async (req, res) => {
  try {
    const settings = req.body;

    const preferences = await Preferences.findOneAndUpdate(
      { user: req.user._id },
      { $set: { firewallSettings: settings } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'Firewall settings updated',
      data: preferences.firewallSettings
    });
  } catch (error) {
    console.error('Update firewall settings error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating firewall settings'
    });
  }
});

// @desc    Update AI policy
// @route   PUT /api/user/ai-policy
// @access  Private
router.put('/ai-policy', protect, async (req, res) => {
  try {
    const policy = req.body;

    const preferences = await Preferences.findOneAndUpdate(
      { user: req.user._id },
      { $set: { aiPolicy: policy } },
      { new: true, upsert: true }
    );

    res.json({
      success: true,
      message: 'AI policy updated',
      data: preferences.aiPolicy
    });
  } catch (error) {
    console.error('Update AI policy error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating AI policy'
    });
  }
});

// @desc    Update topic preference
// @route   PUT /api/user/topics/:topicId
// @access  Private
router.put('/topics/:topicId', protect, async (req, res) => {
  try {
    const { topicId } = req.params;
    const {
      priorityOverride,
      firewallStatus,
      feedPreferences,
      keywords,
      blockedKeywords,
      notificationEnabled,
      frequencyPreference
    } = req.body;

    let preferences = await Preferences.findOne({ user: req.user._id });

    if (!preferences) {
      preferences = new Preferences({ user: req.user._id });
    }

    // Find existing preference or create new one
    const existingIndex = preferences.topicPreferences.findIndex(p => p.topicId === topicId);

    // Defensive validation with safe defaults - never throw on bad payload
    const allowedFirewall = ['ALLOWED', 'LIMITED', 'BLOCKED'];
    const allowedFreq = ['high', 'medium', 'low'];

    // Clamp priority to 0-100 range, default 50
    const prio = Number.isFinite(priorityOverride)
      ? Math.min(Math.max(priorityOverride, 0), 100)
      : (existingIndex >= 0 ? preferences.topicPreferences[existingIndex].priorityOverride || 50 : 50);

    // Validate firewall status
    const firewall = allowedFirewall.includes(firewallStatus) ? firewallStatus : 'ALLOWED';

    // Validate frequency preference
    const freq = allowedFreq.includes(frequencyPreference) ? frequencyPreference : 'medium';

    // Validate feed preferences with boolean coercion
    const feed = {
      showMore: !!(feedPreferences?.showMore),
      onlyHighCredibility: !!(feedPreferences?.onlyHighCredibility),
      includeExplainers: !!(feedPreferences?.includeExplainers)
    };

    const newPreference = {
      topicId,
      // Support both priorityOverride (new) and priority (old)
      priorityOverride: prio,
      priority: Math.min(Math.round(prio / 10), 10), // Scale 0-100 to 0-10 for legacy field
      firewallStatus: firewall,
      feedPreferences: feed,
      keywords: Array.isArray(keywords) ? keywords : [],
      blockedKeywords: Array.isArray(blockedKeywords) ? blockedKeywords : [],
      notificationEnabled: notificationEnabled !== undefined ? !!notificationEnabled : true,
      frequencyPreference: freq
    };

    if (existingIndex >= 0) {
      preferences.topicPreferences[existingIndex] = newPreference;
    } else {
      preferences.topicPreferences.push(newPreference);
    }

    await preferences.save({ validateBeforeSave: true });

    console.log('Topic preference updated successfully for topic:', topicId);
    console.log('User:', req.user._id, 'Priority:', prio, 'Firewall:', firewall);

    res.json({
      success: true,
      message: 'Topic preference updated',
      data: newPreference
    });
  } catch (error) {
    console.error('Update topic preference error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      topicId: req.params.topicId,
      body: req.body,
      userId: req.user?._id
    });
    res.status(500).json({
      success: false,
      message: 'Error updating topic preference',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

module.exports = router;
