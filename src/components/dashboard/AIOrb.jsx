import { motion } from 'framer-motion';
import { FiActivity } from 'react-icons/fi';

const AIOrb = ({ volatility = 78 }) => {
  // Determine color based on volatility
  const getVolatilityColor = (value) => {
    if (value <= 40) return { from: '#10B981', to: '#34D399', ring: 'green' }; // Green
    if (value <= 70) return { from: '#F59E0B', to: '#FBBF24', ring: 'yellow' }; // Yellow
    if (value <= 85) return { from: '#F97316', to: '#FB923C', ring: 'orange' }; // Orange
    return { from: '#EF4444', to: '#F87171', ring: 'red' }; // Red
  };

  const colors = getVolatilityColor(volatility);
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (volatility / 100) * circumference;

  return (
    <div className="sticky top-24 flex flex-col items-center rounded-3xl p-6 glassmorphism-serenity hover-serenity-glow">
      {/* AI Orb Container */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, type: 'spring' }}
        className="relative w-32 h-32 mb-4"
      >
        {/* Outer Glow Ring */}
        <motion.div
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle, ${colors.from}40 0%, transparent 70%)`,
            filter: 'blur(10px)'
          }}
        />

        {/* Main Orb */}
        <div
          className="relative w-full h-full rounded-full overflow-hidden shadow-2xl border-2 border-white/20"
          style={{
            background: `radial-gradient(circle at 30% 30%, ${colors.from}, ${colors.to})`,
            boxShadow: `0 0 40px ${colors.from}80, inset 0 0 20px ${colors.to}40`
          }}
        >
          {/* Animated Particles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-white/40"
              style={{
                left: `${20 + Math.random() * 60}%`,
                top: `${20 + Math.random() * 60}%`
              }}
              animate={{
                y: [-10, 10, -10],
                x: [-5, 5, -5],
                opacity: [0.2, 0.8, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: 2 + Math.random() * 2,
                repeat: Infinity,
                delay: i * 0.2
              }}
            />
          ))}

          {/* Center AI Icon */}
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              animate={{
                rotate: [0, 360]
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: 'linear'
              }}
            >
              <FiActivity className="w-12 h-12 text-white/90" strokeWidth={2} />
            </motion.div>
          </div>

          {/* Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-transparent"></div>
        </div>

        {/* Volatility Ring SVG */}
        <svg className="absolute inset-0 w-full h-full -rotate-90">
          {/* Background Circle */}
          <circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke="rgba(255, 255, 255, 0.2)"
            strokeWidth="4"
          />
          {/* Progress Circle */}
          <motion.circle
            cx="64"
            cy="64"
            r="45"
            fill="none"
            stroke={colors.from}
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1, ease: 'easeOut' }}
            style={{
              filter: `drop-shadow(0 0 6px ${colors.from})`
            }}
          />
        </svg>

        {/* Pulse Ring Animation */}
        <motion.div
          animate={{
            scale: [1, 1.3],
            opacity: [0.5, 0]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeOut'
          }}
          className="absolute inset-0 rounded-full border-2"
          style={{
            borderColor: colors.from
          }}
        />
      </motion.div>

      {/* Volatility Label */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-1">
          Global Signal Noise
        </p>
        <motion.div
          key={volatility}
          initial={{ scale: 1.2 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 300 }}
          className="text-3xl font-bold"
          style={{
            color: colors.from,
            textShadow: `0 0 20px ${colors.from}60`
          }}
        >
          {volatility}/100
        </motion.div>
        <p className="text-xs text-text-secondary mt-1">
          {volatility <= 40 && 'Calm'}
          {volatility > 40 && volatility <= 70 && 'Moderate'}
          {volatility > 70 && volatility <= 85 && 'Active'}
          {volatility > 85 && 'Extreme'}
        </p>
      </motion.div>

      {/* Tooltip on Hover */}
      <motion.div
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        className="mt-4 p-3 rounded-lg bg-dark-grey/90 backdrop-blur-md text-xs text-white max-w-xs"
      >
        <p className="font-semibold mb-1">What is Signal Noise?</p>
        <p className="text-gray-300">
          Measures global news volatility based on story volume, topic shifts, and sentiment changes across {Math.floor(Math.random() * 50 + 200)} sources.
        </p>
      </motion.div>
    </div>
  );
};

export default AIOrb;
