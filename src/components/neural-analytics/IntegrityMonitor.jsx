import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const IntegrityMonitor = ({ data }) => {
  const chartData = [
    {
      name: 'Content Type',
      Verified: data.verified,
      Unverified: data.unverified,
      Opinion: data.opinion,
    },
  ];

  const COLORS = {
    Verified: '#10b981',
    Unverified: '#f97316',
    Opinion: '#6366f1',
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-brand-blue/20 rounded-lg p-3 shadow-lg">
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-xs mb-1"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-bold">{entry.value}%</span>
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-6 border border-brand-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Integrity Monitor
        </h2>
        <p className="text-sm text-text-secondary">
          Verified vs. Unknown vs. Opinion
        </p>
      </div>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
          <YAxis type="category" dataKey="name" hide />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="Verified" stackId="a" fill={COLORS.Verified} radius={[0, 0, 0, 0]} />
          <Bar dataKey="Unverified" stackId="a" fill={COLORS.Unverified} />
          <Bar dataKey="Opinion" stackId="a" fill={COLORS.Opinion} radius={[0, 8, 8, 0]} />
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-6 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-text-secondary">Verified / Fact-checked</span>
          </div>
          <span className="font-bold text-text-dark">{data.verified}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-orange-500"></div>
            <span className="text-text-secondary">Unverified / Low-confidence</span>
          </div>
          <span className="font-bold text-text-dark">{data.unverified}%</span>
        </div>
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
            <span className="text-text-secondary">Opinion / Commentary</span>
          </div>
          <span className="font-bold text-text-dark">{data.opinion}%</span>
        </div>
      </div>
    </motion.div>
  );
};

export default IntegrityMonitor;
