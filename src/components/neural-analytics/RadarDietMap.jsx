import { motion } from 'framer-motion';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const RadarDietMap = ({ topicMetrics }) => {
  // Aggregate by category and normalize to 0-100
  const categoryData = {};
  topicMetrics.forEach((topic) => {
    if (!categoryData[topic.category]) {
      categoryData[topic.category] = 0;
    }
    categoryData[topic.category] += topic.minutesRead;
  });

  const totalMinutes = Object.values(categoryData).reduce((sum, val) => sum + val, 0);

  const radarData = Object.entries(categoryData).map(([category, minutes]) => ({
    category: category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' '),
    value: totalMinutes > 0 ? Math.round((minutes / totalMinutes) * 100) : 0,
  }));

  // Generate insight text
  const getInsightText = () => {
    if (radarData.length === 0) return 'No data available';

    const sorted = [...radarData].sort((a, b) => b.value - a.value);
    const top = sorted[0];
    const bottom = sorted[sorted.length - 1];

    if (top.value > 40) {
      return `Heavy tilt toward ${top.category} (${top.value}%) vs ${bottom.category} (${bottom.value}%).`;
    } else {
      return `Balanced distribution across topics.`;
    }
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-brand-blue/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-dark">
            {payload[0].payload.category}
          </p>
          <p className="text-xs text-brand-blue font-bold">
            {payload[0].value}% of reading time
          </p>
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
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Information Surface Area
        </h2>
        <p className="text-sm text-text-secondary">Radar Diet Map</p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={radarData}>
          <PolarGrid stroke="#cbd5e1" opacity={0.3} />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fontSize: 12, fill: '#64748b' }}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: '#64748b' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Radar
            name="Reading Time"
            dataKey="value"
            stroke="#4169E1"
            fill="#4169E1"
            fillOpacity={0.5}
          />
        </RadarChart>
      </ResponsiveContainer>

      <div className="mt-4 p-3 bg-brand-blue/5 rounded-lg">
        <p className="text-xs text-text-secondary italic">{getInsightText()}</p>
      </div>
    </motion.div>
  );
};

export default RadarDietMap;
