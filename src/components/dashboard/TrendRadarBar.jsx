import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiCircle, FiSettings, FiPause, FiPlay, FiArrowUp, FiArrowDown, FiTrendingUp, FiDollarSign, FiActivity } from 'react-icons/fi';

const TrendRadarBar = ({ trends = [], onTopicClick, marketData = {} }) => {
  const [isPaused, setIsPaused] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Default trending topics if none provided
  const defaultTrends = [
    { name: 'Federal Reserve', change: 245, category: 'economy' },
    { name: 'AI Healthcare', change: 189, category: 'tech' },
    { name: 'Tech Layoffs', change: 92, category: 'tech' },
    { name: 'Climate Policy', change: 45, category: 'environment' },
    { name: 'Crypto Regulation', change: -12, category: 'crypto' },
    { name: 'EV Market', change: 178, category: 'auto' }
  ];

  const trendData = trends.length > 0 ? trends : defaultTrends;

  // Default market data
  const defaultMarketData = {
    sp500: { value: 4235, change: 0.8 },
    btc: { value: 43200, change: 2.1 },
    vix: { value: 18.2, change: -0.5 }
  };

  const market = { ...defaultMarketData, ...marketData };

  // Get heat bar segments based on change percentage
  const getHeatBars = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 200) return 5;
    if (absChange >= 150) return 4;
    if (absChange >= 100) return 3;
    if (absChange >= 50) return 2;
    return 1;
  };

  // Get color based on intensity
  const getColor = (change) => {
    const absChange = Math.abs(change);
    if (absChange >= 200) return 'from-pink-500 to-sky-500';
    if (absChange >= 150) return 'from-sky-500 to-blue-500';
    if (absChange >= 100) return 'from-blue-500 to-cyan-500';
    if (absChange >= 50) return 'from-cyan-500 to-teal-500';
    return 'from-teal-500 to-green-500';
  };

  const handleTopicClick = (topic) => {
    if (onTopicClick) {
      onTopicClick(topic);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="rounded-2xl overflow-hidden border border-serenity-royal/20 shadow-xl glassmorphism-serenity hover-serenity-glow"
    >
      {/* Header */}
      <div className="px-6 py-3 border-b border-serenity-royal/10 bg-gradient-to-r from-serenity-royal/5 to-serenity-light/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{
                scale: [1, 1.2, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity
              }}
            >
              <FiCircle className="w-3 h-3 text-red-500 fill-current" />
            </motion.div>
            <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4" />
              LIVE TREND RADAR
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-text-secondary">
              Auto-scroll: <span className={autoScroll ? 'text-green-600 font-semibold' : 'text-gray-400'}>
                {autoScroll ? 'ON' : 'OFF'}
              </span>
            </span>
            <button
              onClick={() => setAutoScroll(!autoScroll)}
              className="p-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors"
            >
              {isPaused ? <FiPlay className="w-3 h-3 text-brand-blue" /> : <FiPause className="w-3 h-3 text-brand-blue" />}
            </button>
            <button className="p-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors">
              <FiSettings className="w-3 h-3 text-text-secondary" />
            </button>
          </div>
        </div>
      </div>

      {/* Scrolling Content */}
      <div
        className="relative overflow-hidden py-4"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div
          animate={{
            x: autoScroll && !isPaused ? [0, -2000] : 0
          }}
          transition={{
            x: {
              duration: 60,
              repeat: Infinity,
              ease: 'linear'
            }
          }}
          className="flex items-center gap-6 px-6"
        >
          {/* Trending Topics */}
          {[...trendData, ...trendData].map((topic, index) => {
            const heatBars = getHeatBars(topic.change);
            const colorClass = getColor(topic.change);
            const isNegative = topic.change < 0;

            return (
              <motion.button
                key={`${topic.name}-${index}`}
                onClick={() => handleTopicClick(topic)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0 px-4 py-2 rounded-xl bg-white/80 backdrop-blur-sm border border-brand-blue/20 hover:border-brand-blue/50 transition-all shadow-sm hover:shadow-md cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  {/* Topic Name */}
                  <span className="text-sm font-bold text-text-dark whitespace-nowrap">
                    {topic.name}
                  </span>

                  {/* Heat Bars */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-4 rounded-sm ${
                          i < heatBars
                            ? `bg-gradient-to-t ${colorClass}`
                            : 'bg-gray-200'
                        } ${i < heatBars ? 'shadow-lg' : ''}`}
                        style={{
                          boxShadow: i < heatBars ? '0 0 8px currentColor' : 'none'
                        }}
                      />
                    ))}
                  </div>

                  {/* Change Percentage */}
                  <div className={`flex items-center gap-1 ${isNegative ? 'text-red-600' : 'text-green-600'}`}>
                    {isNegative ? (
                      <FiArrowDown className="w-3 h-3" />
                    ) : (
                      <FiArrowUp className="w-3 h-3" />
                    )}
                    <span className="text-xs font-bold">
                      {Math.abs(topic.change)}%
                    </span>
                  </div>
                </div>
              </motion.button>
            );
          })}

          {/* Market Data Indicators */}
          <div className="flex-shrink-0 flex items-center gap-4 px-4 py-2 rounded-xl bg-gradient-to-r from-blue-500/10 to-sky-500/10 border border-blue-500/20">
            {/* S&P 500 */}
            <div className="flex items-center gap-2">
              <FiTrendingUp className="w-4 h-4 text-blue-600" />
              <div className="text-xs">
                <span className="font-semibold text-text-dark">S&P 500:</span>
                <span className="ml-1 text-text-dark">{market.sp500.value.toLocaleString()}</span>
                <span className={`ml-1 ${market.sp500.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({market.sp500.change >= 0 ? '+' : ''}{market.sp500.change}%)
                </span>
              </div>
            </div>

            {/* BTC */}
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-4 h-4 text-orange-500" />
              <div className="text-xs">
                <span className="font-semibold text-text-dark">BTC:</span>
                <span className="ml-1 text-text-dark">${market.btc.value.toLocaleString()}</span>
                <span className={`ml-1 ${market.btc.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ({market.btc.change >= 0 ? '+' : ''}{market.btc.change}%)
                </span>
              </div>
            </div>

            {/* VIX */}
            <div className="flex items-center gap-2">
              <FiActivity className="w-4 h-4 text-sky-600" />
              <div className="text-xs">
                <span className="font-semibold text-text-dark">VIX:</span>
                <span className="ml-1 text-text-dark">{market.vix.value}</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Gradient Fade Edges */}
        <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/80 to-transparent pointer-events-none"></div>
        <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/80 to-transparent pointer-events-none"></div>
      </div>

      {/* System Alerts (Optional) */}
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        className="border-t border-brand-blue/10 px-6 py-2 bg-gradient-to-r from-amber-50 to-yellow-50"
      >
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          >
            <FiActivity className="w-4 h-4 text-amber-600" />
          </motion.div>
          <p className="text-xs text-amber-900">
            <span className="font-bold">ALERT:</span> Fed announces rate hold • 2 min ago
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default TrendRadarBar;
