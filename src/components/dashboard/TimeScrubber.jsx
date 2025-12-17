import { motion } from 'framer-motion';
import { FiClock, FiZap } from 'react-icons/fi';

const TimeScrubber = ({ value = '15m', onChange, stats = {} }) => {
  const presets = ['5m', '15m', '30m'];
  const presetIndex = presets.indexOf(value);

  // Default stats if none provided
  const defaultStats = {
    originalCount: 42,
    shownCount: 12,
    avgSentences: 4
  };

  const currentStats = { ...defaultStats, ...stats };

  const handlePresetClick = (preset) => {
    if (onChange) {
      onChange(preset);
    }
  };

  // Get focus options based on current preset
  const getFocusDescription = () => {
    switch (value) {
      case '5m':
        return { title: 'Headlines Only', sentences: '1-2 sentences', stories: '6-8 stories' };
      case '15m':
        return { title: 'Key Facts', sentences: '3-4 sentences', stories: '10-15 stories' };
      case '30m':
        return { title: 'Stories + Context', sentences: '5-6 sentences', stories: 'up to 20 stories' };
      default:
        return { title: 'Key Facts', sentences: '3-4 sentences', stories: '10-15 stories' };
    }
  };

  const focusInfo = getFocusDescription();

  return (
    <div className="space-y-4">
      {/* Time Dilation Label */}
      <div className="flex items-center gap-2">
        <FiZap className="w-4 h-4 text-brand-blue" />
        <span className="text-sm font-bold text-text-dark uppercase tracking-wider">
          Time Dilation
        </span>
      </div>

      {/* Scrubber Container */}
      <div
        className="relative px-6 py-4 rounded-2xl border border-brand-blue/20 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        {/* Preset Labels (Top) */}
        <div className="flex justify-between mb-4 px-2">
          {presets.map((preset, index) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className={`text-xs font-semibold transition-all ${
                preset === value
                  ? 'text-brand-blue'
                  : 'text-text-secondary hover:text-brand-blue'
              }`}
            >
              {preset}
            </button>
          ))}
        </div>

        {/* Track Container */}
        <div className="relative h-2 bg-gray-200 rounded-full overflow-hidden">
          {/* Active Track Gradient */}
          <motion.div
            className="absolute inset-y-0 left-0 bg-gradient-to-r from-brand-blue to-purple-500 rounded-full"
            initial={false}
            animate={{
              width: `${((presetIndex + 1) / presets.length) * 100}%`
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 30
            }}
            style={{
              boxShadow: '0 0 20px rgba(65, 105, 225, 0.5)'
            }}
          />

          {/* Preset Markers */}
          {presets.map((preset, index) => (
            <div
              key={preset}
              className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-gray-300 transition-all"
              style={{
                left: `${(index / (presets.length - 1)) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
            />
          ))}
        </div>

        {/* Glowing Capsule */}
        <motion.div
          className="absolute top-1/2 w-16 h-8 -mt-4 pointer-events-none"
          initial={false}
          animate={{
            left: `${(presetIndex / (presets.length - 1)) * 100}%`
          }}
          transition={{
            type: 'spring',
            stiffness: 300,
            damping: 30
          }}
          style={{
            transform: 'translateX(-50%)'
          }}
        >
          <motion.div
            className="w-full h-full rounded-full bg-gradient-to-r from-brand-blue to-purple-600 opacity-30 blur-md"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3]
            }}
            transition={{
              duration: 2,
              repeat: Infinity
            }}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-brand-blue to-purple-600 shadow-lg flex items-center justify-center">
            <FiClock className="w-4 h-4 text-white" />
          </div>
        </motion.div>

        {/* Click Areas for Presets */}
        <div className="absolute inset-x-0 top-0 bottom-0 flex">
          {presets.map((preset, index) => (
            <button
              key={preset}
              onClick={() => handlePresetClick(preset)}
              className="flex-1 cursor-pointer"
              aria-label={`Set time to ${preset}`}
            />
          ))}
        </div>
      </div>

      {/* Stats Feedback */}
      <motion.div
        key={`${value}-${currentStats.shownCount}`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 py-3 rounded-xl bg-gradient-to-r from-blue-50 to-purple-50 border border-brand-blue/10"
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-brand-blue/10">
            <FiZap className="w-4 h-4 text-brand-blue" />
          </div>
          <div className="flex-1 text-xs space-y-1">
            <p className="text-text-dark font-semibold">
              Compressed from {currentStats.originalCount} → {currentStats.shownCount} stories for you
            </p>
            <p className="text-text-secondary">
              Showing {focusInfo.sentences} per story • {focusInfo.stories}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Focus Mode Toggle */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <FiClock className="w-3 h-3 text-text-secondary" />
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
            Focus Mode
          </span>
        </div>

        <div className="flex gap-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              value === '5m'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
            }`}
            onClick={() => handlePresetClick('5m')}
          >
            Headlines Only
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              value === '15m'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
            }`}
            onClick={() => handlePresetClick('15m')}
          >
            Key Facts
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
              value === '30m'
                ? 'bg-brand-blue text-white shadow-md'
                : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
            }`}
            onClick={() => handlePresetClick('30m')}
          >
            Stories + Context
          </motion.button>
        </div>
      </div>
    </div>
  );
};

export default TimeScrubber;
