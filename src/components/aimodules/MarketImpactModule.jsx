import { useState, useEffect } from 'react';
import { FiX, FiLoader, FiDollarSign, FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import mockDashboardAPI from '../../services/mockDashboardAPI';

const MarketImpactModule = ({ articleId, onClose }) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMarketImpact();
  }, [articleId]);

  const loadMarketImpact = async () => {
    setLoading(true);
    try {
      const result = await mockDashboardAPI.getMarketImpact(articleId);
      setData(result);
    } catch (error) {
      console.error('Error loading market impact:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <FiLoader className="text-brand-blue text-2xl animate-spin" />
        <span className="ml-3 text-text-secondary">Analyzing market impact...</span>
      </div>
    );
  }

  if (!data) return null;

  const getRiskColor = (risk) => {
    const colors = {
      LOW: 'text-green-600 bg-green-100',
      MODERATE: 'text-yellow-600 bg-yellow-100',
      HIGH: 'text-red-600 bg-red-100'
    };
    return colors[risk] || colors.MODERATE;
  };

  const getImpactIcon = (impact) => {
    switch (impact) {
      case 'POSITIVE':
        return <FiTrendingUp className="text-green-600" />;
      case 'NEGATIVE':
        return <FiTrendingDown className="text-red-600" />;
      default:
        return <FiMinus className="text-gray-600" />;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/40">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
            <FiDollarSign className="text-white" />
          </div>
          <div>
            <h4 className="font-bold text-text-dark">Market Impact Analysis</h4>
            <p className="text-xs text-text-secondary">Financial implications</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/70 hover:bg-white transition-colors"
        >
          <FiX className="text-text-secondary" />
        </button>
      </div>

      {/* Overall Risk */}
      <div className="mb-4 p-4 bg-white/70 rounded-xl border border-white/60">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-text-dark">Overall Risk Level:</span>
          <span className={`px-3 py-1 rounded-full text-sm font-bold ${getRiskColor(data.overallRisk)}`}>
            {data.overallRisk}
          </span>
        </div>
        <div className="mt-3">
          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500"
              style={{ width: `${data.riskScore}%` }}
            ></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs text-text-secondary">Low Risk</span>
            <span className="text-xs font-semibold text-text-dark">{data.riskScore}/100</span>
            <span className="text-xs text-text-secondary">High Risk</span>
          </div>
        </div>
      </div>

      {/* Affected Sectors */}
      <div className="mb-4">
        <h5 className="font-semibold text-text-dark mb-3 text-sm">Affected Sectors:</h5>
        <div className="space-y-2">
          {data.affectedSectors.map((sector, index) => (
            <div key={index} className="p-3 bg-white/70 rounded-lg border border-white/60">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  {getImpactIcon(sector.impact)}
                  <span className="font-semibold text-sm text-text-dark">{sector.sector}</span>
                </div>
                <span
                  className={`text-sm font-bold ${
                    sector.impact === 'POSITIVE' ? 'text-green-600' : sector.impact === 'NEGATIVE' ? 'text-red-600' : 'text-gray-600'
                  }`}
                >
                  {sector.change}
                </span>
              </div>
              <p className="text-xs text-text-secondary">{sector.reason}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Stocks to Watch */}
      <div className="mb-4">
        <h5 className="font-semibold text-text-dark mb-3 text-sm">Stocks to Watch:</h5>
        <div className="grid grid-cols-2 gap-2">
          {data.stocksToWatch.map((stock, index) => (
            <div key={index} className="p-3 bg-white/70 rounded-lg border border-white/60 text-center">
              <div className="font-bold text-brand-blue text-lg">{stock.ticker}</div>
              <div className="text-xs text-text-secondary mb-1">{stock.name}</div>
              <div className="flex items-center justify-center gap-1">
                {stock.movement === 'UP' ? (
                  <FiTrendingUp className="text-green-600 text-sm" />
                ) : (
                  <FiTrendingDown className="text-red-600 text-sm" />
                )}
                <span className="text-xs text-text-secondary">{stock.confidence}% confidence</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Investment Recommendations */}
      <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-200/50">
        <h5 className="font-semibold text-text-dark mb-2 text-sm">Investment Recommendations:</h5>
        <ul className="space-y-2">
          {data.investmentRecommendations.map((rec, index) => (
            <li key={index} className="flex items-start gap-2 text-xs text-text-secondary">
              <span className="text-brand-blue mt-0.5">•</span>
              <span>{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MarketImpactModule;
