import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiBriefcase,
  FiCpu,
  FiActivity,
  FiTrendingUp,
  FiGlobe,
  FiMapPin,
  FiEdit3,
  FiCheck,
  FiX,
  FiPlus,
  FiSettings
} from 'react-icons/fi';

const PersonalizationStrip = ({ onPreferencesChange }) => {
  const [selectedIndustries, setSelectedIndustries] = useState(['Tech', 'Finance']);
  const [location, setLocation] = useState('New York, NY');
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [showTeachAI, setShowTeachAI] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({
    readingLevel: 'intermediate',
    storyLength: 'medium',
    tonePreference: 'balanced'
  });

  // Available industry options
  const industryOptions = [
    { id: 'finance', label: 'Finance', icon: FiBriefcase, color: 'from-blue-500 to-blue-600' },
    { id: 'tech', label: 'Tech', icon: FiCpu, color: 'from-purple-500 to-purple-600' },
    { id: 'healthcare', label: 'Healthcare', icon: FiActivity, color: 'from-green-500 to-green-600' },
    { id: 'markets', label: 'Markets', icon: FiTrendingUp, color: 'from-orange-500 to-orange-600' },
    { id: 'global', label: 'Global', icon: FiGlobe, color: 'from-pink-500 to-pink-600' }
  ];

  const toggleIndustry = (industryLabel) => {
    setSelectedIndustries((prev) => {
      const newSelection = prev.includes(industryLabel)
        ? prev.filter((i) => i !== industryLabel)
        : [...prev, industryLabel];

      if (onPreferencesChange) {
        onPreferencesChange({ type: 'industries', value: newSelection });
      }

      return newSelection;
    });
  };

  const handleLocationSave = () => {
    setLocation(tempLocation);
    setIsEditingLocation(false);

    if (onPreferencesChange) {
      onPreferencesChange({ type: 'location', value: tempLocation });
    }
  };

  const handleLocationCancel = () => {
    setTempLocation(location);
    setIsEditingLocation(false);
  };

  const handleAIPreferenceChange = (key, value) => {
    const newPreferences = { ...aiPreferences, [key]: value };
    setAiPreferences(newPreferences);

    if (onPreferencesChange) {
      onPreferencesChange({ type: 'aiPreferences', value: newPreferences });
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Personalization Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl border border-brand-blue/20 shadow-lg"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex flex-wrap items-center gap-4">
          {/* Industry Chips */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Interests:
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {industryOptions.map((industry) => {
                const IndustryIcon = industry.icon;
                const isSelected = selectedIndustries.includes(industry.label);

                return (
                  <motion.button
                    key={industry.id}
                    onClick={() => toggleIndustry(industry.label)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isSelected
                        ? `text-white shadow-lg bg-gradient-to-r ${industry.color}`
                        : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                    }`}
                  >
                    <IndustryIcon className="w-4 h-4" />
                    <span>{industry.label}</span>
                    {isSelected && <FiCheck className="w-3 h-3" />}
                  </motion.button>
                );
              })}

              {/* Add More Button */}
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-semibold bg-white/60 text-text-secondary border border-dashed border-brand-blue/40 hover:border-brand-blue transition-all"
              >
                <FiPlus className="w-4 h-4" />
                <span>Add</span>
              </motion.button>
            </div>
          </div>

          {/* Divider */}
          <div className="h-8 w-px bg-brand-blue/20"></div>

          {/* Location */}
          <div className="flex items-center gap-2">
            <FiMapPin className="w-4 h-4 text-brand-blue" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
              Location:
            </span>

            {isEditingLocation ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={tempLocation}
                  onChange={(e) => setTempLocation(e.target.value)}
                  className="px-3 py-1.5 rounded-lg bg-white/60 border border-brand-blue/30 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/50"
                  autoFocus
                />
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLocationSave}
                  className="p-1.5 rounded-lg bg-green-500 text-white"
                >
                  <FiCheck className="w-4 h-4" />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLocationCancel}
                  className="p-1.5 rounded-lg bg-gray-300 text-text-dark"
                >
                  <FiX className="w-4 h-4" />
                </motion.button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-text-dark">{location}</span>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsEditingLocation(true)}
                  className="p-1.5 rounded-lg bg-white/60 hover:bg-white transition-colors"
                >
                  <FiEdit3 className="w-3 h-3 text-brand-blue" />
                </motion.button>
              </div>
            )}
          </div>

          {/* Spacer */}
          <div className="flex-1"></div>

          {/* Teach AI Button */}
          <motion.button
            onClick={() => setShowTeachAI(!showTeachAI)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-purple-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
          >
            <FiSettings className="w-4 h-4" />
            <span>Teach AI</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Teach AI Panel */}
      <AnimatePresence>
        {showTeachAI && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div
              className="p-6 rounded-2xl border border-brand-blue/20 shadow-lg space-y-6"
              style={{
                background: 'rgba(255, 255, 255, 0.8)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-text-dark mb-1">Teach AI Your Preferences</h3>
                  <p className="text-sm text-text-secondary">
                    Help us personalize your news experience
                  </p>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowTeachAI(false)}
                  className="p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
                >
                  <FiX className="w-5 h-5 text-text-secondary" />
                </motion.button>
              </div>

              {/* Preference Options */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Reading Level */}
                <div>
                  <label className="text-sm font-semibold text-text-dark mb-3 block">
                    Reading Level
                  </label>
                  <div className="space-y-2">
                    {['Simple', 'Intermediate', 'Expert'].map((level) => (
                      <button
                        key={level}
                        onClick={() => handleAIPreferenceChange('readingLevel', level.toLowerCase())}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          aiPreferences.readingLevel === level.toLowerCase()
                            ? 'bg-gradient-to-r from-brand-blue to-purple-600 text-white shadow-md'
                            : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Story Length */}
                <div>
                  <label className="text-sm font-semibold text-text-dark mb-3 block">
                    Story Length
                  </label>
                  <div className="space-y-2">
                    {['Short', 'Medium', 'Detailed'].map((length) => (
                      <button
                        key={length}
                        onClick={() => handleAIPreferenceChange('storyLength', length.toLowerCase())}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          aiPreferences.storyLength === length.toLowerCase()
                            ? 'bg-gradient-to-r from-brand-blue to-purple-600 text-white shadow-md'
                            : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                        }`}
                      >
                        {length}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tone Preference */}
                <div>
                  <label className="text-sm font-semibold text-text-dark mb-3 block">
                    Tone Preference
                  </label>
                  <div className="space-y-2">
                    {['Optimistic', 'Balanced', 'Critical'].map((tone) => (
                      <button
                        key={tone}
                        onClick={() => handleAIPreferenceChange('tonePreference', tone.toLowerCase())}
                        className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          aiPreferences.tonePreference === tone.toLowerCase()
                            ? 'bg-gradient-to-r from-brand-blue to-purple-600 text-white shadow-md'
                            : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                        }`}
                      >
                        {tone}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-4 border-t border-brand-blue/10">
                <p className="text-xs text-text-secondary">
                  Your preferences are saved automatically and used to personalize your news feed in real-time.
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PersonalizationStrip;
