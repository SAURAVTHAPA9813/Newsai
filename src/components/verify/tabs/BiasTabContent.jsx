import { motion } from 'framer-motion';
import { FiTarget, FiAlertCircle, FiInfo } from 'react-icons/fi';

const BiasTabContent = ({ biasData }) => {
  if (!biasData) {
    return (
      <div className="p-8 text-center text-text-secondary">
        <p>Run a verification to see bias analysis.</p>
      </div>
    );
  }

  const {
    corporateBiasLevel,
    corporateBiasExplanation,
    politicalLean,
    politicalLeanExplanation,
    emotionalTriggerLevel,
    emotionalTriggerExplanation,
    biasChips,
    saferAlternativeFraming
  } = biasData;

  const getLevelColor = (level) => {
    switch (level) {
      case 'LOW':
        return { bg: 'bg-green-100', text: 'text-green-700', border: 'border-green-300' };
      case 'MEDIUM':
        return { bg: 'bg-amber-100', text: 'text-amber-700', border: 'border-amber-300' };
      case 'HIGH':
        return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', border: 'border-gray-300' };
    }
  };

  const getPoliticalLeanColor = (lean) => {
    const leanUpper = lean.toUpperCase();
    if (leanUpper.includes('LEFT')) {
      return { bg: 'bg-blue-100', text: 'text-blue-700', border: 'border-blue-300' };
    } else if (leanUpper.includes('RIGHT')) {
      return { bg: 'bg-red-100', text: 'text-red-700', border: 'border-red-300' };
    } else {
      return { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-300' };
    }
  };

  const corporateBiasColor = getLevelColor(corporateBiasLevel);
  const emotionalTriggerColor = getLevelColor(emotionalTriggerLevel);
  const politicalLeanColor = getPoliticalLeanColor(politicalLean);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Bias Chips Overview */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Bias Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {biasChips.map((chip, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="p-4 rounded-xl bg-white/40 border border-gray-200 text-center"
              title={chip.tooltip}
              style={{
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)'
              }}
            >
              <div className="text-2xl mb-1">{chip.label.split(' ')[0]}</div>
              <div className="text-xs text-text-secondary uppercase tracking-wider mb-2">
                {chip.label.substring(chip.label.indexOf(' ') + 1)}
              </div>
              <div className="text-lg font-bold text-text-dark">{chip.value}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Corporate Bias */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Corporate Bias Analysis
        </h3>
        <div className="p-5 rounded-xl bg-white/60 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${corporateBiasColor.bg} ${corporateBiasColor.text} border ${corporateBiasColor.border}`}
            >
              {corporateBiasLevel} BIAS
            </span>
            <FiTarget className={`w-5 h-5 ${corporateBiasColor.text}`} />
          </div>
          <p className="text-sm text-text-dark leading-relaxed">
            {corporateBiasExplanation}
          </p>
        </div>
      </div>

      {/* Political Lean */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Political Lean
        </h3>
        <div className="p-5 rounded-xl bg-white/60 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${politicalLeanColor.bg} ${politicalLeanColor.text} border ${politicalLeanColor.border}`}
            >
              {politicalLean}
            </span>
            <div className="flex-1">
              <div className="text-xs text-text-secondary">Estimated political alignment</div>
            </div>
          </div>
          <p className="text-sm text-text-dark leading-relaxed">
            {politicalLeanExplanation}
          </p>
        </div>
      </div>

      {/* Emotional Trigger Level */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Emotional Manipulation
        </h3>
        <div className="p-5 rounded-xl bg-white/60 border border-gray-200">
          <div className="flex items-center gap-3 mb-3">
            <span
              className={`px-3 py-1.5 rounded-lg text-sm font-bold ${emotionalTriggerColor.bg} ${emotionalTriggerColor.text} border ${emotionalTriggerColor.border}`}
            >
              {emotionalTriggerLevel} EMOTIONAL TRIGGER
            </span>
            {emotionalTriggerLevel === 'HIGH' && (
              <FiAlertCircle className={`w-5 h-5 ${emotionalTriggerColor.text}`} />
            )}
          </div>
          <p className="text-sm text-text-dark leading-relaxed">
            {emotionalTriggerExplanation}
          </p>
        </div>
      </div>

      {/* Safer Alternative Framing */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Safer Alternative Framing
        </h3>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="p-5 rounded-xl bg-blue-50/80 border border-blue-300"
        >
          <div className="flex items-start gap-3">
            <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
                Recommended Neutral Framing
              </div>
              <p className="text-sm text-blue-900 leading-relaxed">
                {saferAlternativeFraming}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Analysis Note */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="p-4 rounded-xl bg-gray-50/80 border border-gray-200"
      >
        <div className="flex items-start gap-3">
          <FiInfo className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            Bias analysis helps identify potential framing issues, emotional manipulation, and
            partisan language. Consider multiple perspectives and primary sources when evaluating
            claims.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default BiasTabContent;
