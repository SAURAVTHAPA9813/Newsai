import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SourceDiversityDonut = ({ sourceMetrics }) => {
  // Use actual source names instead of tiers
  const sourceDistribution = sourceMetrics?.sourceDistribution || [];

  const chartData = sourceDistribution.map((source) => ({
    name: source.name,
    displayName: source.name, // Actual source name (TechCrunch, BBC, etc.)
    value: source.sessionsCount || 0,
    count: source.sessionsCount || 0,
    minutes: source.minutesRead || 0,
    tier: source.tier || 'unknown'
  }));

  // Color palette for different sources
  const COLORS = [
    '#4169E1', // Blue
    '#10b981', // Green
    '#f97316', // Orange
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#f59e0b', // Amber
    '#06b6d4', // Cyan
    '#84cc16', // Lime
  ];

  // Assign colors to sources
  const getColor = (index) => COLORS[index % COLORS.length];

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm border border-brand-blue/20 rounded-lg p-3 shadow-lg">
          <p className="text-sm font-medium text-text-dark mb-1">
            {data.displayName}
          </p>
          <p className="text-xs text-text-secondary">
            Articles: <span className="font-bold text-text-dark">{data.count}</span>
          </p>
          <p className="text-xs text-text-secondary">
            Time: <span className="font-bold text-text-dark">{Math.round(data.minutes)} min</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <motion.div
      className="glassmorphism rounded-3xl p-6 border border-brand-blue/20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <div className="mb-4">
        <h2 className="text-xl font-bold text-text-dark font-cinzel mb-1">
          Source Diversity
        </h2>
        <p className="text-sm text-text-secondary">
          Where your information comes from
        </p>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomLabel}
            outerRadius={90}
            innerRadius={50}
            fill="#8884d8"
            dataKey="value"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getColor(index)} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {chartData.map((source, index) => (
          <div key={source.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getColor(index) }}
              ></div>
              <span className="text-text-secondary">{source.displayName}</span>
            </div>
            <span className="font-bold text-text-dark">{source.count} articles</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SourceDiversityDonut;
