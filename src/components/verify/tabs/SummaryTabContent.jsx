import { motion } from 'framer-motion';
import { FiCheckCircle, FiXCircle, FiAlertCircle } from 'react-icons/fi';

const SummaryTabContent = ({ summaryData }) => {
  if (!summaryData) {
    return (
      <div className="p-8 text-center text-text-secondary">
        <p>Run a verification to see the forensic summary.</p>
      </div>
    );
  }

  const { forensicSummary, keyReasons } = summaryData;

  const getReasonIcon = (type) => {
    switch (type) {
      case 'PRO':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'CON':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'CAVEAT':
        return <FiAlertCircle className="w-5 h-5 text-amber-500" />;
      default:
        return null;
    }
  };

  const getReasonBadge = (type) => {
    const badges = {
      PRO: { label: 'Supporting', color: 'from-green-500 to-green-600' },
      CON: { label: 'Refuting', color: 'from-red-500 to-red-600' },
      CAVEAT: { label: 'Caveat', color: 'from-amber-500 to-amber-600' }
    };
    return badges[type] || badges.CAVEAT;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Forensic Summary */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Forensic Summary
        </h3>
        <p className="text-base text-text-dark leading-relaxed">
          {forensicSummary}
        </p>
      </div>

      {/* Key Reasons */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Key Reasons
        </h3>

        <div className="space-y-3">
          {keyReasons.map((reason, index) => {
            const badge = getReasonBadge(reason.type);

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-4 rounded-xl bg-white/40 border border-gray-200"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                {/* Icon */}
                <div className="flex-shrink-0 mt-0.5">
                  {getReasonIcon(reason.type)}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${badge.color}`}
                    >
                      {badge.label}
                    </span>
                  </div>
                  <p className="text-sm text-text-dark leading-relaxed">
                    {reason.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryTabContent;
