import { motion } from 'framer-motion';
import { FiShield } from 'react-icons/fi';
import { AiFillFire } from 'react-icons/ai';

const TopicCard = ({ topic, isSelected, onClick, index }) => {
  // Determine card styling based on priority
  const getPriorityScale = (priority) => {
    if (priority >= 85) return 1.1;
    if (priority >= 70) return 1.05;
    if (priority >= 50) return 1;
    return 0.95;
  };

  // Determine glow intensity based on trend
  const getTrendGlow = (trendScore) => {
    if (trendScore >= 150) return 'rgba(255, 100, 100, 0.3)';
    if (trendScore >= 100) return 'rgba(255, 165, 0, 0.3)';
    return 'rgba(65, 105, 225, 0.15)';
  };

  // Determine border style based on firewall status
  const getBorderStyle = () => {
    if (topic.firewallStatus === 'BLOCKED') {
      return 'border-2 border-red-500';
    }
    if (topic.firewallStatus === 'LIMITED') {
      return 'border-2 border-dashed border-amber-500';
    }
    if (isSelected) {
      return 'border-2 border-brand-blue ring-2 ring-brand-blue/30';
    }
    return 'border border-brand-blue/20';
  };

  const scale = getPriorityScale(topic.priority);
  const showTrendBadge = topic.trendScore >= 100;
  const showFirewallBadge = topic.firewallStatus !== 'ALLOWED';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: scale * 1.02, y: -2 }}
      whileTap={{ scale: scale * 0.98 }}
      onClick={() => onClick(topic.id)}
      className={`rounded-2xl p-4 cursor-pointer transition-all ${getBorderStyle()} ${
        topic.firewallStatus === 'BLOCKED' ? 'opacity-50' : 'opacity-100'
      }`}
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        boxShadow: `0 4px 16px ${getTrendGlow(topic.trendScore)}`,
        transform: `scale(${scale})`
      }}
    >
      {/* Category Label & Badges */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
          {topic.categories.slice(0, 2).join(' · ')}
        </div>
        <div className="flex gap-1">
          {showTrendBadge && (
            <AiFillFire className="text-sm text-orange-500" title={`Trending +${topic.trendScore}%`} />
          )}
          {showFirewallBadge && (
            <FiShield className="text-sm text-brand-blue" title={`Firewall: ${topic.firewallStatus}`} />
          )}
        </div>
      </div>

      {/* Topic Name */}
      <h3 className="text-base font-bold text-text-dark mb-2 leading-snug">
        {topic.name}
      </h3>

      {/* Description */}
      <p className="text-xs text-text-secondary leading-relaxed mb-3 line-clamp-2">
        {topic.description}
      </p>

      {/* Stats */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="text-text-secondary">
            Priority: <span className="font-semibold text-text-dark">{topic.priority}</span>
          </span>
        </div>
        {topic.trendScore > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-green-600 font-semibold">+{topic.trendScore}%</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default TopicCard;
