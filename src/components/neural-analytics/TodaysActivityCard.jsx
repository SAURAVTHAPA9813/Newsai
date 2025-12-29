import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiClock, FiTrendingUp } from 'react-icons/fi';

const TodaysActivityCard = ({ userStats }) => {
  // Get session stats from sessionStorage (same as ControlCenter)
  const [sessionStats, setSessionStats] = useState(() => {
    const stored = sessionStorage.getItem('sessionStats');
    return stored ? JSON.parse(stored) : {
      articlesReadToday: 0,
      timeSavedToday: 0,
      sessionStartTime: Date.now()
    };
  });

  // Update when sessionStorage changes (listen for storage events)
  useEffect(() => {
    const updateStats = () => {
      const stored = sessionStorage.getItem('sessionStats');
      if (stored) {
        setSessionStats(JSON.parse(stored));
      }
    };

    // Poll sessionStorage every 2 seconds to catch updates
    const interval = setInterval(updateStats, 2000);

    return () => clearInterval(interval);
  }, []);

  // Calculate focus score (same formula as ControlCenter)
  const calculateFocusScore = () => {
    const currentStreak = userStats?.currentStreak || 0;
    const articlesRead = sessionStats.articlesReadToday;

    if (articlesRead === 0) return 0;

    return Math.min(
      Math.round(70 + (currentStreak * 2) + (articlesRead * 5)),
      100
    );
  };

  const focusScore = calculateFocusScore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="glassmorphism rounded-3xl p-6 border border-serenity-royal/20"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-serenity-royal to-serenity-lavender flex items-center justify-center">
          <FiActivity className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-text-dark font-cinzel">Today's Activity</h3>
          <p className="text-xs text-text-secondary">Current session stats</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Articles Read */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-serenity-royal/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center">
              <FiActivity className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Articles Read</p>
              <p className="text-2xl font-bold text-brand-blue font-cinzel">
                {sessionStats.articlesReadToday}
              </p>
            </div>
          </div>
        </div>

        {/* Time Saved */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-serenity-royal/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center">
              <FiClock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Time Saved</p>
              <p className="text-2xl font-bold text-green-600 font-cinzel">
                {sessionStats.timeSavedToday}m
              </p>
            </div>
          </div>
        </div>

        {/* Focus Score */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 border border-serenity-royal/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center">
              <FiTrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="text-xs text-text-secondary font-medium">Focus Score</p>
              <p className="text-2xl font-bold text-purple-600 font-cinzel">
                {focusScore}%
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-serenity-royal/10">
        <p className="text-xs text-text-secondary text-center italic">
          Stats reset when you close the browser
        </p>
      </div>
    </motion.div>
  );
};

export default TodaysActivityCard;
