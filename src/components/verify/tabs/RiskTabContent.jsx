import { motion } from 'framer-motion';
import { FiShield, FiAlertTriangle, FiHeart, FiDollarSign, FiShare2, FiAlertCircle } from 'react-icons/fi';

const RiskTabContent = ({ riskData }) => {
  if (!riskData) {
    return (
      <div className="p-8 text-center text-text-secondary">
        <p>Run a verification to see risk guidance.</p>
      </div>
    );
  }

  const { overallRiskLevel, overallGuidanceSummary, guidelines } = riskData;

  const getRiskLevelColor = (level) => {
    switch (level) {
      case 'LOW':
        return {
          bg: 'from-green-500 to-green-600',
          lightBg: 'bg-green-50',
          text: 'text-green-700',
          border: 'border-green-300',
          icon: FiShield
        };
      case 'MEDIUM':
        return {
          bg: 'from-amber-500 to-amber-600',
          lightBg: 'bg-amber-50',
          text: 'text-amber-700',
          border: 'border-amber-300',
          icon: FiAlertCircle
        };
      case 'HIGH':
        return {
          bg: 'from-red-500 to-red-600',
          lightBg: 'bg-red-50',
          text: 'text-red-700',
          border: 'border-red-300',
          icon: FiAlertTriangle
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          lightBg: 'bg-gray-50',
          text: 'text-gray-700',
          border: 'border-gray-300',
          icon: FiShield
        };
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'GENERAL_SHARING':
        return FiShare2;
      case 'MEDICAL_HEALTH':
        return FiHeart;
      case 'FINANCIAL':
        return FiDollarSign;
      case 'EMOTIONAL_WELLBEING':
        return FiAlertCircle;
      default:
        return FiShield;
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      GENERAL_SHARING: 'General Sharing',
      MEDICAL_HEALTH: 'Medical & Health',
      FINANCIAL: 'Financial Decisions',
      EMOTIONAL_WELLBEING: 'Emotional Wellbeing'
    };
    return labels[category] || category;
  };

  const riskColor = getRiskLevelColor(overallRiskLevel);
  const RiskIcon = riskColor.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Overall Risk Level */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Risk Assessment
        </h3>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className={`p-6 rounded-xl border-2 ${riskColor.border} ${riskColor.lightBg}`}
        >
          <div className="flex items-start gap-4 mb-4">
            <div
              className={`w-16 h-16 rounded-2xl flex items-center justify-center bg-gradient-to-br ${riskColor.bg} shadow-lg`}
            >
              <RiskIcon className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span
                  className={`px-4 py-1.5 rounded-lg text-sm font-bold bg-gradient-to-r ${riskColor.bg} text-white`}
                >
                  {overallRiskLevel} RISK
                </span>
              </div>
              <h4 className="text-lg font-bold text-text-dark mb-2">Overall Risk Assessment</h4>
              <p className="text-sm text-text-dark leading-relaxed">
                {overallGuidanceSummary}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category Guidelines */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Category-Specific Guidance
        </h3>

        <div className="space-y-3">
          {guidelines.map((guideline, index) => {
            const CategoryIcon = getCategoryIcon(guideline.category);
            const categoryLabel = getCategoryLabel(guideline.category);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="p-5 rounded-xl bg-white/60 border border-gray-200"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-brand-blue/20 to-purple-600/20 flex items-center justify-center">
                      <CategoryIcon className="w-5 h-5 text-brand-blue" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-2">
                      {categoryLabel}
                    </h4>
                    <p className="text-sm text-text-dark leading-relaxed">
                      {guideline.text}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Best Practices */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Best Practices
        </h3>
        <div className="p-5 rounded-xl bg-blue-50/80 border border-blue-300">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                1
              </span>
              <p className="text-sm text-blue-900 leading-relaxed">
                Always verify claims from multiple independent, reputable sources before sharing.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                2
              </span>
              <p className="text-sm text-blue-900 leading-relaxed">
                Be especially cautious with emotionally charged content designed to provoke reactions.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                3
              </span>
              <p className="text-sm text-blue-900 leading-relaxed">
                When in doubt, consult subject-matter experts, especially for medical, financial, or legal claims.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                4
              </span>
              <p className="text-sm text-blue-900 leading-relaxed">
                Include appropriate context and caveats when sharing information with uncertainty.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="p-4 rounded-xl bg-gray-50/80 border border-gray-200"
      >
        <div className="flex items-start gap-3">
          <FiAlertCircle className="w-4 h-4 text-text-secondary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-text-secondary leading-relaxed">
            This risk assessment is provided for informational purposes only and should not be
            considered professional advice. Always exercise critical thinking and consult relevant
            experts for important decisions.
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default RiskTabContent;
