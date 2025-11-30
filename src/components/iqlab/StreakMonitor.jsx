import { motion } from 'framer-motion';
import { FiCheck, FiAward } from 'react-icons/fi';
import { AiFillFire } from 'react-icons/ai';

const StreakMonitor = ({ streak }) => {
  const today = new Date().toISOString().split('T')[0];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="rounded-3xl border border-brand-blue/20 p-4"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      <div className="mb-4">
        <h2 className="text-2xl font-black text-text-dark mb-2 flex items-center gap-2">
          <AiFillFire className="text-orange-500" />
          <span>{streak.currentStreak}-Day Streak</span>
        </h2>
        <p className="text-sm text-text-secondary">
          You've trained your intelligence for {streak.currentStreak} days in a row
        </p>
      </div>

      {/* 30-Day Bit Grid */}
      <div className="mb-4">
        <div className="text-xs font-bold text-text-dark uppercase tracking-wider mb-2">
          Last 30 Days
        </div>
        <div className="grid grid-cols-10 gap-1.5">
          {streak.dayHistory.map((day, index) => {
            const isToday = day.date === today;
            const isCompleted = day.completed;

            return (
              <motion.div
                key={day.date}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.02 }}
                whileHover={{ scale: 1.15 }}
                className={`aspect-square rounded-lg relative group cursor-pointer transition-all ${
                  isCompleted && isToday
                    ? 'bg-gradient-to-br from-orange-400 to-orange-500 shadow-lg animate-pulse'
                    : isCompleted
                    ? 'bg-gradient-to-br from-orange-400 to-orange-500'
                    : isToday
                    ? 'border-2 border-orange-400 border-dashed bg-gray-100'
                    : 'bg-gray-200'
                }`}
                title={`${day.date}: ${day.completed ? `Completed · +${day.xpEarned} XP` : 'No drill completed'}`}
              >
                {/* Tooltip */}
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10 flex items-center gap-1">
                  <span>{day.date}:</span>
                  {day.completed ? (
                    <>
                      <FiCheck className="text-green-400" />
                      <span>+{day.xpEarned} XP</span>
                    </>
                  ) : (
                    <span>Missed</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-orange-50/80 border border-orange-300">
        <div>
          <div className="text-xs font-bold text-orange-900 uppercase tracking-wider mb-1">
            Best Streak
          </div>
          <div className="text-2xl font-black text-orange-700">
            {streak.bestStreak} Days
          </div>
        </div>
        <FiAward className="text-5xl text-orange-500" />
      </div>

      {/* Milestone Progress */}
      {streak.currentStreak < 30 && (
        <div className="mt-4 p-3 rounded-lg bg-blue-50/80 border border-blue-300">
          <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
            Next Milestone
          </div>
          <div className="flex items-center gap-3">
            <div className="flex-1">
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${(streak.currentStreak / (streak.currentStreak < 7 ? 7 : streak.currentStreak < 14 ? 14 : 30)) * 100}%`
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
                />
              </div>
            </div>
            <span className="text-sm font-bold text-blue-700">
              {streak.currentStreak < 7 ? '7' : streak.currentStreak < 14 ? '14' : '30'} days
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default StreakMonitor;
