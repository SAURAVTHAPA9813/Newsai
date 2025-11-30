import { FiDollarSign, FiMapPin, FiHeart, FiBriefcase } from 'react-icons/fi';
import Icon from '../common/Icon';

const ImpactTags = ({ tags = [] }) => {
  const allTags = [
    {
      id: 'money',
      icon: FiDollarSign,
      iconColor: 'success',
      label: 'Money',
      activeColor: 'bg-green-500/20 border-green-500 text-green-700',
      inactiveColor: 'bg-serenity-blue-light/50 border-serenity-blue-medium text-serenity-gray-dark'
    },
    {
      id: 'location',
      icon: FiMapPin,
      iconColor: 'info',
      label: 'Location',
      activeColor: 'bg-blue-500/20 border-serenity-royal text-serenity-deep',
      inactiveColor: 'bg-serenity-blue-light/50 border-serenity-blue-medium text-serenity-gray-dark'
    },
    {
      id: 'health',
      icon: FiHeart,
      iconColor: 'error',
      label: 'Health',
      activeColor: 'bg-red-500/20 border-red-500 text-red-700',
      inactiveColor: 'bg-serenity-blue-light/50 border-serenity-blue-medium text-serenity-gray-dark'
    },
    {
      id: 'career',
      icon: FiBriefcase,
      iconColor: 'primary',
      label: 'Career',
      activeColor: 'bg-purple-500/20 border-purple-500 text-purple-700',
      inactiveColor: 'bg-serenity-blue-light/50 border-serenity-blue-medium text-serenity-gray-dark'
    }
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-medium text-text-secondary">Impact on You:</span>
      </div>
      <div className="flex items-center gap-2 flex-wrap" role="list">
        {allTags.map((tag) => {
          const isActive = tags.includes(tag.id);

          return (
            <div
              key={tag.id}
              role="listitem"
              className={`group/tag relative flex items-center gap-1.5 px-3 py-1.5 border rounded-full transition-all duration-300 ${
                isActive
                  ? `${tag.activeColor} shadow-md scale-105`
                  : tag.inactiveColor
              }`}
              aria-label={isActive ? `${tag.label} impact: Active` : `${tag.label} impact: Inactive`}
            >
              <Icon
                icon={tag.icon}
                size="sm"
                color={isActive ? tag.iconColor : 'tertiary'}
                className={isActive ? 'animate-pulse' : ''}
                decorative
              />
              <span className="text-xs font-semibold">{tag.label}</span>

              {/* Glow effect for active tags */}
              {isActive && (
                <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-md animate-pulse"></div>
              )}

              {/* Tooltip for active tags */}
              {isActive && (
                <div
                  className="absolute left-1/2 -translate-x-1/2 top-full mt-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 invisible group-hover/tag:opacity-100 group-hover/tag:visible transition-all duration-200 whitespace-nowrap z-10"
                  role="tooltip"
                >
                  Affects your {tag.label}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-4 border-transparent border-b-gray-900"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ImpactTags;
