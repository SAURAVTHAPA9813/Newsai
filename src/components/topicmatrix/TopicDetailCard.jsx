import { motion } from 'framer-motion';
import { FiTrendingUp, FiActivity, FiCheckCircle, FiShield } from 'react-icons/fi';

const TopicDetailCard = ({ topic, preferences, onPreferencesChange }) => {
  if (!topic) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="rounded-3xl border border-brand-blue/20 p-6"
        style={{
          background: 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
        }}
      >
        <p className="text-sm text-text-secondary text-center py-8">
          Select a topic to view details
        </p>
      </motion.div>
    );
  }

  const prefs = preferences || {
    priorityOverride: topic.priority,
    feedPreferences: {
      showMore: false,
      onlyHighCredibility: false,
      includeExplainers: false
    }
  };

  const handlePriorityChange = (value) => {
    onPreferencesChange({
      ...prefs,
      topicId: topic.id,
      priorityOverride: parseInt(value)
    });
  };

  const handleFeedPreferenceToggle = (key) => {
    onPreferencesChange({
      ...prefs,
      topicId: topic.id,
      feedPreferences: {
        ...prefs.feedPreferences,
        [key]: !prefs.feedPreferences[key]
      }
    });
  };

  return (
    <motion.div
      key={topic.id}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-3xl border border-brand-blue/20 p-6 space-y-5"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      {/* Topic Header */}
      <div>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h2 className="text-xl font-bold text-text-dark">{topic.name}</h2>
          {topic.firewallStatus !== 'ALLOWED' && (
            <FiShield className="text-lg text-brand-blue" title={`Firewall: ${topic.firewallStatus}`} />
          )}
        </div>
        <div className="flex flex-wrap gap-2 mb-3">
          {topic.categories.map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 rounded text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20"
            >
              {cat}
            </span>
          ))}
        </div>
        <p className="text-sm text-text-dark leading-relaxed">{topic.description}</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-white/60 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <FiTrendingUp className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-text-secondary uppercase">Trending</span>
          </div>
          <div className="text-lg font-bold text-green-600">+{topic.trendScore}%</div>
        </div>
        <div className="p-3 rounded-lg bg-white/60 border border-gray-200">
          <div className="flex items-center gap-2 mb-1">
            <FiActivity className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-text-secondary uppercase">Mentions</span>
          </div>
          <div className="text-lg font-bold text-text-dark">{topic.stats.mentions7d}</div>
        </div>
      </div>

      {/* Priority Slider */}
      <div>
        <label className="flex items-center justify-between text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
          <span>Priority</span>
          <span className="text-brand-blue">{prefs.priorityOverride || topic.priority}</span>
        </label>
        <input
          type="range"
          min="0"
          max="100"
          value={prefs.priorityOverride || topic.priority}
          onChange={(e) => handlePriorityChange(e.target.value)}
          className="w-full h-2 rounded-lg appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, #4169E1 0%, #4169E1 ${prefs.priorityOverride || topic.priority}%, #E5E7EB ${prefs.priorityOverride || topic.priority}%, #E5E7EB 100%)`
          }}
        />
        <p className="text-xs text-text-secondary mt-2">
          Adjusts how often this topic appears in your feed
        </p>
      </div>

      {/* Feed Preferences */}
      <div>
        <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 block">
          Feed Preferences
        </label>
        <div className="space-y-2">
          <motion.button
            onClick={() => handleFeedPreferenceToggle('showMore')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              prefs.feedPreferences.showMore
                ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue'
                : 'bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50'
            }`}
          >
            <FiCheckCircle
              className={`w-4 h-4 ${prefs.feedPreferences.showMore ? 'text-brand-blue' : 'text-gray-400'}`}
            />
            <span>Show more updates like this</span>
          </motion.button>

          <motion.button
            onClick={() => handleFeedPreferenceToggle('onlyHighCredibility')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              prefs.feedPreferences.onlyHighCredibility
                ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue'
                : 'bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50'
            }`}
          >
            <FiCheckCircle
              className={`w-4 h-4 ${prefs.feedPreferences.onlyHighCredibility ? 'text-brand-blue' : 'text-gray-400'}`}
            />
            <span>Only high-credibility sources</span>
          </motion.button>

          <motion.button
            onClick={() => handleFeedPreferenceToggle('includeExplainers')}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
              prefs.feedPreferences.includeExplainers
                ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue'
                : 'bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50'
            }`}
          >
            <FiCheckCircle
              className={`w-4 h-4 ${prefs.feedPreferences.includeExplainers ? 'text-brand-blue' : 'text-gray-400'}`}
            />
            <span>Include long explainer articles</span>
          </motion.button>
        </div>
      </div>

      {/* Credibility Badge */}
      <div className="p-3 rounded-lg bg-blue-50/80 border border-blue-300">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-blue-900 uppercase">Avg Credibility</span>
          <span className="text-lg font-bold text-blue-700">{topic.stats.avgCredibility}/100</span>
        </div>
      </div>
    </motion.div>
  );
};

export default TopicDetailCard;
