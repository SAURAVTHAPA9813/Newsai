import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

const TopicTrendTimeline = ({ data }) => {
  const [hiddenCategories, setHiddenCategories] = useState([]);

  const categories = [
    { key: 'TECH', name: 'Technology', color: '#4169E1' },
    { key: 'FINANCE', name: 'Finance', color: '#10b981' },
    { key: 'POLITICS', name: 'Politics', color: '#f59e0b' },
    { key: 'SCIENCE', name: 'Science', color: '#8b5cf6' },
    { key: 'HEALTH', name: 'Health', color: '#ec4899' },
  ];

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const toggleCategory = (categoryKey) => {
    setHiddenCategories((prev) =>
      prev.includes(categoryKey)
        ? prev.filter((k) => k !== categoryKey)
        : [...prev, categoryKey]
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-brand-blue/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-dark mb-2">
            {formatDate(label)}
          </p>
          {payload
            .filter((entry) => !hiddenCategories.includes(entry.dataKey))
            .map((entry, index) => (
              <p
                key={`item-${index}`}
                className="text-xs"
                style={{ color: entry.color }}
              >
                {entry.name}: <span className="font-bold">{Math.round(entry.value)}</span> min
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
      <div className="mb-6">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Topic Trends
        </h2>
        <p className="text-sm text-text-secondary">
          What's dominating your attention?
        </p>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <AreaChart
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
            label={{ value: 'Minutes', angle: -90, position: 'insideLeft', style: { fontSize: 12, fill: '#64748b' } }}
            tick={{ fontSize: 12, fill: '#64748b' }}
            stroke="#cbd5e1"
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{ fontSize: '13px', paddingTop: '10px' }}
            iconType="circle"
            onClick={(e) => toggleCategory(e.dataKey)}
            style={{ cursor: 'pointer' }}
          />
          {categories.map((category) => (
            <Area
              key={category.key}
              type="monotone"
              dataKey={category.key}
              stackId="1"
              stroke={category.color}
              fill={category.color}
              fillOpacity={0.6}
              name={category.name}
              hide={hiddenCategories.includes(category.key)}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>

      <p className="text-xs text-text-secondary mt-4 italic">
        Click legend items to toggle topics
      </p>
    </motion.div>
  );
};

export default TopicTrendTimeline;
