import { Link } from 'react-router-dom';
import Icon from '../common/Icon';

const SidebarNavItem = ({ item, collapsed, isActive }) => {
  const IconComponent = item.icon;

  return (
    <Link
      to={item.path}
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? 'bg-gradient-to-r from-serenity-royal to-serenity-deep text-white shadow-lg'
          : 'text-text-secondary hover:bg-serenity-royal/10 hover:text-serenity-royal'
      }`}
      aria-label={`${item.name} - ${item.description}`}
      aria-current={isActive ? 'page' : undefined}
    >
      {/* Active Indicator */}
      {isActive && !collapsed && (
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
      )}

      {/* Icon */}
      <div className={`flex-shrink-0 ${collapsed ? 'mx-auto' : ''}`}>
        <Icon
          icon={IconComponent}
          size="lg"
          color={isActive ? 'on-dark' : 'secondary'}
          decorative
        />
      </div>

      {/* Label */}
      {!collapsed && (
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm truncate">{item.name}</div>
          <div className={`text-xs truncate ${isActive ? 'text-white/80' : 'text-text-secondary'}`}>
            {item.description}
          </div>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold">{item.name}</div>
          <div className="text-xs text-gray-300">{item.description}</div>
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
        </div>
      )}

      {/* Hover glow effect */}
      {!isActive && (
        <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-serenity-royal/0 to-serenity-deep/0 group-hover:from-serenity-royal/5 group-hover:to-serenity-deep/5 transition-all duration-300 pointer-events-none" />
      )}
    </Link>
  );
};

export default SidebarNavItem;
