import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiSearch, FiTrendingUp, FiClock, FiFilter, FiActivity } from 'react-icons/fi';
import dashboardAPI from '../services/dashboardAPI';
import newsAPI from '../services/newsAPI';
import { useAuth } from '../context/AuthContext';
import LiveIntelligenceBriefing from '../components/dashboard/LiveIntelligenceBriefing';
import HolographicArticleCard from '../components/dashboard/HolographicArticleCard';
import RightPanelWellness from '../components/dashboard/RightPanelWellness';
import FocusZenMode from '../components/dashboard/FocusZenMode';
import TrendRadarBar from '../components/dashboard/TrendRadarBar';
import TimeScrubber from '../components/dashboard/TimeScrubber';
import AIOrb from '../components/dashboard/AIOrb';
import StressGuard from '../components/dashboard/StressGuard';
import PersonalizationStrip from '../components/dashboard/PersonalizationStrip';
import CommandPalette from '../components/dashboard/CommandPalette';

const ControlCenterPage = () => {
  // Auth context
  const { user } = useAuth();

  // State management
  const [readingMode, setReadingMode] = useState('15m');
  const [articles, setArticles] = useState([]);
  const [briefing, setBriefing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [focusedArticle, setFocusedArticle] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchMode, setSearchMode] = useState('search');
  const [activeFilter, setActiveFilter] = useState('all');
  const [activeInterest, setActiveInterest] = useState(null); // Track clicked interest for filtering
  const [calmModeEnabled, setCalmModeEnabled] = useState(false);
  const [showCommandPalette, setShowCommandPalette] = useState(false);

  // Dashboard data state
  const [volatility, setVolatility] = useState(50);
  const [trendingTopics, setTrendingTopics] = useState([]);
  const [marketData, setMarketData] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [globalVectors, setGlobalVectors] = useState([]);
  const [allArticles, setAllArticles] = useState([]); // Store all articles before filtering

  // User profile from auth context or defaults
  const userProfile = {
    industry: user?.preferences?.industry || 'General',
    region: user?.preferences?.region || 'Global'
  };

  // Load initial data
  useEffect(() => {
    loadDashboardData();
  }, [activeFilter, activeInterest]); // Reload when filter or interest changes

  // Refilter articles when reading mode changes (without reloading)
  useEffect(() => {
    if (allArticles.length > 0) {
      const limit = getArticleLimitForMode(readingMode);
      const filteredArticles = allArticles.slice(0, limit);
      setArticles(filteredArticles);
    }
  }, [readingMode, allArticles]);

  // Global keyboard shortcut for Command Palette (⌘K or Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Helper function to get article limits based on reading mode
  const getArticleLimitForMode = (mode) => {
    switch (mode) {
      case '5m':
        return 6; // 6 articles × 1 min each = ~6 min reading
      case '15m':
        return 12; // 12 articles × 1.5 min each = ~15 min reading
      case '30m':
        return 20; // 20 articles × 1.5 min each = ~30 min reading
      default:
        return 12;
    }
  };

  // Helper function to get summary length based on reading mode
  const getSummaryForMode = (article, mode) => {
    const summaries = article.summary;
    if (typeof summaries === 'object' && summaries !== null) {
      return summaries[mode] || summaries['15m'] || article.description;
    }
    return article.description || article.title;
  };

  // Helper function to map backend articles to frontend format
  const mapBackendArticleToFrontend = (article) => {
    // Create summaries of different lengths
    const description = article.description || article.title;
    const content = article.content || description;

    // Split content into sentences for different reading modes
    const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const shortSummary = sentences.slice(0, 2).join('. ') + '.'; // 2 sentences for 5m
    const mediumSummary = sentences.slice(0, 4).join('. ') + '.'; // 4 sentences for 15m
    const longSummary = sentences.slice(0, 6).join('. ') + '.'; // 6 sentences for 30m

    return {
      id: article._id || article.url,
      title: article.title,
      summary: {
        '5m': shortSummary,
        '15m': mediumSummary,
        '30m': longSummary,
      },
      sourceScore: article.sourceScore || 75,
      verificationBadge: article.verificationBadge || 'UNVERIFIED',
      impactTags: article.impactTags || [],
      anxietyScore: article.anxietyScore || 50,
      category: article.category || 'General',
      imageUrl: article.urlToImage || article.imageUrl,
      publishedAt: article.publishedAt,
      readTime: article.readTime || '5 min',
      source: article.source,
      author: article.author || article.source?.name,
      url: article.url,
      content: content, // Store full content for Zen mode
      description: description,
      trending: article.trending || false,
      featured: article.featured || false,
    };
  };

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      // Determine category based on active interest
      let category = activeFilter === 'all' ? undefined : activeFilter;

      // If an interest is selected, use it as the category
      if (activeInterest) {
        category = activeInterest.toLowerCase();
      }

      console.log('📡 Loading dashboard with params:', {
        activeInterest,
        category,
        readingMode,
        activeFilter
      });

      // Call real backend - dashboard overview endpoint returns everything
      const overviewData = await dashboardAPI.getDashboardOverview({
        page: 1,
        limit: 20,
        readingMode: readingMode,
        category: category,
      });

      console.log('✅ Dashboard data loaded:', {
        articlesCount: overviewData.data?.articles?.length,
        category: category
      });

      if (overviewData.success) {
        // Set briefing data
        if (overviewData.data.briefing) {
          setBriefing(overviewData.data.briefing);
        }

        // Map and set articles
        if (overviewData.data.articles) {
          const mappedArticles = overviewData.data.articles.map(mapBackendArticleToFrontend);
          setAllArticles(mappedArticles); // Store all articles

          // Filter articles based on reading mode
          const limit = getArticleLimitForMode(readingMode);
          const filteredArticles = mappedArticles.slice(0, limit);
          setArticles(filteredArticles);
        }

        // Set volatility data
        if (overviewData.data.volatility) {
          setVolatility(overviewData.data.volatility.index || 50);
        }

        // Set trending topics
        if (overviewData.data.trendingTopics) {
          setTrendingTopics(overviewData.data.trendingTopics);
        }

        // Set market data
        if (overviewData.data.market) {
          setMarketData(overviewData.data.market);
        }

        // Set user stats
        if (overviewData.data.userStats) {
          setUserStats(overviewData.data.userStats);
        }

        // Set global vectors
        if (overviewData.data.globalVectors) {
          setGlobalVectors(overviewData.data.globalVectors);
        }
      }
    } catch (error) {
      console.error('Error loading dashboard:', error);
      // Optionally show error UI or fallback to cached data
      alert('Failed to load dashboard data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleReadingModeChange = (mode) => {
    setReadingMode(mode);
  };

  const handleArticleClick = (article) => {
    setFocusedArticle(article);
  };

  const closeFocusMode = () => {
    setFocusedArticle(null);
  };

  const handlePreferencesChange = (change) => {
    console.log('Preference updated:', change);

    if (change.type === 'industries') {
      // When industries are toggled, we could implement multi-select filtering
      // For now, we'll treat the last selected one as the active filter
      const industries = change.value;
      if (industries.length > 0) {
        // Get the most recently selected interest
        const lastSelected = industries[industries.length - 1];
        setActiveInterest(lastSelected);
      } else {
        // If all deselected, show all
        setActiveInterest(null);
      }
    }
  };

  const handleInterestClick = (interest) => {
    console.log('🎯 Interest clicked:', interest);
    console.log('📊 Current activeInterest:', activeInterest);

    // Toggle interest - if already active, deactivate it (show all)
    if (activeInterest === interest) {
      console.log('❌ Deactivating filter - showing all news');
      setActiveInterest(null);
    } else {
      console.log('✅ Activating filter for:', interest);
      setActiveInterest(interest);
    }
  };

  const handleSearch = async (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length < 3) {
      // Reset to normal view if query too short
      loadDashboardData();
      return;
    }

    try {
      setLoading(true);
      const searchResults = await newsAPI.searchNews(query, 1, 20);

      if (searchResults.success) {
        const mappedArticles = searchResults.data.articles.map(mapBackendArticleToFrontend);
        setArticles(mappedArticles);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  };

  if (loading && !briefing) {
    return (
      <div className="min-h-screen section-gradient-radial flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-serenity-royal border-t-transparent mb-4"></div>
          <p className="text-text-secondary text-lg font-semibold">Loading Intelligence Center...</p>
          <p className="text-text-secondary/60 text-sm mt-2">Analyzing thousands of sources...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Subtle Grid Background Overlay */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'linear-gradient(#4169E1 1px, transparent 1px), linear-gradient(90deg, #0943f1ff 1px, transparent 1px)',
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Dynamic Electric Blue Ambient Glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-5 opacity-70"
        style={{ mixBlendMode: 'screen' }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ duration: 2, ease: 'easeIn' }}
      >
        {/* Primary Glow Orb - drifts across screen */}
        <motion.div
          className="absolute w-[800px] h-[800px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(65, 105, 225, 0.4) 0%, rgba(65, 105, 225, 0.2) 30%, transparent 60%)',
            filter: 'blur(80px)',
            willChange: 'transform, opacity'
          }}
          animate={{
            x: ['20%', '60%', '40%', '70%', '20%'],
            y: ['30%', '60%', '40%', '50%', '30%'],
            scale: [1, 1.1, 0.95, 1.05, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1]
          }}
        />

        {/* Secondary Glow - offset movement for depth */}
        <motion.div
          className="absolute w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2"
          style={{
            background: 'radial-gradient(circle, rgba(91, 141, 239, 0.3) 0%, rgba(91, 141, 239, 0.15) 30%, transparent 60%)',
            filter: 'blur(60px)',
            willChange: 'transform, opacity'
          }}
          animate={{
            x: ['70%', '30%', '60%', '40%', '70%'],
            y: ['50%', '70%', '30%', '60%', '50%'],
            scale: [1, 0.9, 1.1, 0.95, 1],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'easeInOut',
            times: [0, 0.25, 0.5, 0.75, 1],
            delay: 2.5
          }}
        />
      </motion.div>

      {/* Sticky Search Header */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-30 glassmorphism-serenity border-b border-serenity-royal/10 shadow-sm"
      >
        <div className="container-custom py-4">
          <div className="flex items-center gap-4 flex-wrap">
            {/* Search Input */}
            <div className="flex-1 min-w-[300px] relative">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input
                type="text"
                placeholder="Ask Intelligence... or press ⌘K for AI commands"
                value={searchQuery}
                onChange={handleSearch}
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-brand-blue/20 text-text-dark placeholder-text-secondary/60 focus:outline-none focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 transition-all"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Container */}
      <div className="relative z-10">
        <div className="container-custom section-padding">
          {/* Trend Radar Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <TrendRadarBar
              trends={trendingTopics}
              marketData={marketData}
              onTopicClick={(topic) => console.log('Filter by:', topic.name)}
            />
          </motion.div>

          {/* Page Header with Glassmorphism */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-12"
          >
            <div className="rounded-3xl p-8 border border-serenity-royal/20 shadow-xl glassmorphism-serenity hover-serenity-glow">
              <div className="flex items-center justify-between flex-wrap gap-6">
                <div className="flex-1">
                  <motion.h1
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="font-cinzel text-4xl md:text-5xl font-bold text-text-dark mb-2"
                  >
                    Control Center
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-lg text-text-secondary"
                  >
                    Your personalized <span className="text-brand-blue font-semibold">AI-powered</span> intelligence dashboard
                  </motion.p>
                </div>

                {/* Time Scrubber */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 }}
                  className="min-w-[400px]"
                >
                  <TimeScrubber
                    value={readingMode}
                    onChange={handleReadingModeChange}
                    stats={{
                      originalCount: allArticles.length,
                      shownCount: articles.length,
                      avgSentences: readingMode === '5m' ? 2 : readingMode === '15m' ? 4 : 6
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-9">
              {/* AI Intelligence Briefing Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="mb-12"
              >
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h2 className="font-cinzel text-3xl md:text-4xl font-bold text-text-dark">
                        AI Intelligence <span className="text-gradient-serenity">Briefing</span>
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-serenity-royal rounded-full animate-pulse"></div>
                        <span className="text-xs font-bold text-serenity-royal uppercase tracking-wider">LIVE</span>
                      </div>
                    </div>
                    <div className="h-1 w-32 bg-hero-text-gradient rounded-full"></div>
                  </div>
                </div>

                {/* Briefing Content */}
                <LiveIntelligenceBriefing
                  onFilterByTopic={(topic) => {
                    console.log('🎯 Filter by topic:', topic);
                    // TODO: Implement topic-based filtering
                    // Could search for topic.name in articles or filter by category
                  }}
                />
              </motion.div>

              {/* Personalization Strip */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.55, duration: 0.6 }}
                className="mb-8"
              >
                <PersonalizationStrip
                  onPreferencesChange={handlePreferencesChange}
                  activeInterest={activeInterest}
                  onInterestClick={handleInterestClick}
                />
              </motion.div>

              {/* Feed Controls Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="mb-8"
              >
                <div className="rounded-2xl p-6 border border-serenity-royal/10 shadow-lg glassmorphism-serenity-subtle hover-serenity-glow">
                  <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-text-dark mb-1">
                        Your Personalized Feed
                      </h3>
                      <p className="text-text-secondary text-sm flex items-center gap-2 flex-wrap">
                        Priority Algorithm:
                        <span className="inline-block px-3 py-1 rounded-full bg-brand-blue/10 text-brand-blue text-xs font-semibold uppercase tracking-wider">
                          {userProfile.industry}
                        </span>
                        •
                        <span className="text-brand-blue font-medium">
                          {readingMode === '5m' ? 'Quick Mode' : readingMode === '15m' ? 'Balanced Mode' : 'Deep Dive Mode'}
                        </span>
                      </p>
                    </div>

                    {/* Filter Buttons */}
                    <div className="flex items-center gap-3">
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('trending')}
                        className={`px-4 py-2 backdrop-blur-md rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          activeFilter === 'trending'
                            ? 'bg-brand-blue text-white shadow-md'
                            : 'bg-white/60 border border-white/40 text-text-secondary hover:text-brand-blue hover:border-brand-blue/50'
                        }`}
                      >
                        <FiTrendingUp />
                        Trending
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setActiveFilter('recent')}
                        className={`px-4 py-2 backdrop-blur-md rounded-lg text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                          activeFilter === 'recent'
                            ? 'bg-brand-blue text-white shadow-md'
                            : 'bg-white/60 border border-white/40 text-text-secondary hover:text-brand-blue hover:border-brand-blue/50'
                        }`}
                      >
                        <FiClock />
                        Recent
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-4 py-2 bg-white/60 backdrop-blur-md border border-white/40 rounded-lg text-sm font-medium text-text-secondary hover:text-brand-blue hover:border-brand-blue/50 transition-all duration-300"
                      >
                        <FiFilter />
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Articles Grid */}
              {loading ? (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      variants={cardVariants}
                      className="h-96 rounded-2xl animate-pulse"
                      style={{
                        background: 'rgba(255, 255, 255, 0.6)',
                        backdropFilter: 'blur(10px)'
                      }}
                    ></motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                  data-articles-section
                >
                  {articles.map((article) => (
                    <motion.div
                      key={article.id}
                      variants={cardVariants}
                      whileHover={{ y: -10, scale: 1.02 }}
                      transition={{ duration: 0.3 }}
                    >
                      <HolographicArticleCard
                        article={article}
                        readingMode={readingMode}
                        onClick={() => handleArticleClick(article)}
                      />
                    </motion.div>
                  ))}
                </motion.div>
              )}

              {/* Load More Button */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05, boxShadow: '0 20px 40px rgba(65, 105, 225, 0.3)' }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-4 bg-dashboard-hero text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2 mx-auto hover-gradient-shift"
                >
                  <FiActivity className="w-5 h-5" />
                  Load More Intelligence
                </motion.button>
              </motion.div>
            </div>

            {/* Right Panel - Sidebar Widgets */}
            <div className="lg:col-span-3">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="sticky top-24 space-y-6"
              >
                {/* AI Orb */}
                <AIOrb volatility={volatility} />

                {/* Stress Guard / Calm Mode */}
                <StressGuard
                  articles={articles}
                  onCalmModeChange={(enabled) => setCalmModeEnabled(enabled)}
                  onDecompressClick={() => console.log('Decompress: Filter low-stress stories')}
                />

                {/* Wellness Panel */}
                <RightPanelWellness
                  userStats={userStats}
                  globalVectors={globalVectors}
                />

                {/* Quick Stats Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="mt-6 rounded-2xl p-6 border border-serenity-royal/20 glassmorphism-serenity hover-serenity-glow"
                >
                  <h4 className="text-lg font-bold text-text-dark mb-4">Today's Activity</h4>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Articles Read</span>
                      <span className="text-lg font-bold text-gradient-serenity">
                        {userStats?.articlesReadToday || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Time Saved</span>
                      <span className="text-lg font-bold text-gradient-serenity">
                        {userStats?.timeSaved || 0}m
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-text-secondary">Focus Score</span>
                      <span className="text-lg font-bold text-gradient-serenity">
                        {userStats?.focusScore || 0}%
                      </span>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Focus Zen Mode Overlay */}
      {focusedArticle && (
        <FocusZenMode article={focusedArticle} onClose={closeFocusMode} />
      )}

      {/* Command Palette (⌘K) */}
      <CommandPalette
        isOpen={showCommandPalette}
        onClose={() => setShowCommandPalette(false)}
        onCommandExecute={(command) => {
          console.log('Command executed:', command);
          // Handle command execution here
        }}
      />

      {/* Footer Accent */}
      <div className="h-1 bg-dashboard-hero mt-12"></div>
    </div>
  );
};

export default ControlCenterPage;
