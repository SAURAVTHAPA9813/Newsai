import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiWind, FiEye, FiEyeOff, FiFilter } from 'react-icons/fi';

const StressGuard = ({ articles = [], onCalmModeChange, onDecompressClick }) => {
  const [calmModeEnabled, setCalmModeEnabled] = useState(false);
  const [newsStressLevel, setNewsStressLevel] = useState(0);

  // Calculate news stress level based on article anxiety scores
  useEffect(() => {
    if (!articles || articles.length === 0) {
      setNewsStressLevel(0);
      return;
    }

    const totalAnxiety = articles.reduce((sum, article) => sum + (article.anxietyScore || 0), 0);
    const averageAnxiety = totalAnxiety / articles.length;
    // Convert 0-100 anxiety score to 0-10 stress level
    const stressLevel = Math.round((averageAnxiety / 100) * 10);
    setNewsStressLevel(stressLevel);
  }, [articles]);

  const handleToggle = () => {
    const newValue = !calmModeEnabled;
    setCalmModeEnabled(newValue);
    if (onCalmModeChange) {
      onCalmModeChange(newValue);
    }
  };

  const handleDecompress = () => {
    if (onDecompressClick) {
      onDecompressClick();
    }
  };

  // Get stress level color
  const getStressColor = (level) => {
    if (level <= 3) return { bg: 'from-green-500 to-green-600', text: 'text-green-600', ring: 'ring-green-500' };
    if (level <= 6) return { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600', ring: 'ring-yellow-500' };
    if (level <= 8) return { bg: 'from-orange-500 to-orange-600', text: 'text-orange-600', ring: 'ring-orange-500' };
    return { bg: 'from-red-500 to-red-600', text: 'text-red-600', ring: 'ring-red-500' };
  };

  const stressColors = getStressColor(newsStressLevel);

  return (
    <div className="space-y-4">
      {/* Calm Mode Toggle */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between p-4 rounded-2xl border border-brand-blue/20 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
            <FiWind className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-text-dark">Calm Mode</h3>
            <p className="text-xs text-text-secondary">
              {calmModeEnabled ? 'Protecting your peace' : 'Monitor all content'}
            </p>
          </div>
        </div>

        {/* Toggle Switch */}
        <motion.button
          onClick={handleToggle}
          className={`relative w-14 h-7 rounded-full transition-colors ${
            calmModeEnabled ? 'bg-gradient-to-r from-blue-500 to-purple-600' : 'bg-gray-300'
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ x: calmModeEnabled ? 28 : 2 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
          >
            {calmModeEnabled ? (
              <FiEyeOff className="w-3 h-3 text-brand-blue" />
            ) : (
              <FiEye className="w-3 h-3 text-gray-500" />
            )}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* Stress Level Indicator - Only show when Calm Mode is ON */}
      <AnimatePresence>
        {calmModeEnabled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="p-4 rounded-2xl border border-brand-blue/20 shadow-lg space-y-4"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Stress Level Label */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-text-dark">News Stress Level</span>
                  <motion.div
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 1, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity
                    }}
                    className={`w-2 h-2 rounded-full ${stressColors.ring} ring-2 ring-opacity-50`}
                    style={{ backgroundColor: stressColors.ring.replace('ring-', '') }}
                  />
                </div>
                <span className={`text-2xl font-bold ${stressColors.text}`}>
                  {newsStressLevel}/10
                </span>
              </div>

              {/* Stress Bar */}
              <div className="space-y-2">
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${newsStressLevel * 10}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`h-full bg-gradient-to-r ${stressColors.bg} relative`}
                  >
                    {/* Animated shimmer effect */}
                    <motion.div
                      animate={{
                        x: ['-100%', '200%']
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'linear'
                      }}
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    />
                  </motion.div>
                </div>

                {/* Stress Level Labels */}
                <div className="flex justify-between text-xs text-text-secondary">
                  <span>Calm</span>
                  <span>Moderate</span>
                  <span>High</span>
                </div>
              </div>

              {/* Decompress Button */}
              <motion.button
                onClick={handleDecompress}
                whileHover={{ scale: 1.02, y: -2 }}
                whileTap={{ scale: 0.98 }}
                className="w-full px-4 py-3 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold text-sm shadow-lg flex items-center justify-center gap-2 transition-all hover:shadow-xl"
              >
                <FiFilter className="w-4 h-4" />
                <span>Decompress - Show Low-Stress Stories Only</span>
              </motion.button>

              {/* Info Text */}
              <div className="pt-3 border-t border-brand-blue/10">
                <p className="text-xs text-text-secondary leading-relaxed">
                  <span className="font-semibold text-text-dark">How it works:</span> High-anxiety articles (70+ stress score) will appear blurred. Hover to reveal. Use Decompress to filter them out completely.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur Overlay Helper Component - Export for use in article cards */}
    </div>
  );
};

// Export blur overlay component for article cards
export const AnxietyBlurOverlay = ({ anxietyScore, calmModeEnabled, children }) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const shouldBlur = calmModeEnabled && anxietyScore > 70 && !isRevealed;

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsRevealed(true)}
      onMouseLeave={() => setIsRevealed(false)}
    >
      {children}

      {/* Blur Overlay */}
      <AnimatePresence>
        {shouldBlur && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 rounded-3xl backdrop-blur-md bg-white/60 flex items-center justify-center cursor-pointer z-20"
            style={{
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)'
            }}
          >
            <div className="text-center p-6">
              <div className="mb-3">
                <FiEyeOff className="w-12 h-12 text-brand-blue mx-auto" />
              </div>
              <h4 className="text-lg font-bold text-text-dark mb-2">High-Stress Content</h4>
              <p className="text-sm text-text-secondary mb-4">
                This article may contain stressful or anxiety-inducing content
              </p>
              <div className="px-4 py-2 bg-brand-blue/10 rounded-lg inline-block">
                <p className="text-xs font-semibold text-brand-blue">
                  Hover to reveal • Anxiety Score: {anxietyScore}/100
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StressGuard;
