import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiTrendingUp, FiUser, FiRefreshCw, FiClock, FiDollarSign, FiCpu, FiHeart, FiChevronDown } from 'react-icons/fi';
import Icon from '../common/Icon';
import intelligenceAPI from '../../services/intelligenceAPI';

const LiveIntelligenceBriefing = ({ onFilterByTopic }) => {
  const [activeMode, setActiveMode] = useState('Global');
  const [briefingData, setBriefingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  // Load briefing on component mount
  useEffect(() => {
    loadBriefing();
  }, []);

  const loadBriefing = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('📰 Loading intelligence briefing...');

      const response = await intelligenceAPI.getCurrentBriefing();

      console.log('📦 API Response:', response);

      // Check if we have briefing data (response is already unwrapped by intelligenceAPI.js)
      if (response && response.id) {
        setBriefingData(response);
        console.log('✅ Briefing loaded successfully');
      } else if (response && response.error) {
        // API returned error
        throw new Error(response.error || 'Failed to load briefing');
      } else {
        // No data at all
        console.warn('⚠️ Briefing data is empty, using fallback');
        throw new Error('Briefing is being generated. Please try again in a few minutes.');
      }
    } catch (err) {
      console.error('❌ Error loading briefing:', err);
      setError(err.message || 'Failed to load intelligence briefing');

      // Set fallback data
      setBriefingData({
        global: {
          globalSituation: 'Intelligence briefing service is temporarily unavailable.',
          globalDelta: 'Please try refreshing to reload the briefing.',
          impactOnYou: {
            industry: 'General',
            region: 'Global',
            summary: 'We are working to restore the briefing service. You can still browse articles below.',
            keyPoints: [
              'Briefing service temporarily unavailable',
              'Try the refresh button above',
              'Browse individual articles for latest news'
            ]
          }
        },
        status: 'failed'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    try {
      setRefreshing(true);
      console.log('🔄 Refreshing briefing from cache...');

      // Just reload the cached briefing, don't force regeneration
      // This will only use Gemini API if we're at a new time slot (8 AM or 8 PM)
      await loadBriefing();

      console.log('✅ Briefing refreshed from cache (no API calls used)');
    } catch (err) {
      console.error('❌ Error refreshing briefing:', err);
      setError('Failed to refresh briefing. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const scrollToArticles = () => {
    // Scroll to articles section
    const articlesSection = document.querySelector('[data-articles-section]');
    if (articlesSection) {
      articlesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Mode data configuration
  const modeData = {
    Global: {
      icon: FiGlobe,
      color: 'from-blue-500 to-blue-600',
      dataKey: 'global'
    },
    Markets: {
      icon: FiDollarSign,
      color: 'from-green-500 to-green-600',
      dataKey: 'markets'
    },
    Tech: {
      icon: FiCpu,
      color: 'from-sky-500 to-sky-600',
      dataKey: 'tech'
    },
    'My Life': {
      icon: FiHeart,
      color: 'from-pink-500 to-pink-600',
      dataKey: 'myLife'
    }
  };

  // Get current mode data
  const currentModeConfig = modeData[activeMode];
  const currentModeData = briefingData?.[currentModeConfig?.dataKey] || briefingData?.global || {};

  // Loading skeleton
  if (loading) {
    return (
      <div className="mb-12">
        <div
          className="h-64 rounded-3xl animate-pulse"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)'
          }}
        >
          <div className="p-6 space-y-4">
            <div className="h-6 bg-serenity-royal/20 rounded w-1/3 animate-pulse"></div>
            <div className="h-4 bg-serenity-royal/20 rounded w-2/3 animate-pulse"></div>
            <div className="h-4 bg-serenity-royal/20 rounded w-1/2 animate-pulse"></div>
          </div>
        </div>
      </div>
    );
  }

  // Get current time for "Updated" badge
  const lastUpdated = briefingData?.lastUpdated ? new Date(briefingData.lastUpdated) : new Date();
  const updateTime = lastUpdated.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div>
      {/* Main Briefing Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="rounded-3xl border-l-4 border-serenity-royal shadow-xl overflow-hidden card-gradient-faq hover-serenity-glow mb-8"
        style={{
          border: '1px solid rgba(65, 105, 225, 0.2)',
          borderLeft: '4px solid #4169E1'
        }}
      >
        {/* Card Header */}
        <div className="p-6 border-b border-serenity-royal/10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-text-dark uppercase tracking-wider">
                  LIVE AI INTELLIGENCE BRIEFING
                </span>
                <div className="w-2 h-2 bg-serenity-royal rounded-full animate-pulse"></div>
              </div>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              {/* Mode Tabs */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/40">
                {Object.keys(modeData).map((mode) => {
                  const ModeIcon = modeData[mode].icon;
                  const isActive = activeMode === mode;
                  const hasData = briefingData?.[modeData[mode].dataKey];

                  return (
                    <motion.button
                      key={mode}
                      onClick={() => setActiveMode(mode)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      disabled={!hasData}
                      className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-serenity-royal'
                          : hasData
                          ? 'text-text-secondary hover:text-serenity-royal'
                          : 'text-text-secondary/30 cursor-not-allowed'
                      }`}
                    >
                      {isActive && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 rounded-md bg-serenity-royal/10"
                          style={{
                            boxShadow: '0 0 10px rgba(65, 105, 225, 0.3)'
                          }}
                          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />
                      )}
                      <ModeIcon className="relative z-10 w-3 h-3" />
                      <span className="relative z-10">{mode}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Updated Time Badge */}
              <div className="px-4 py-1.5 rounded-full bg-serenity-royal/10 flex items-center gap-2">
                <FiClock className="w-3 h-3 text-serenity-royal" />
                <span className="text-xs font-semibold text-serenity-royal uppercase tracking-wider">
                  UPDATED: {updateTime}
                </span>
              </div>

              {/* Refresh Button */}
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-2 rounded-lg bg-white/60 border border-white/40 text-text-secondary hover:text-serenity-royal hover:border-serenity-royal/50 transition-all duration-300 ${
                  refreshing ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                aria-label="Refresh intelligence briefing"
              >
                <FiRefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>
        </div>

        {/* Card Body - Three Sections */}
        <div className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeMode}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="rounded-2xl p-6 space-y-6"
              style={{
                background: 'rgba(250, 248, 248, 0.4)',
                backdropFilter: 'blur(20px)'
              }}
            >
              {/* Global Situation */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentModeConfig.color} flex items-center justify-center shadow-lg`}>
                    <currentModeConfig.icon className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-text-dark">
                    {activeMode === 'My Life' ? 'Your Situation' : 'Global Situation'}
                  </h3>
                </div>
                <p className="text-base text-text-secondary leading-relaxed ml-10">
                  {currentModeData.globalSituation || 'Loading briefing data...'}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-serenity-royal/20 to-transparent"></div>

              {/* Global Delta */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <FiTrendingUp className="w-4 h-4 text-white" />
                  </div>
                  <h3 className="font-bold text-base text-text-dark">
                    {activeMode === 'My Life' ? 'Local Delta (24h)' : 'Global Delta (24h)'}
                  </h3>
                </div>
                <p className="text-base text-text-secondary leading-relaxed ml-10">
                  {currentModeData.globalDelta || 'No recent updates available.'}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-serenity-royal/20 to-transparent"></div>

              {/* Impact on You */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
                    <FiUser className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-dark">Impact on You</h3>
                    {currentModeData.impactOnYou && (
                      <p className="text-xs text-text-secondary">
                        {currentModeData.impactOnYou.industry} • {currentModeData.impactOnYou.region}
                      </p>
                    )}
                  </div>
                </div>
                <div className="ml-10">
                  <p className="text-base text-text-secondary leading-relaxed mb-3">
                    {currentModeData.impactOnYou?.summary || 'No impact analysis available.'}
                  </p>
                  {currentModeData.impactOnYou?.keyPoints && currentModeData.impactOnYou.keyPoints.length > 0 && (
                    <div className="space-y-2">
                      {currentModeData.impactOnYou.keyPoints.slice(0, 3).map((point, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2 flex-shrink-0"></div>
                          <span className="text-sm text-text-secondary leading-relaxed">{point}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Trending Topics Section */}
          {briefingData?.trendingTopics && briefingData.trendingTopics.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-6 border-t border-serenity-royal/10"
            >
              <h4 className="text-sm font-bold text-text-dark mb-3 flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4 text-serenity-royal" />
                Trending Topics
              </h4>
              <div className="flex flex-wrap gap-2">
                {briefingData.trendingTopics.slice(0, 8).map((topic, index) => (
                  <motion.button
                    key={index}
                    onClick={() => onFilterByTopic && onFilterByTopic(topic)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-3 py-1.5 rounded-full bg-white/60 border border-serenity-royal/20 text-xs font-medium text-text-secondary hover:bg-serenity-royal hover:text-white hover:border-serenity-royal transition-all duration-200 cursor-pointer"
                  >
                    #{topic.name}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Read Full Articles Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex justify-center mb-8"
      >
        <motion.button
          onClick={scrollToArticles}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-6 py-3 rounded-xl bg-gradient-to-r from-serenity-royal to-serenity-deep text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 group"
        >
          <span>Read Full Articles</span>
          <FiChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
        </motion.button>
      </motion.div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm"
        >
          <strong>Error:</strong> {error}
        </motion.div>
      )}
    </div>
  );
};

export default LiveIntelligenceBriefing;
