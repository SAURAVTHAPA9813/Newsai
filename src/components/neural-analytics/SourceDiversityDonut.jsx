import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SourceDiversityDonut = ({ sourceMetrics }) => {
  // Aggregate by tier
  const tierData = {};
  sourceMetrics.forEach((source) => {
    const tier = source.tier || 'UNKNOWN';
    if (!tierData[tier]) {
      tierData[tier] = {
        name: tier,
        value: 0,
        count: 0,
        minutes: 0,
      };
    }
    tierData[tier].value += source.articlesCount;
    tierData[tier].count += source.articlesCount;
    tierData[tier].minutes += source.minutesRead;
  });

  const chartData = Object.values(tierData).map((tier) => ({
    ...tier,
    displayName:
      tier.name === 'TIER_1'
        ? 'Tier 1 (Major outlets)'
        : tier.name === 'TIER_2'
        ? 'Tier 2 (Niche/Specialty)'
        : tier.name === 'TIER_3'
        ? 'Tier 3 (Unknown/Low-rep)'
        : 'Unknown',
  }));

  const COLORS = {
    TIER_1: '#10b981',
    TIER_2: '#4169E1',
    TIER_3: '#f97316',
    UNKNOWN: '#94a3b8',
  };

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
              <Cell key={`cell-${index}`} fill={COLORS[entry.name] || COLORS.UNKNOWN} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      <div className="mt-4 space-y-2">
        {chartData.map((tier) => (
          <div key={tier.name} className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[tier.name] || COLORS.UNKNOWN }}
              ></div>
              <span className="text-text-secondary">{tier.displayName}</span>
            </div>
            <span className="font-bold text-text-dark">{tier.count} articles</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default SourceDiversityDonut;
