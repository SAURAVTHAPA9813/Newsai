import { motion } from "framer-motion";
import { FiLock, FiAward } from "react-icons/fi";
import getBadgeIcon from "../../utils/badgeIcons";

const AchievementBadges = ({ badges }) => {
  // Get tier-based styling (light, elegant colors)
  const getTierStyle = (tier, isUnlocked) => {
    if (!isUnlocked) {
      return {
        bg: "bg-gray-50/80",
        border: "border-gray-300",
        iconColor: "text-gray-400",
        gradient: "from-gray-100 to-gray-200",
        glow: ""
      };
    }

    switch (tier?.toLowerCase()) {
      case "bronze":
        return {
          bg: "bg-orange-50/80",
          border: "border-orange-300",
          iconColor: "text-orange-600",
          gradient: "from-orange-100 to-amber-100",
          glow: "shadow-orange-200/50"
        };
      case "silver":
        return {
          bg: "bg-slate-50/80",
          border: "border-slate-300",
          iconColor: "text-slate-600",
          gradient: "from-slate-100 to-gray-100",
          glow: "shadow-slate-200/50"
        };
      case "gold":
        return {
          bg: "bg-yellow-50/80",
          border: "border-yellow-300",
          iconColor: "text-yellow-600",
          gradient: "from-yellow-100 to-amber-100",
          glow: "shadow-yellow-200/50"
        };
      case "platinum":
        return {
          bg: "bg-sky-50/80",
          border: "border-sky-300",
          iconColor: "text-sky-600",
          gradient: "from-sky-100 to-blue-100",
          glow: "shadow-sky-200/50"
        };
      case "diamond":
        return {
          bg: "bg-purple-50/80",
          border: "border-purple-300",
          iconColor: "text-purple-600",
          gradient: "from-purple-100 to-pink-100",
          glow: "shadow-purple-200/50"
        };
      default:
        return {
          bg: "bg-blue-50/80",
          border: "border-blue-300",
          iconColor: "text-blue-600",
          gradient: "from-blue-100 to-sky-100",
          glow: "shadow-blue-200/50"
        };
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-brand-blue/20 p-6"
      style={{
        background: "rgba(255, 255, 255, 0.7)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        boxShadow: "0 8px 32px rgba(65, 105, 225, 0.1)",
      }}
    >
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-2">
          <FiAward className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            Achievement Badges
          </h2>
        </div>
        <p className="text-xs text-text-secondary">
          Unlock badges by completing challenges
        </p>
      </div>

      {/* Badges Grid */}
      <div className="space-y-3">
        {badges?.map((badge, index) => {
          const isUnlocked = badge.status === "unlocked";
          const style = getTierStyle(badge.tier, isUnlocked);
          const progress = badge.progress || 0;

          return (
            <motion.div
              key={badge.id || index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.01, x: 4 }}
              className={`relative rounded-xl border ${style.border} ${style.bg} p-4 transition-all ${
                isUnlocked ? `shadow-lg ${style.glow}` : "opacity-70"
              }`}
            >
              <div className="flex items-center gap-4">
                {/* Icon Circle */}
                <div
                  className={`flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br ${style.gradient} border ${style.border}`}
                >
                  {isUnlocked ? (
                    <div className={style.iconColor}>
                      {getBadgeIcon(badge.icon, "text-2xl")}
                    </div>
                  ) : (
                    <FiLock className="text-gray-400 text-2xl" />
                  )}
                </div>

                {/* Badge Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className={`font-bold text-sm ${isUnlocked ? "text-text-dark" : "text-gray-500"}`}>
                      {badge.name || badge.title}
                    </h3>
                    {isUnlocked && (
                      <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-700 border border-green-300">
                        ✓ Unlocked
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary mb-2 line-clamp-1">
                    {badge.description}
                  </p>

                  {/* Progress Bar */}
                  {!isUnlocked && (
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-text-secondary font-medium">
                          {badge.criteria || `Progress`}
                        </span>
                        <span className="text-text-secondary font-bold">
                          {Math.round(progress * 10) / 10}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.8, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-sky-500 to-blue-500 rounded-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* XP Reward */}
                  {isUnlocked && badge.xpReward && (
                    <div className="text-xs font-semibold text-green-600">
                      +{badge.xpReward} XP earned
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Footer Tip */}
      <div className="mt-4 p-3 rounded-xl bg-sky-50/80 border border-sky-200">
        <p className="text-xs text-sky-900 leading-relaxed">
          Complete quizzes, maintain streaks, and read articles to unlock all badges!
        </p>
      </div>
    </motion.div>
  );
};

export default AchievementBadges;
