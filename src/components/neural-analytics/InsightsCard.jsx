import { motion } from 'framer-motion';
import { FiInfo, FiAlertCircle, FiAlertTriangle, FiArrowRight } from 'react-icons/fi';

const InsightsCard = ({ insights }) => {
  const insightsList = insights || [];

  // Helper to format type string to title case
  const formatType = (type) => {
    if (!type) return 'Insight';
    return type
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getSeverityConfig = (severity) => {
    const severityUpper = severity?.toUpperCase();

    switch (severityUpper) {
      case 'POSITIVE':
        return {
          icon: FiInfo,
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          iconColor: 'text-green-600',
          textColor: 'text-green-900',
        };
      case 'INFO':
      case 'NEUTRAL':
        return {
          icon: FiInfo,
          bgColor: 'bg-blue-50',
          borderColor: 'border-blue-200',
          iconColor: 'text-blue-600',
          textColor: 'text-blue-900',
        };
      case 'NOTICE':
      case 'SUGGESTION':
        return {
          icon: FiAlertCircle,
          bgColor: 'bg-amber-50',
          borderColor: 'border-amber-200',
          iconColor: 'text-amber-600',
          textColor: 'text-amber-900',
        };
      case 'WARNING':
        return {
          icon: FiAlertTriangle,
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          iconColor: 'text-red-600',
          textColor: 'text-red-900',
        };
      default:
        return {
          icon: FiInfo,
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          iconColor: 'text-gray-600',
          textColor: 'text-gray-900',
        };
    }
  };

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-6 border border-brand-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Neural Insights
        </h2>
        <p className="text-sm text-text-secondary">
          Highlights &amp; gentle nudges
        </p>
      </div>

      <div className="space-y-4">
        {insightsList.length === 0 ? (
          <div className="text-center py-8 text-text-secondary text-sm">
            No insights available yet. Keep reading to generate insights!
          </div>
        ) : (
          insightsList.map((insight, index) => {
            const config = getSeverityConfig(insight.severity);
            const Icon = config.icon;

            // Map backend field names to frontend (backend sends: type, message, recommendation)
            const title = insight.title || formatType(insight.type);
            const body = insight.body || insight.message;
            const actionHint = insight.actionHint || insight.recommendation;

            return (
              <motion.div
                key={insight.id || insight.type || index}
                className={`${config.bgColor} ${config.borderColor} border rounded-xl p-4`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex items-start gap-3">
                  <Icon className={`${config.iconColor} w-5 h-5 flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <h3 className={`${config.textColor} font-bold text-sm mb-1`}>
                      {title}
                    </h3>
                    <p className="text-xs text-gray-700 mb-2 leading-relaxed">
                      {body}
                    </p>
                    {actionHint && (
                      <div className="flex items-start gap-2 mt-3 pt-3 border-t border-gray-300">
                        <FiArrowRight className="text-gray-500 w-3 h-3 flex-shrink-0 mt-0.5" />
                        <p className="text-xs text-gray-600 italic">
                          {actionHint}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </motion.div>
  );
};

export default InsightsCard;
