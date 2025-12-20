import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import Icon from '../common/Icon';

const VerificationBadge = ({ status }) => {
  const getbadgeConfig = () => {
    // Normalize status to lowercase for comparison
    const normalizedStatus = status?.toLowerCase();

    switch (normalizedStatus) {
      case 'cross-verified':
        return {
          icon: FiCheckCircle,
          iconColor: 'verified',
          label: 'CROSS-VERIFIED',
          bgColor: 'bg-emerald-500/20',
          borderColor: 'border-emerald-500/30',
          textColor: 'text-emerald-700',
          glowColor: 'shadow-emerald-500/25',
          description: 'Tier 1 source: Reuters, AP, BBC, NYT, WSJ, Bloomberg'
        };
      case 'verified':
        return {
          icon: FiCheckCircle,
          iconColor: 'verified',
          label: 'VERIFIED',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-700',
          glowColor: 'shadow-green-500/25',
          description: 'Tier 2 source: CNN, Forbes, TechCrunch, NBC, CBS'
        };
      case 'reviewing':
        return {
          icon: FiAlertCircle,
          iconColor: 'likely',
          label: 'REVIEWING',
          bgColor: 'bg-yellow-500/20',
          borderColor: 'border-yellow-500/30',
          textColor: 'text-yellow-700',
          glowColor: 'shadow-yellow-500/25',
          description: 'Tier 3 source: Moderate credibility, fact-checking in progress'
        };
      case 'unverified':
        return {
          icon: FiAlertCircle,
          iconColor: 'unverified',
          label: 'UNVERIFIED',
          bgColor: 'bg-orange-500/20',
          borderColor: 'border-orange-500/40',
          textColor: 'text-orange-700',
          glowColor: 'shadow-orange-500/30',
          description: 'Unknown source or low credibility'
        };
      // Legacy support for old status values
      case 'likely_true':
        return {
          icon: FiCheckCircle,
          iconColor: 'likely',
          label: 'LIKELY TRUE',
          bgColor: 'bg-cyan-500/20',
          borderColor: 'border-cyan-500/30',
          textColor: 'text-cyan-700',
          description: 'High confidence from trusted source'
        };
      case 'misleading':
        return {
          icon: FiXCircle,
          iconColor: 'misleading',
          label: 'MISLEADING',
          bgColor: 'bg-red-500/20',
          borderColor: 'border-red-500/30',
          textColor: 'text-red-700',
          description: 'Contains potential falsehoods or clickbait'
        };
      default:
        return {
          icon: FiAlertCircle,
          iconColor: 'unverified',
          label: 'UNKNOWN',
          bgColor: 'bg-gray-400/20',
          borderColor: 'border-gray-400/30',
          textColor: 'text-gray-600',
          description: 'Verification status unavailable'
        };
    }
  };

  const config = getbadgeConfig();

  return (
    <div
      className="group/badge relative"
      role="status"
      aria-label={`${config.label}: ${config.description}`}
    >
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 ${config.bgColor} ${config.borderColor} border backdrop-blur-md rounded-full ${config.glowColor ? `shadow-lg ${config.glowColor}` : ''}`}
      >
        <Icon
          icon={config.icon}
          size="sm"
          color={config.iconColor}
          decorative
        />
        <span className={`text-xs font-bold ${config.textColor} uppercase tracking-wide`}>
          {config.label}
        </span>
      </div>

      {/* Tooltip */}
      <div
        className="absolute left-0 top-full mt-2 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 invisible group-hover/badge:opacity-100 group-hover/badge:visible transition-all duration-200 whitespace-nowrap z-10"
        role="tooltip"
      >
        {config.description}
        <div className="absolute bottom-full left-4 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
      </div>
    </div>
  );
};

export default VerificationBadge;
