import { motion } from 'framer-motion';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const CognitiveImpactChart = ({ data }) => {
  // Format date for display
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-brand-blue/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-dark mb-2">
            {formatDate(label)}
          </p>
          {payload.map((entry, index) => (
            <p
              key={`item-${index}`}
              className="text-xs"
              style={{ color: entry.color }}
            >
              {entry.name}: <span className="font-bold">{entry.value}</span>
              {entry.dataKey === 'minutesRead' ? ' min' : '/100'}
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
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Cognitive Impact
        </h2>
        <p className="text-sm text-text-secondary">
          Reading time vs. anxiety over time
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" opacity={0.5} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
          />
          <YAxis
            yAxisId="left"
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
          />
          <YAxis
            yAxisId="right"
            orientation="right"
            label={{ value: 'Anxiety (0-100)', angle: 90, position: 'insideRight', style: { fontSize: 12, fill: '#64748b' } }}
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
            iconType="circle"
          />
          <Bar
            yAxisId="left"
            dataKey="minutesRead"
            fill="#4169E1"
            name="Reading Time"
            radius={[8, 8, 0, 0]}
            opacity={0.8}
          />
          <Line
            yAxisId="right"
            type="monotone"
            dataKey="averageAnxiety"
            stroke="#f97316"
            strokeWidth={3}
            name="Anxiety Level"
            dot={{ r: 4, fill: '#f97316' }}
            activeDot={{ r: 6 }}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CognitiveImpactChart;
