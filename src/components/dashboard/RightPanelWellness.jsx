import { useState, useEffect } from 'react';
import { FiGlobe, FiWind, FiTrendingUp, FiRefreshCw, FiChevronRight } from 'react-icons/fi';
import mockDashboardAPI from '../../services/mockDashboardAPI';
import DecompressMode from './DecompressMode';

const RightPanelWellness = () => {
  const [globalVectors, setGlobalVectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDecompress, setShowDecompress] = useState(false);

  useEffect(() => {
    loadGlobalVectors();
  }, []);

  const loadGlobalVectors = async () => {
    setLoading(true);
    try {
      const data = await mockDashboardAPI.getGlobalVectors();
      setGlobalVectors(data);
    } catch (error) {
      console.error('Error loading global vectors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDecompressClick = () => {
    setShowDecompress(true);
  };

  const handleDecompressClose = () => {
    setShowDecompress(false);
  };

  return (
    <div className="space-y-6">
      {/* Decompress Mode Widget */}
      <div className="backdrop-filter backdrop-blur-md bg-gradient-to-br from-white/80 to-white/60 border border-white/40 rounded-3xl p-6 shadow-soft">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center">
            <FiWind className="text-white text-xl" />
          </div>
          <div>
            <h3 className="font-bold text-lg text-text-dark">Wellness</h3>
            <p className="text-xs text-text-secondary">Take a mindful break</p>
          </div>
        </div>

        <p className="text-sm text-text-secondary mb-4 leading-relaxed">
          Feeling overwhelmed by news? Take a moment to decompress with our guided breathing exercise.
        </p>

        <button
          onClick={handleDecompressClick}
          className="w-full py-3 bg-gradient-to-br from-cyan-500 to-blue-500 text-white font-semibold rounded-xl hover:shadow-lg hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2"
        >
          <FiWind className="text-xl" />
          Start Decompress Mode
        </button>

        <div className="mt-4 p-3 bg-cyan-50/50 rounded-lg border border-cyan-200/50">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse"></span>
            1-minute guided breathing exercise
          </div>
        </div>
      </div>

      {/* Global Vectors Widget */}
      <div className="backdrop-filter backdrop-blur-md bg-gradient-to-br from-white/80 to-white/60 border border-white/40 rounded-3xl p-6 shadow-soft">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
              <FiGlobe className="text-white text-xl" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-text-dark">Global Vectors</h3>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Live updates
              </div>
            </div>
          </div>
          <button
            onClick={loadGlobalVectors}
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white hover:scale-110 transition-all duration-300"
            title="Refresh"
          >
            <FiRefreshCw className="text-text-secondary text-sm" />
          </button>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-16 bg-white/40 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {globalVectors.map((vector, index) => (
              <div
                key={vector.id}
                className="group p-4 bg-white/70 backdrop-blur-sm border border-white/60 rounded-xl hover:shadow-md hover:scale-102 transition-all duration-300 cursor-pointer"
              >
                {/* Rank Badge */}
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 flex-shrink-0 bg-gradient-to-br from-brand-blue to-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-sm">{index + 1}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-text-dark leading-tight mb-1 line-clamp-2 group-hover:text-brand-blue transition-colors">
                      {vector.title}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-text-secondary">
                      <span className="px-2 py-0.5 bg-brand-blue/10 text-brand-blue rounded-full font-medium">
                        {vector.category}
                      </span>
                      <div className="flex items-center gap-1">
                        <FiTrendingUp className="text-green-600" />
                        <span>{vector.trendingScore}%</span>
                      </div>
                    </div>
                    <div className="text-xs text-text-secondary mt-1">{vector.updateTime}</div>
                  </div>

                  <FiChevronRight className="text-text-secondary group-hover:text-brand-blue group-hover:translate-x-1 transition-all" />
                </div>

                {/* Importance Bar */}
                <div className="mt-3">
                  <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-brand-blue to-blue-600 rounded-full transition-all duration-700"
                      style={{ width: `${vector.importance}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All */}
        <button className="mt-4 w-full py-2 text-sm font-semibold text-brand-blue hover:text-blue-600 hover:underline transition-colors">
          View All Trending Stories
        </button>
      </div>

      {/* Quick Stats Widget */}
      <div className="backdrop-filter backdrop-blur-md bg-gradient-to-br from-white/80 to-white/60 border border-white/40 rounded-3xl p-6 shadow-soft">
        <h3 className="font-bold text-text-dark mb-4">Your Reading Today</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Articles Read</span>
            <span className="text-lg font-bold text-brand-blue">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">Time Spent</span>
            <span className="text-lg font-bold text-green-600">18 min</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-text-secondary">IQ Score</span>
            <span className="text-lg font-bold text-purple-600">+5 pts</span>
          </div>
        </div>
      </div>

      {/* Decompress Mode Overlay */}
      {showDecompress && <DecompressMode onClose={handleDecompressClose} />}
    </div>
  );
};

export default RightPanelWellness;
