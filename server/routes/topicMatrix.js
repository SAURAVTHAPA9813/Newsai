const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Preferences = require('../models/Preferences');

// Default topics list (can be expanded)
const DEFAULT_TOPICS = [
  { id: 'tech', name: 'Technology', category: 'industry', defaultPriority: 7 },
  { id: 'ai', name: 'Artificial Intelligence', category: 'tech', defaultPriority: 8 },
  { id: 'crypto', name: 'Cryptocurrency', category: 'finance', defaultPriority: 5 },
  { id: 'politics', name: 'Politics', category: 'general', defaultPriority: 5 },
  { id: 'economy', name: 'Economy', category: 'finance', defaultPriority: 7 },
  { id: 'climate', name: 'Climate Change', category: 'environment', defaultPriority: 6 },
  { id: 'health', name: 'Health & Medicine', category: 'health', defaultPriority: 7 },
  { id: 'science', name: 'Science', category: 'general', defaultPriority: 6 },
  { id: 'business', name: 'Business', category: 'industry', defaultPriority: 6 },
  { id: 'sports', name: 'Sports', category: 'entertainment', defaultPriority: 3 }
];

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
    const { priority, keywords, blockedKeywords, notificationEnabled, frequencyPreference } = req.body;

    let preferences = await Preferences.findOne({ user: req.user._id });

    if (!preferences) {
      preferences = new Preferences({ user: req.user._id });
    }

    // Find existing preference or create new one
    const existingIndex = preferences.topicPreferences.findIndex(p => p.topicId === topicId);

    const newPreference = {
      topicId,
      priority: priority !== undefined ? priority : 5,
      keywords: keywords || [],
      blockedKeywords: blockedKeywords || [],
      notificationEnabled: notificationEnabled !== undefined ? notificationEnabled : true,
      frequencyPreference: frequencyPreference || 'medium'
    };

    if (existingIndex >= 0) {
      preferences.topicPreferences[existingIndex] = newPreference;
    } else {
      preferences.topicPreferences.push(newPreference);
    }

    await preferences.save();

    res.json({
      success: true,
      message: 'Topic preference updated',
      data: newPreference
    });
  } catch (error) {
    console.error('Update topic preference error:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating topic preference'
    });
  }
});

module.exports = router;
