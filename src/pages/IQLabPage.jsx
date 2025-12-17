import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiStar } from 'react-icons/fi';
import DailyCognitiveDrill from '../components/iqlab/DailyCognitiveDrill';
import NeuralProficiencyMatrix from '../components/iqlab/NeuralProficiencyMatrix';
import StreakMonitor from '../components/iqlab/StreakMonitor';
import AchievementBadges from '../components/iqlab/AchievementBadges';
import PhilosophyModule from '../components/iqlab/PhilosophyModule';
import getBadgeIcon from '../utils/badgeIcons';
import {
  getIQLabState,
  submitDrillAttempt,
  unlockBadge
} from '../services/mockIQLabAPI';

const IQLabPage = () => {
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState(null);
  const [xpToast, setXpToast] = useState(null);
  const [badgeToast, setBadgeToast] = useState(null);

  // Load initial state
  useEffect(() => {
    const loadState = async () => {
      const data = await getIQLabState();
      setState(data);
      setLoading(false);
    };
    loadState();
  }, []);

  // Handle drill submission
  const handleDrillSubmit = async (questionId, answeredIndex) => {
    const result = await submitDrillAttempt(questionId, answeredIndex);
    setState(result.updatedState);

    // Show XP toast if earned
    if (result.attempt.earnedXp > 0) {
      setXpToast({
        amount: result.attempt.earnedXp,
        type: result.attempt.countsForDailyReward ? 'DAILY' : 'PRACTICE'
      });
      setTimeout(() => setXpToast(null), 3000);
    }

    // Check for badge unlocks
    checkBadgeUnlocks(result.updatedState);
  };

  // Check if any badges should be unlocked
  const checkBadgeUnlocks = async (currentState) => {
    const lockedBadges = currentState.badges.filter(b => b.status === 'LOCKED');

    for (const badge of lockedBadges) {
      const { type, threshold, field } = badge.criteria;
      let currentValue = 0;

      // Get current value based on criteria type
      if (field === 'currentStreak') {
        currentValue = currentState.streak.currentStreak;
      } else if (field === 'drillsCompletedCount') {
        currentValue = currentState.todayAttempts.length;
      }
      // Add more field mappings as needed

      // Check if threshold met
      if (currentValue >= threshold) {
        const updatedState = await unlockBadge(badge.id);
        setState(updatedState);

        // Show badge unlock toast
        setBadgeToast(badge);
        setTimeout(() => setBadgeToast(null), 4000);
      }
    }
  };

  if (loading || !state) {
    return (
      <div className="min-h-screen section-gradient-radial flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen section-gradient-radial">
      <div className="container-custom py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <div className="flex items-center gap-4 mb-2">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-300 rounded-2xl flex items-center justify-center shadow-lg">
              <FiCpu className="text-white text-3xl" />
            </div>
            <div>
              <h1 className="font-cinzel text-4xl font-bold text-text-dark">IQ Lab</h1>
              <p className="text-text-secondary text-lg">
                Train your News Intelligence and unlock your cognitive potential
              </p>
            </div>
          </div>

          {/* News IQ Score Bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mt-6 p-4 rounded-2xl border border-purple-500/30"
            style={{
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-blue-900 uppercase tracking-wider">
                  News IQ
                </span>
                <div className="text-3xl font-black bg-gradient-to-r from-blue-600 to-blue-300 bg-clip-text text-transparent">
                  {state.newsIq.score}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs text-text-secondary">Total XP</div>
                <div className="text-sm font-bold text-blue-700">{state.newsIq.xpTotal}</div>
              </div>
            </div>
            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${state.newsIq.score}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-blue-500 to-blue-300 rounded-full"
              />
            </div>
          </motion.div>
        </motion.div>

        {/* Row 1: Daily Drill + Badges */}
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,2fr),minmax(0,0.8fr)] gap-4 mb-4">
          {/* Daily Cognitive Drill */}
          <div>
            <DailyCognitiveDrill
              question={state.todayQuestion}
              attempts={state.todayAttempts}
              onSubmit={handleDrillSubmit}
            />
          </div>

          {/* Achievement Badges */}
          <div>
            <AchievementBadges badges={state.badges} />
          </div>
        </div>

        {/* Row 2: Skills Matrix + Streak */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
          {/* Neural Proficiency Matrix */}
          <div>
            <NeuralProficiencyMatrix skillScores={state.skillScores} />
          </div>

          {/* Streak Monitor */}
          <div>
            <StreakMonitor streak={state.streak} />
          </div>
        </div>

        {/* Row 3: Philosophy Footer */}
        <div>
          <PhilosophyModule quotes={state.philosophyQuotes} />
        </div>
      </div>

      {/* XP Gain Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            transition={{ type: 'spring', damping: 15 }}
            className="fixed bottom-8 right-8 z-50"
          >
            <div
              className="px-6 py-4 rounded-2xl shadow-2xl border-2 border-green-400"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.95) 0%, rgba(16, 185, 129, 0.95) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)'
              }}
            >
              <div className="flex items-center gap-3">
                <FiStar className="text-3xl text-yellow-300" />
                <div>
                  <div className="text-2xl font-black text-white">
                    +{xpToast.amount} XP
                  </div>
                  <div className="text-xs text-green-100 font-semibold uppercase tracking-wider">
                    {xpToast.type === 'DAILY' ? 'Daily Drill Complete' : 'Practice Complete'}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Badge Unlock Toast */}
      <AnimatePresence>
        {badgeToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
            transition={{ type: 'spring', damping: 12 }}
            className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div
              className="p-8 rounded-3xl shadow-2xl border-4 border-yellow-400 text-center"
              style={{
                background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.98) 0%, rgba(245, 158, 11, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                minWidth: '320px'
              }}
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
                transition={{ duration: 0.5, repeat: 2 }}
                className="mb-4 flex items-center justify-center"
              >
                {getBadgeIcon(badgeToast.icon, 'text-7xl')}
              </motion.div>
              <div className="text-3xl font-black text-amber-900 mb-2">
                Badge Unlocked!
              </div>
              <div className="text-xl font-bold text-amber-800 mb-2">
                {badgeToast.title}
              </div>
              <div className="text-sm text-amber-700">
                {badgeToast.description}
              </div>
              <div className="mt-4 text-lg font-bold text-amber-900">
                +{badgeToast.xpReward} XP
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IQLabPage;
