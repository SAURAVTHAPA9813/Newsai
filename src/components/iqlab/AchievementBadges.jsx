import { motion } from 'framer-motion';
import { FiLock, FiAward } from 'react-icons/fi';
import getBadgeIcon from '../../utils/badgeIcons';

const AchievementBadges = ({ badges }) => {
  const getCategoryColor = (category) => {
    switch (category) {
      case 'TRUTH': return 'from-blue-500 to-blue-600';
      case 'STREAK': return 'from-orange-500 to-orange-600';
      case 'MARKET': return 'from-green-500 to-green-600';
      case 'MENTAL_HEALTH': return 'from-purple-500 to-purple-600';
      default: return 'from-gray-500 to-gray-600';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-brand-blue/20 p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      <div className="mb-4">
        <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider mb-2">
          Achievement Badges
        </h2>
        <p className="text-xs text-text-secondary">
          Unlock badges by completing challenges
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {badges.map((badge, index) => {
          const isUnlocked = badge.status === 'UNLOCKED';
          const gradientColor = getCategoryColor(badge.category);

          return (
            <motion.div
              key={badge.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: isUnlocked ? 1.05 : 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`relative p-3 rounded-2xl border-2 cursor-pointer transition-all ${
                isUnlocked
                  ? 'border-transparent bg-gradient-to-br ' + gradientColor + ' shadow-lg'
                  : 'border-gray-300 bg-white/40'
              }`}
              style={{
                filter: isUnlocked ? 'none' : 'grayscale(100%)',
                opacity: isUnlocked ? 1 : 0.6
              }}
              title={badge.description}
            >
              {/* Lock Overlay */}
              {!isUnlocked && (
                <div className="absolute top-2 right-2">
                  <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center">
                    <FiLock className="text-xs text-white" />
                  </div>
                </div>
              )}

              {/* Icon */}
              <div className="mb-2 text-center flex items-center justify-center">
                {getBadgeIcon(badge.icon, 'text-4xl')}
              </div>

              {/* Title */}
              <div className={`text-sm font-bold text-center mb-1 ${
                isUnlocked ? 'text-white' : 'text-text-dark'
              }`}>
                {badge.title}
              </div>

              {/* Status/Progress */}
              <div className="text-xs text-center">
                {isUnlocked ? (
                  <span className="text-white/90 font-semibold">Unlocked</span>
                ) : (
                  <span className="text-text-secondary font-medium">
                    {badge.progress.current}/{badge.progress.target}
                  </span>
                )}
              </div>

              {/* Progress Bar for Locked */}
              {!isUnlocked && (
                <div className="mt-2 h-1 bg-gray-300 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${(badge.progress.current / badge.progress.target) * 100}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className="h-full bg-gradient-to-r from-brand-blue to-purple-600 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-amber-50/80 border border-amber-300">
        <p className="text-xs text-amber-900 leading-relaxed flex items-center gap-2">
          <FiAward className="text-amber-600" />
          <span>Earn badges by using all features of NewsAI consistently and thoughtfully.</span>
        </p>
      </div>
    </motion.div>
  );
};

export default AchievementBadges;
