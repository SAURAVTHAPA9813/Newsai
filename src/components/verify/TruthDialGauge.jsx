import { motion } from 'framer-motion';

const TruthDialGauge = ({ score = 0, verdictLabel, verdictLabelHuman, verdictSummary, scoreColor }) => {
  // Calculate needle rotation (-90deg to +90deg for semi-circle)
  const needleRotation = -90 + (score / 100) * 180;

  // Color zones for the arc background
  const arcColors = [
    { offset: '0%', color: '#EF4444' },    // Red (0-20)
    { offset: '20%', color: '#F97316' },   // Orange (20-40)
    { offset: '40%', color: '#F59E0B' },   // Amber (40-70)
    { offset: '70%', color: '#84CC16' },   // Lime (70-85)
    { offset: '85%', color: '#10B981' }    // Green (85-100)
  ];

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Gauge Container */}
      <div
        className="relative rounded-3xl p-8 border border-brand-blue/20"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.7) 100%)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
        }}
      >
        {/* SVG Gauge */}
        <svg className="w-full h-auto mb-6" viewBox="0 0 200 110" style={{ overflow: 'visible' }}>
          <defs>
            {/* Gradient for arc */}
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              {arcColors.map((color, index) => (
                <stop key={index} offset={color.offset} stopColor={color.color} />
              ))}
            </linearGradient>

            {/* Glow filter */}
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Background arc */}
          <path
            d="M 30 95 A 70 70 0 0 1 170 95"
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="16"
            strokeLinecap="round"
          />

          {/* Colored arc (gradient) */}
          <path
            d="M 30 95 A 70 70 0 0 1 170 95"
            fill="none"
            stroke="url(#arcGradient)"
            strokeWidth="16"
            strokeLinecap="round"
            opacity="0.9"
          />


          {/* Animated needle */}
          <motion.g
            initial={{ rotate: -90 }}
            animate={{ rotate: needleRotation }}
            transition={{ type: 'spring', stiffness: 80, damping: 12, duration: 1.2 }}
            style={{ transformOrigin: '100px 95px' }}
          >
            {/* Needle shadow */}
            <line
              x1="100"
              y1="95"
              x2="100"
              y2="35"
              stroke="rgba(0, 0, 0, 0.1)"
              strokeWidth="4"
              strokeLinecap="round"
            />
            {/* Needle */}
            <line
              x1="100"
              y1="95"
              x2="100"
              y2="35"
              stroke={scoreColor || '#4169E1'}
              strokeWidth="4"
              strokeLinecap="round"
              filter="url(#glow)"
            />
            {/* Needle cap */}
            <circle
              cx="100"
              cy="95"
              r="8"
              fill={scoreColor || '#4169E1'}
              stroke="white"
              strokeWidth="3"
              filter="url(#glow)"
            />
          </motion.g>

          {/* Center glow effect */}
          <motion.circle
            cx="100"
            cy="95"
            r="12"
            fill={scoreColor || '#4169E1'}
            opacity="0.2"
            animate={{
              r: [12, 18, 12],
              opacity: [0.2, 0.05, 0.2]
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: 'easeInOut'
            }}
          />
        </svg>

        {/* Score Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="text-center"
        >
          {/* Large score number */}
          <div className="mb-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-7xl font-black mb-2"
              style={{
                color: scoreColor,
                textShadow: `0 0 30px ${scoreColor}40`
              }}
            >
              {score}
            </motion.div>
            <div className="text-xs text-text-secondary uppercase tracking-widest font-bold">
              Truth Score
            </div>
          </div>

          {/* Verdict label */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="mb-4"
          >
            <div
              className="inline-block px-8 py-2.5 rounded-full font-bold text-sm uppercase tracking-wider"
              style={{
                background: `linear-gradient(135deg, ${scoreColor}20, ${scoreColor}10)`,
                color: scoreColor,
                border: `2px solid ${scoreColor}`,
                boxShadow: `0 4px 20px ${scoreColor}30`
              }}
            >
              {verdictLabelHuman || 'ANALYZING...'}
            </div>
          </motion.div>

          {/* Verdict summary */}
          {verdictSummary && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-sm text-text-dark leading-relaxed max-w-lg mx-auto px-4"
            >
              {verdictSummary}
            </motion.p>
          )}
        </motion.div>
      </div>

      {/* Subtle glow ring around gauge */}
      <motion.div
        className="absolute inset-0 rounded-3xl pointer-events-none"
        style={{
          boxShadow: `0 0 60px ${scoreColor}15`
        }}
        animate={{
          boxShadow: [
            `0 0 40px ${scoreColor}10`,
            `0 0 60px ${scoreColor}20`,
            `0 0 40px ${scoreColor}10`
          ]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />
    </div>
  );
};

export default TruthDialGauge;
