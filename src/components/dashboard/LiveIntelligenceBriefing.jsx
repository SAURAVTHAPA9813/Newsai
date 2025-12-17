import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiGlobe, FiTrendingUp, FiUser, FiRefreshCw, FiClock, FiDollarSign, FiCpu, FiHeart } from 'react-icons/fi';
import Icon from '../common/Icon';
import IconButton from '../common/IconButton';

const LiveIntelligenceBriefing = ({ briefing, loading }) => {
  const [activeMode, setActiveMode] = useState('Global');

  // Mode data - different AI lens for each tab
  const modeData = {
    Global: {
      icon: FiGlobe,
      color: 'from-brand-blue to-blue-600',
      globalSituation: briefing?.globalSituation || 'Markets stabilizing after Fed announcements. Geopolitical tensions remain elevated in Eastern Europe. Tech sector showing strong earnings.',
      globalDelta: briefing?.globalDelta || 'S&P 500 +1.2% on positive jobs data. Oil prices down 3% on demand concerns. Dollar strengthening against major currencies.',
      impactOnYou: briefing?.impactOnYou || {
        industry: 'General',
        region: 'Global',
        summary: 'Stable market conditions favor long-term investments. Rising interest rates may affect borrowing costs.',
        keyPoints: [
          'Consumer spending remains resilient despite inflation concerns',
          'Job market staying strong with unemployment at historic lows',
          'Supply chain disruptions easing across most sectors'
        ]
      }
    },
    Markets: {
      icon: FiDollarSign,
      color: 'from-green-500 to-green-600',
      globalSituation: 'Equity markets rallying on strong corporate earnings. Bond yields rising as Fed maintains hawkish stance. Crypto markets consolidating after recent volatility.',
      globalDelta: 'Nasdaq +2.1%, Dow +0.8%, Russell 2000 +1.5%. 10-year Treasury at 4.2%. Bitcoin stable at $43K, Ethereum up 3%.',
      impactOnYou: {
        industry: 'Finance',
        region: 'Global Markets',
        summary: 'Current conditions favor diversified portfolios. Tech stocks leading gains while defensive sectors lag.',
        keyPoints: [
          'FAANG stocks outperforming on AI enthusiasm and earnings beats',
          'Energy sector retreating on oversupply concerns and demand outlook',
          'Gold holding steady as inflation hedge despite stronger dollar'
        ]
      }
    },
    Tech: {
      icon: FiCpu,
      color: 'from-purple-500 to-purple-600',
      globalSituation: 'AI revolution accelerating across industries. Major tech layoffs continuing as companies restructure. Regulatory scrutiny intensifying for big tech platforms.',
      globalDelta: 'OpenAI announces GPT-5 timeline. Meta unveils new AR glasses. Apple expanding into healthcare AI. Microsoft cloud revenue up 25%.',
      impactOnYou: {
        industry: 'Technology',
        region: 'Tech Sector',
        summary: 'AI adoption creating new opportunities while automating traditional roles. Skills gap widening rapidly.',
        keyPoints: [
          'Generative AI tools now used by 65% of knowledge workers daily',
          'Cybersecurity jobs surging with 40% YoY growth in openings',
          'Remote work tech evolving with spatial computing and VR integrations'
        ]
      }
    },
    'My Life': {
      icon: FiHeart,
      color: 'from-pink-500 to-pink-600',
      globalSituation: briefing?.impactOnYou?.summary || 'Based on your interests and location, conditions are generally stable with some areas requiring attention.',
      globalDelta: 'Local weather: Sunny, 72°F. Traffic: Moderate delays on I-95. Air quality: Good (AQI 45). Energy prices: Stable.',
      impactOnYou: {
        industry: briefing?.impactOnYou?.industry || 'Your Industry',
        region: briefing?.impactOnYou?.region || 'Your Region',
        summary: briefing?.impactOnYou?.summary || 'Personalized insights based on your profile, location, and interests.',
        keyPoints: briefing?.impactOnYou?.keyPoints || [
          'Grocery prices stabilizing in your area after recent inflation',
          'Local job market showing strength in your industry sector',
          'Housing inventory increasing, potentially cooling price growth'
        ]
      }
    }
  };

  const currentMode = modeData[activeMode];

  if (loading) {
    return (
      <div className="mb-12">
        <div
          className="h-64 rounded-3xl animate-pulse"
          style={{
            background: 'rgba(255, 255, 255, 0.6)',
            backdropFilter: 'blur(10px)'
          }}
        ></div>
      </div>
    );
  }

  const { trendingTopics } = briefing || {};

  // Get current time for "Updated" badge
  const currentTime = new Date().toLocaleTimeString('en-US', {
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
        className="rounded-3xl border-l-4 border-serenity-royal shadow-xl overflow-hidden card-gradient-faq hover-serenity-glow"
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

            <div className="flex items-center gap-3">
              {/* Mode Tabs */}
              <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white/40">
                {Object.keys(modeData).map((mode) => {
                  const ModeIcon = modeData[mode].icon;
                  const isActive = activeMode === mode;

                  return (
                    <motion.button
                      key={mode}
                      onClick={() => setActiveMode(mode)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`relative px-3 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        isActive
                          ? 'text-serenity-royal'
                          : 'text-text-secondary hover:text-serenity-royal'
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
                      <Icon
                        icon={ModeIcon}
                        size="xs"
                        className="relative z-10 text-white"
                        decorative
                      />
                      <span className="relative z-10">{mode}</span>
                    </motion.button>
                  );
                })}
              </div>

              {/* Updated Time Badge */}
              <div className="px-4 py-1.5 rounded-full bg-serenity-royal/10 flex items-center gap-2">
                <Icon
                  icon={FiClock}
                  size="xs"
                  className="text-white"
                  decorative
                />
                <span className="text-xs font-semibold text-serenity-royal uppercase tracking-wider">
                  UPDATED: {currentTime}
                </span>
              </div>

              {/* Refresh Button */}
              <motion.button
                whileHover={{ scale: 1.05, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 rounded-lg bg-white/60 border border-white/40 text-text-secondary hover:text-serenity-royal hover:border-serenity-royal/50 transition-all duration-300"
                aria-label="Refresh intelligence briefing"
              >
                <Icon
                  icon={FiRefreshCw}
                  size="sm"
                  className="text-white"
                  decorative
                />
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
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${currentMode.color} flex items-center justify-center`}>
                    <Icon
                      icon={currentMode.icon}
                      size="sm"
                      className="text-white"
                      decorative
                    />
                  </div>
                  <h3 className="font-bold text-base text-text-dark">
                    {activeMode === 'My Life' ? 'Your Situation' : 'Global Situation'}
                  </h3>
                </div>
                <p className="text-base text-text-secondary leading-relaxed ml-10">
                  {currentMode.globalSituation}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-serenity-royal/20 to-transparent"></div>

              {/* Global Delta */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Icon
                      icon={FiTrendingUp}
                      size="sm"
                      className="text-white"
                      decorative
                    />
                  </div>
                  <h3 className="font-bold text-base text-text-dark">
                    {activeMode === 'My Life' ? 'Local Delta (24h)' : 'Global Delta (24h)'}
                  </h3>
                </div>
                <p className="text-base text-text-secondary leading-relaxed ml-10">
                  {currentMode.globalDelta}
                </p>
              </div>

              {/* Divider */}
              <div className="h-px bg-gradient-to-r from-transparent via-serenity-royal/20 to-transparent"></div>

              {/* Impact on You */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
                    <Icon
                      icon={FiUser}
                      size="sm"
                      className="text-white"
                      decorative
                    />
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-text-dark">Impact on You</h3>
                    <p className="text-xs text-text-secondary">
                      {currentMode.impactOnYou.industry} • {currentMode.impactOnYou.region}
                    </p>
                  </div>
                </div>
                <div className="ml-10">
                  <p className="text-base text-text-secondary leading-relaxed mb-3">
                    {currentMode.impactOnYou.summary}
                  </p>
                  {currentMode.impactOnYou.keyPoints && currentMode.impactOnYou.keyPoints.length > 0 && (
                    <div className="space-y-2">
                      {currentMode.impactOnYou.keyPoints.slice(0, 3).map((point, index) => (
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
        </div>
      </motion.div>
    </div>
  );
};

export default LiveIntelligenceBriefing;
