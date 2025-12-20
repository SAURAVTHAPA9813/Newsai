import { motion } from 'framer-motion';
import { FiShield, FiTrendingUp, FiGlobe } from 'react-icons/fi';
import { BiAnalyse } from 'react-icons/bi';

const NeuralProficiencyMatrix = ({ skillScores }) => {
  const skillLabels = {
    factVerification: { icon: FiShield, label: 'Fact Verification', color: 'from-blue-500 to-blue-600' },
    biasDetection: { icon: BiAnalyse, label: 'Bias Detection', color: 'from-sky-500 to-sky-600' },
    marketAnalysis: { icon: FiTrendingUp, label: 'Market Analysis', color: 'from-green-500 to-green-600' },
    geopolitics: { icon: FiGlobe, label: 'Geopolitics', color: 'from-amber-500 to-amber-600' }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
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
          Neural Proficiency Matrix
        </h2>
        <p className="text-xs text-text-secondary">Your current intelligence profile</p>
      </div>

      <div className="space-y-3">
        {skillScores.map((skill, index) => {
          const config = skillLabels[skill.skill];
          if (!config) return null;

          const changePrefix = skill.change7d >= 0 ? '+' : '';
          const changeColor = skill.change7d >= 0 ? 'text-green-600' : 'text-red-600';

          return (
            <motion.div
              key={skill.skill}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <config.icon className="text-xl" />
                  <span className="text-sm font-semibold text-text-dark">{config.label}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-text-dark">{skill.value}%</span>
                  <span className={`text-xs font-semibold ${changeColor}`}>
                    ({changePrefix}{skill.change7d}%)
                  </span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.value}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1, ease: 'easeOut' }}
                  className={`h-full bg-gradient-to-r ${config.color} rounded-full`}
                />
              </div>

              <div className="mt-1 text-xs text-text-secondary">
                Based on {skill.sampleSize} interactions
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-3 rounded-lg bg-sky-50/80 border border-sky-300">
        <p className="text-xs text-sky-900 leading-relaxed">
          Skills improve through daily drills, fact-checking in Verify Hub, and engaging with relevant content.
        </p>
      </div>
    </motion.div>
  );
};

export default NeuralProficiencyMatrix;
