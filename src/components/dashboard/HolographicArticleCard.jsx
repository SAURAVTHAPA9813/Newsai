import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiDollarSign, FiMapPin, FiHeart, FiBriefcase, FiZap, FiBookOpen, FiShuffle, FiClock, FiBookmark, FiShare2, FiTrendingUp, FiShield } from 'react-icons/fi';
import SourceScoreBar from './SourceScoreBar';
import VerificationBadge from './VerificationBadge';
import ImpactTags from './ImpactTags';
import AICommandDrawer from './AICommandDrawer';
import Icon from '../common/Icon';
import IconButton from '../common/IconButton';

const HolographicArticleCard = ({ article, readingMode, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [showAIModules, setShowAIModules] = useState(false);

  const {
    id,
    title,
    currentSummary,
    sourceScore,
    verificationBadge,
    impactTags,
    anxietyScore,
    category,
    imageUrl,
    publishedAt,
    readTime,
    source,
    author,
    viralityTrend // Array of 24 data points for sparkline
  } = article;

  // Determine if anxiety guard should be active
  const isAnxietyGuard = anxietyScore > 70;

  // Get edge glow color based on trust score (sourceScore)
  const getEdgeGlowColor = (score) => {
    if (score >= 85) return { border: 'border-green-300/50', glow: 'shadow-green-300/20', color: '#10B981' };
    if (score >= 70) return { border: 'border-yellow-300/50', glow: 'shadow-yellow-300/20', color: '#F59E0B' };
    if (score >= 50) return { border: 'border-orange-300/50', glow: 'shadow-orange-300/20', color: '#F97316' };
    return { border: 'border-red-500/50', glow: 'shadow-red-300/20', color: '#EF4444' };
  };

  const edgeGlow = getEdgeGlowColor(sourceScore);

  // Mock virality trend data if not provided (24 data points)
  const defaultViralityTrend = Array.from({ length: 24 }, (_, i) => Math.random() * 100 + i * 2);
  const trendData = viralityTrend || defaultViralityTrend;

  // Calculate credibility percentage (based on sourceScore and verification)
  const credibilityScore = Math.round((sourceScore + (verificationBadge === 'verified' ? 10 : verificationBadge === 'cross-verified' ? 15 : 0)) * 0.9);

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Mock share functionality
    console.log('Sharing article:', title);
  };

  const handleAIModuleToggle = (e) => {
    e.stopPropagation();
    setShowAIModules(!showAIModules);
  };

  // Sparkline component
  const Sparkline = ({ data }) => {
    const maxValue = Math.max(...data);
    const minValue = Math.min(...data);
    const range = maxValue - minValue || 1;

    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 100;
      const y = 100 - ((value - minValue) / range) * 100;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg className="w-full h-8" viewBox="0 0 100 100" preserveAspectRatio="none">
        <polyline
          points={points}
          fill="none"
          stroke={edgeGlow.color}
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={`0,100 ${points} 100,100`}
          fill={`url(#gradient-${id})`}
          opacity="0.2"
        />
        <defs>
          <linearGradient id={`gradient-${id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={edgeGlow.color} stopOpacity="0.5" />
            <stop offset="100%" stopColor={edgeGlow.color} stopOpacity="0" />
          </linearGradient>
        </defs>
      </svg>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      className={`group relative backdrop-filter backdrop-blur-card border-2 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer hover-serenity-glow ${
        isAnxietyGuard
          ? 'border-anxiety-amber shadow-anxiety'
          : edgeGlow.border
      }`}
      style={{
        background: 'linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)',
        boxShadow: isAnxietyGuard
          ? undefined
          : `0 10px 40px -10px ${edgeGlow.color}40, 0 0 0 1px ${edgeGlow.color}20`
      }}
      onClick={onClick}
    >
      {/* Anxiety Guard Indicator */}
      {isAnxietyGuard && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-amber-700">Anxiety Guard</span>
        </div>
      )}

      {/* Credibility Score Badge - Top Right */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 z-10 px-3 py-1.5 backdrop-blur-md rounded-full flex items-center gap-2"
        style={{
          background: `${edgeGlow.color}15`,
          border: `1px solid ${edgeGlow.color}40`
        }}
        aria-label={`${credibilityScore}% verified credibility score`}
      >
        <Icon
          icon={FiShield}
          size="xs"
          className="text-current"
          style={{ color: edgeGlow.color }}
          decorative
        />
        <span className="text-xs font-bold" style={{ color: edgeGlow.color }}>
          {credibilityScore}% verified
        </span>
      </motion.div>

      {/* Top Section - Source Score & Verification */}
      <div className="relative p-4 pb-0 pt-12">
        <div className="flex items-center justify-between mb-3">
          {/* Verification Badge */}
          <VerificationBadge status={verificationBadge} />

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition-colors"
              aria-label={isSaved ? 'Remove bookmark' : 'Save article'}
            >
              <Icon
                icon={FiBookmark}
                size="sm"
                className={isSaved ? 'fill-serenity-royal text-serenity-royal' : 'text-text-secondary'}
                decorative
              />
            </button>
            <button
              onClick={handleShare}
              className="w-8 h-8 flex items-center justify-center rounded-full bg-white/70 hover:bg-white transition-colors"
              aria-label="Share article"
            >
              <Icon
                icon={FiShare2}
                size="sm"
                color="secondary"
                decorative
              />
            </button>
          </div>
        </div>

        {/* Source Score Bar */}
        <SourceScoreBar score={sourceScore} sourceName={source.name} />
      </div>

      {/* Image Section */}
      <div className="relative px-4 py-3">
        <div className="relative h-48 rounded-2xl overflow-hidden">
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>

          {/* Category Badge */}
          <div className="absolute bottom-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full">
            <span className="text-xs font-semibold text-text-dark uppercase tracking-wider">
              {category}
            </span>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="px-6 py-4">
        {/* Title */}
        <h3 className="text-lg font-bold text-text-dark leading-tight mb-3 line-clamp-2 group-hover:text-serenity-royal transition-colors">
          {title}
        </h3>

        {/* Summary */}
        <p className={`text-sm text-text-secondary leading-relaxed mb-4 ${
          readingMode === '5m' ? 'line-clamp-2' : readingMode === '15m' ? 'line-clamp-3' : 'line-clamp-4'
        }`}>
          {currentSummary}
        </p>

        {/* Impact Tags */}
        <div className="mb-4">
          <ImpactTags tags={impactTags} />
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-white/40">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Icon
                icon={FiClock}
                size="xs"
                color="primary"
                decorative
              />
              <span>{publishedAt}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Icon
                icon={FiBookOpen}
                size="xs"
                color="primary"
                decorative
              />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-text-dark">{source.name}</span>
          </div>
        </div>
      </div>

      {/* Virality Trend Sparkline */}
      <div className="px-6 pb-4">
        <div className="p-3 rounded-xl bg-white/40 backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Icon
                icon={FiTrendingUp}
                size="xs"
                className="text-current"
                style={{ color: edgeGlow.color }}
                decorative
              />
              <span className="text-xs font-semibold text-text-secondary">24h Virality Trend</span>
            </div>
            <span className="text-xs font-bold" style={{ color: edgeGlow.color }}>
              +{Math.round((trendData[trendData.length - 1] / trendData[0] - 1) * 100)}%
            </span>
          </div>
          <Sparkline data={trendData} />
        </div>
      </div>

      {/* AI Command Drawer */}
      <AICommandDrawer
        articleId={id}
        isOpen={true}
        onClose={() => {}}
      />

    
    </motion.div>
  );
};

export default HolographicArticleCard;
