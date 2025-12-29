import { useState } from "react";
import { motion } from "framer-motion";
import {
  FiDollarSign,
  FiMapPin,
  FiHeart,
  FiBriefcase,
  FiZap,
  FiBookOpen,
  FiShuffle,
  FiClock,
  FiBookmark,
  FiShare2,
  FiTrendingUp,
  FiShield,
  FiGlobe,
} from "react-icons/fi";
import SourceScoreBar from "./SourceScoreBar";
import VerificationBadge from "./VerificationBadge";
import ImpactTags from "./ImpactTags";
import Icon from "../common/Icon";
import IconButton from "../common/IconButton";

// Skeleton loading component
const ArticleCardSkeleton = () => (
  <div className="relative bg-white/80 backdrop-blur-sm rounded-2xl border border-serenity-blue-light overflow-hidden shadow-card">
    <div className="animate-pulse">
      {/* Image skeleton */}
      <div className="relative h-48 bg-gray-300"></div>

      {/* Content skeleton */}
      <div className="p-6">
        {/* Title skeleton */}
        <div className="h-6 bg-gray-300 rounded mb-3 w-3/4"></div>
        <div className="h-6 bg-gray-300 rounded mb-4 w-1/2"></div>

        {/* Impact tags skeleton */}
        <div className="flex gap-2 mb-4">
          <div className="h-8 w-20 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>

        {/* Footer skeleton */}
        <div className="flex items-center justify-between">
          <div className="h-4 bg-gray-200 rounded w-32"></div>
          <div className="h-4 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

const HolographicArticleCard = ({ article, readingMode, onClick }) => {
  const [isSaved, setIsSaved] = useState(false);

  const {
    id,
    title,
    currentSummary,
    sourceScore,
    verificationBadge,
    impactTags = [],
    anxietyScore,
    category,
    imageUrl,
    publishedAt,
    readTime,
    source,
    author,
  } = article;

  // Format date to readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Recently";

    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // Show relative time if recent
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    // Otherwise show formatted date
    const options = { month: "short", day: "numeric", year: "numeric" };
    return date.toLocaleDateString("en-US", options);
  };

  // Determine if anxiety guard should be active
  const isAnxietyGuard = anxietyScore > 70;

  // Get edge glow color based on trust score (sourceScore)
  const getEdgeGlowColor = (score) => {
    if (score >= 85)
      return {
        border: "border-green-300/50",
        glow: "shadow-green-300/20",
        color: "#10B981",
      };
    if (score >= 70)
      return {
        border: "border-yellow-300/50",
        glow: "shadow-yellow-300/20",
        color: "#F59E0B",
      };
    if (score >= 50)
      return {
        border: "border-orange-300/50",
        glow: "shadow-orange-300/20",
        color: "#F97316",
      };
    return {
      border: "border-red-500/50",
      glow: "shadow-red-300/20",
      color: "#EF4444",
    };
  };

  const edgeGlow = getEdgeGlowColor(sourceScore);

  // Calculate credibility percentage (based on sourceScore and verification)
  const credibilityScore = Math.round(
    (sourceScore +
      (verificationBadge === "verified"
        ? 10
        : verificationBadge === "cross-verified"
        ? 15
        : 0)) *
      0.9
  );

  const handleSave = (e) => {
    e.stopPropagation();
    setIsSaved(!isSaved);
  };

  const handleShare = (e) => {
    e.stopPropagation();
    // Mock share functionality
    console.log("Sharing article:", title);
  };

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className={`group relative backdrop-filter backdrop-blur-card border-2 rounded-3xl transition-all duration-300 overflow-hidden cursor-pointer hover-serenity-glow ${
        isAnxietyGuard ? "border-anxiety-amber shadow-anxiety" : edgeGlow.border
      }`}
      style={{
        background:
          "linear-gradient(125deg, rgba(255, 252, 252, 1) 0%, rgba(209, 233, 255, 1) 100%, rgba(242, 246, 255, 1) 53%)",
        boxShadow: isAnxietyGuard
          ? undefined
          : `0 10px 40px -10px ${edgeGlow.color}40, 0 0 0 1px ${edgeGlow.color}20`,
      }}
      onClick={onClick}
    >
      {/* Anxiety Guard Indicator */}
      {isAnxietyGuard && (
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-amber-500/20 backdrop-blur-md border border-amber-500/30 rounded-full flex items-center gap-2">
          <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
          <span className="text-xs font-medium text-amber-700">
            Anxiety Guard
          </span>
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
          border: `1px solid ${edgeGlow.color}40`,
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

        {/* Impact Tags */}
        <div className="mb-4">
          <ImpactTags tags={impactTags} />
        </div>

        {/* Bottom Metadata */}
        <div className="flex items-center justify-between pt-4 border-t border-white/40">
          <div className="flex items-center gap-3 text-xs text-text-secondary">
            <div className="flex items-center gap-1">
              <Icon icon={FiClock} size="xs" color="primary" decorative />
              <span>{formatDate(publishedAt)}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1">
              <Icon icon={FiBookOpen} size="xs" color="primary" decorative />
              <span>{readTime}</span>
            </div>
          </div>

          {/* Source */}
          <div className="flex items-center gap-2">
            <Icon icon={FiGlobe} size="xs" color="primary" decorative />
            <span className="text-xs font-medium text-text-dark">
              {source.name}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HolographicArticleCard;
export { ArticleCardSkeleton };
