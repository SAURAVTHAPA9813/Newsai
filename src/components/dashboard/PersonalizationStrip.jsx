import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  FiSettings,
} from "react-icons/fi";

const PersonalizationStrip = ({
  onPreferencesChange,
  activeInterest,
  onInterestClick,
}) => {
  const [selectedIndustries, setSelectedIndustries] = useState([
    "Tech",
    "Finance",
  ]);
  const [location, setLocation] = useState("New York, NY");
  const [isEditingLocation, setIsEditingLocation] = useState(false);
  const [tempLocation, setTempLocation] = useState(location);
  const [showTeachAI, setShowTeachAI] = useState(false);
  const [aiPreferences, setAiPreferences] = useState({
    readingLevel: "intermediate",
    storyLength: "medium",
    tonePreference: "balanced",
  });

  // Available industry options
  const industryOptions = [
    {
      id: "finance",
      label: "Finance",
      icon: FiBriefcase,
      color: "from-blue-500 to-blue-600",
    },
    {
      id: "tech",
      label: "Tech",
      icon: FiCpu,
      color: "from-sky-500 to-sky-600",
    },
    {
      id: "healthcare",
      label: "Healthcare",
      icon: FiActivity,
      color: "from-green-500 to-green-600",
    },
    {
      id: "markets",
      label: "Markets",
      icon: FiTrendingUp,
      color: "from-orange-500 to-orange-600",
    },
    {
      id: "global",
      label: "Global",
      icon: FiGlobe,
      color: "from-pink-500 to-pink-600",
    },
  ];

  const handleIndustryClick = (industryLabel) => {
    // If onInterestClick is provided (for filtering), use it
    if (onInterestClick) {
      onInterestClick(industryLabel);
    } else {
      // Otherwise, use the original toggle behavior for multi-select
      toggleIndustry(industryLabel);
    }
  };

  const toggleIndustry = (industryLabel) => {
    setSelectedIndustries((prev) => {
      const newSelection = prev.includes(industryLabel)
        ? prev.filter((i) => i !== industryLabel)
        : [...prev, industryLabel];

      if (onPreferencesChange) {
        onPreferencesChange({ type: "industries", value: newSelection });
      }

      return newSelection;
    });
  };

  const handleLocationSave = () => {
    setLocation(tempLocation);
    setIsEditingLocation(false);

    if (onPreferencesChange) {
      onPreferencesChange({ type: "location", value: tempLocation });
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
      onPreferencesChange({ type: "aiPreferences", value: newPreferences });
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
          background: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
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
                const isActive = activeInterest === industry.label;
                const isSelected = selectedIndustries.includes(industry.label);

                return (
                  <motion.button
                    key={industry.id}
                    onClick={() => handleIndustryClick(industry.label)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                      isActive
                        ? `text-white shadow-xl bg-gradient-to-r ${
                            industry.color
                          } ring-4 ring-${industry.color.split("-")[1]}-300/50`
                        : "bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50 hover:shadow-md"
                    }`}
                  >
                    <IndustryIcon className="w-4 h-4" />
                    <span>{industry.label}</span>
                    {isActive && (
                      <>
                        <FiCheck className="w-3 h-3" />
                      </>
                    )}
                  </motion.button>
                );
              })}
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
                <span className="text-sm font-semibold text-text-dark">
                  {location}
                </span>
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
        </div>
      </motion.div>
    </div>
  );
};

export default PersonalizationStrip;
