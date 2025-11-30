import { motion } from 'framer-motion';
import { FiExternalLink, FiCheckCircle, FiXCircle, FiAlertCircle, FiInfo } from 'react-icons/fi';

const EvidenceTabContent = ({ evidenceData }) => {
  if (!evidenceData) {
    return (
      <div className="p-8 text-center text-text-secondary">
        <p>Run a verification to see evidence sources.</p>
      </div>
    );
  }

  const { evidenceConfidenceScore, evidenceConfidenceLabel, sources, hallucinationGuardText } = evidenceData;

  const getTierColor = (tier) => {
    switch (tier) {
      case 'TIER_1':
        return 'from-green-500 to-green-600';
      case 'TIER_2':
        return 'from-blue-500 to-blue-600';
      case 'TIER_3':
        return 'from-amber-500 to-amber-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getSupportTypeIcon = (type) => {
    switch (type) {
      case 'SUPPORTING':
        return <FiCheckCircle className="w-5 h-5 text-green-500" />;
      case 'REFUTING':
        return <FiXCircle className="w-5 h-5 text-red-500" />;
      case 'BACKGROUND':
        return <FiInfo className="w-5 h-5 text-blue-500" />;
      default:
        return <FiAlertCircle className="w-5 h-5 text-amber-500" />;
    }
  };

  const getSupportTypeBadge = (type) => {
    const badges = {
      SUPPORTING: { label: 'Supporting', color: 'from-green-500 to-green-600' },
      REFUTING: { label: 'Refuting', color: 'from-red-500 to-red-600' },
      BACKGROUND: { label: 'Background', color: 'from-blue-500 to-blue-600' }
    };
    return badges[type] || { label: 'Unknown', color: 'from-gray-500 to-gray-600' };
  };

  const getConfidenceColor = (confidence) => {
    switch (confidence) {
      case 'HIGH':
        return 'text-green-600 bg-green-100';
      case 'MEDIUM':
        return 'text-amber-600 bg-amber-100';
      case 'LOW':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="p-6 space-y-6"
    >
      {/* Evidence Confidence Score */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Evidence Confidence
        </h3>
        <div className="flex items-center gap-4 p-4 rounded-xl bg-white/40 border border-gray-200">
          <div className="text-4xl font-bold text-brand-blue">
            {Math.round(evidenceConfidenceScore * 100)}%
          </div>
          <div className="flex-1">
            <div className="text-lg mb-1">{evidenceConfidenceLabel}</div>
            <div className="text-xs text-text-secondary">
              Overall confidence based on source quality and consistency
            </div>
          </div>
        </div>
      </div>

      {/* Hallucination Guard Warning */}
      {hallucinationGuardText && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="p-4 rounded-xl bg-amber-50/80 border border-amber-300"
        >
          <div className="flex items-start gap-3">
            <FiAlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-1">
                Hallucination Guard
              </div>
              <p className="text-sm text-amber-800 leading-relaxed">
                {hallucinationGuardText}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Sources */}
      <div>
        <h3 className="text-sm font-bold text-text-dark uppercase tracking-wider mb-4 flex items-center gap-2">
          <span className="w-1 h-4 bg-brand-blue rounded"></span>
          Sources ({sources.length})
        </h3>

        <div className="space-y-4">
          {sources.map((source, index) => {
            const supportBadge = getSupportTypeBadge(source.supportType);
            const tierColor = getTierColor(source.tier);

            return (
              <motion.div
                key={source.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-5 rounded-xl bg-white/60 border border-gray-200"
                style={{
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)'
                }}
              >
                {/* Source Header */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getSupportTypeIcon(source.supportType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h4 className="text-base font-semibold text-text-dark leading-snug">
                        {source.title}
                      </h4>
                      {source.isLikelyReal && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded text-xs font-bold text-green-700 bg-green-100">
                          Verified
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-text-secondary mb-2">
                      <span className="font-medium">{source.publisher}</span>
                      {source.url && (
                        <>
                          <span>•</span>
                          <a
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-brand-blue hover:underline"
                          >
                            <span>View Source</span>
                            <FiExternalLink className="w-3 h-3" />
                          </a>
                        </>
                      )}
                    </div>

                    {/* Badges Row */}
                    <div className="flex flex-wrap items-center gap-2 mb-3">
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${supportBadge.color}`}
                      >
                        {supportBadge.label}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-bold text-white bg-gradient-to-r ${tierColor}`}
                      >
                        {source.tier} ({source.tierScore})
                      </span>
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${getConfidenceColor(source.confidence)}`}>
                        {source.confidence} Confidence
                      </span>
                    </div>

                    {/* Excerpt */}
                    {source.excerpt && (
                      <div className="mb-3 p-3 rounded-lg bg-gray-50/80 border border-gray-200">
                        <p className="text-sm text-text-dark leading-relaxed italic">
                          "{source.excerpt}"
                        </p>
                      </div>
                    )}

                    {/* Note */}
                    {source.note && (
                      <p className="text-xs text-text-secondary leading-relaxed">
                        <span className="font-semibold">Note:</span> {source.note}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {sources.length === 0 && (
          <div className="text-center text-text-secondary py-8">
            <p>No sources found for this claim.</p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default EvidenceTabContent;
