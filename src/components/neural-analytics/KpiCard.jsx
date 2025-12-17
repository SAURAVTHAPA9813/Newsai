import { motion } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';

const KpiCard = ({ kpi }) => {
  const { label, value, changePercent, description } = kpi;
  const isPositive = changePercent > 0;
  const isNegative = changePercent < 0;

  return (
    <motion.div
      className="glassmorphism rounded-2xl p-6 border border-brand-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-sm font-medium text-text-secondary uppercase tracking-wider">
          {label}
        </h3>
        {changePercent !== 0 && (
          <div
            className={`flex items-center gap-1 text-xs font-medium ${
              isPositive ? 'text-green-600' : isNegative ? 'text-red-500' : 'text-gray-500'
            }`}
          >
            {isPositive ? (
              <FiTrendingUp className="w-3 h-3" />
            ) : isNegative ? (
              <FiTrendingDown className="w-3 h-3" />
            ) : null}
            <span>{Math.abs(changePercent).toFixed(1)}%</span>
          </div>
        )}
      </div>

      <div className="mb-2">
        <div className="text-4xl font-bold text-brand-blue font-cinzel">
          {value}
        </div>
      </div>

      <p className="text-xs text-text-secondary leading-relaxed">
        {description}
      </p>
    </motion.div>
  );
};

export default KpiCard;
