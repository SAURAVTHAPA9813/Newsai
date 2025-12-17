import { FiCheckCircle, FiAlertCircle, FiXCircle } from 'react-icons/fi';
import Icon from '../common/Icon';

const VerificationBadge = ({ status }) => {
  const getbadgeConfig = () => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: FiCheckCircle,
          iconColor: 'verified',
          label: 'VERIFIED',
          bgColor: 'bg-green-500/20',
          borderColor: 'border-green-500/30',
          textColor: 'text-green-700',
          description: 'Corroborated by multiple trusted sources'
        };
      case 'LIKELY_TRUE':
        return {
          icon: FiCheckCircle,
          iconColor: 'likely',
          label: 'LIKELY TRUE',
          bgColor: 'bg-cyan-500/20',
          borderColor: 'border-cyan-500/30',
          textColor: 'text-cyan-700',
          description: 'High confidence from trusted source'
        };
      case 'MISLEADING':
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
          label: 'UNVERIFIED',
          bgColor: 'bg-gray-500/20',
          borderColor: 'border-gray-500/30',
          textColor: 'text-gray-700',
          description: 'Verification pending'
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
        className={`inline-flex items-center gap-2 px-3 py-1.5 ${config.bgColor} ${config.borderColor} border backdrop-blur-md rounded-full`}
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
