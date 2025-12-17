import { useState, useEffect } from 'react';
import { FiX, FiLoader, FiShuffle, FiCheckCircle } from 'react-icons/fi';
import mockDashboardAPI from '../../services/mockDashboardAPI';

const PerspectivesModule = ({ articleId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    loadPerspectives();
  }, [articleId]);

  const loadPerspectives = async () => {
    setLoading(true);
    try {
      const result = await mockDashboardAPI.getPerspectives(articleId);
      setData(result);
    } catch (error) {
      console.error('Error loading perspectives:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FiLoader className="text-brand-blue text-2xl animate-spin" />
        <span className="ml-3 text-text-secondary">Analyzing different perspectives...</span>
      </div>
    );
  }

  if (!data) return null;

  const colors = [
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600'
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <FiShuffle className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-text-dark">Multiple Perspectives</h4>
            <p className="text-xs text-text-secondary">Break the echo chamber</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white transition-colors"
        >
          <FiX className="text-text-secondary" />
        </button>
      </div>

      {/* Perspective Tabs */}
      <div className="mb-4">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {data.perspectives.map((perspective, index) => (
            <button
              key={index}
              onClick={() => setActiveTab(index)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                activeTab === index
                  ? `bg-gradient-to-br ${colors[index]} text-white shadow-lg scale-105`
                  : 'bg-white/70 text-text-secondary hover:bg-white'
              }`}
            >
              {perspective.viewpoint}
            </button>
          ))}
        </div>
      </div>

      {/* Active Perspective Content */}
      <div className="space-y-4">
        {data.perspectives[activeTab] && (
          <>
            {/* Stance */}
            <div className="p-4 bg-gradient-to-br from-white/90 to-white/70 rounded-xl border border-white/60">
              <p className="text-sm text-text-dark leading-relaxed font-medium">
                {data.perspectives[activeTab].stance}
              </p>
            </div>

            {/* Key Arguments */}
            <div>
              <h5 className="font-semibold text-text-dark mb-3 text-sm">Key Arguments:</h5>
              <div className="space-y-2">
                {data.perspectives[activeTab].keyArguments.map((argument, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 bg-white/70 rounded-lg border border-white/60"
                  >
                    <FiCheckCircle className="text-brand-blue text-sm mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-text-secondary">{argument}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Sources */}
            {data.perspectives[activeTab].sources && data.perspectives[activeTab].sources.length > 0 && (
              <div>
                <h5 className="font-semibold text-text-dark mb-2 text-sm">Sources:</h5>
                <div className="flex flex-wrap gap-2">
                  {data.perspectives[activeTab].sources.map((source, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-white/70 border border-white/60 rounded-full text-xs text-text-secondary"
                    >
                      {source}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Consensus & Disagreement Areas */}
      <div className="mt-4 space-y-3">
        {/* Consensus */}
        {data.consensusAreas && data.consensusAreas.length > 0 && (
          <div className="p-4 bg-green-50/50 rounded-xl border border-green-200/50">
            <h5 className="font-semibold text-green-700 mb-2 text-sm flex items-center gap-2">
              <span>✓</span> Areas of Consensus:
            </h5>
            <ul className="space-y-1">
              {data.consensusAreas.map((area, index) => (
                <li key={index} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-green-600 mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Disagreement */}
        {data.disagreementAreas && data.disagreementAreas.length > 0 && (
          <div className="p-4 bg-red-50/50 rounded-xl border border-red-200/50">
            <h5 className="font-semibold text-red-700 mb-2 text-sm flex items-center gap-2">
              <span>⚠</span> Areas of Disagreement:
            </h5>
            <ul className="space-y-1">
              {data.disagreementAreas.map((area, index) => (
                <li key={index} className="text-xs text-text-secondary flex items-start gap-2">
                  <span className="text-red-600 mt-0.5">•</span>
                  <span>{area}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default PerspectivesModule;
