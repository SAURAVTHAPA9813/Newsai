import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * StatusIcon Component
 *
 * A specialized icon component for status indicators with background circles.
 * Perfect for verification badges, alerts, and status displays.
 *
 * @example
 * // Verification badge
 * <StatusIcon
 *   icon={FiCheckCircle}
 *   status="verified"
 *   label="Verified content"
 * />
 *
 * @example
 * // Error indicator
 * <StatusIcon
 *   icon={FiAlertCircle}
 *   status="error"
 *   size="lg"
 *   label="Error occurred"
 * />
 *
 * @example
 * // With custom styling
 * <StatusIcon
 *   icon={FiInfo}
 *   status="info"
 *   withBackground={false}
 *   size="md"
 * />
 */
const StatusIcon = ({
  icon,
  status = 'info',
  size = 'md',
  withBackground = true,
  label,
  className = '',
  ...props
}) => {
  // Status to class mapping
  const statusClasses = {
    success: 'status-icon-success',
    warning: 'status-icon-warning',
    error: 'status-icon-error',
    info: 'status-icon-info',
    verified: 'status-icon-verified',
    misleading: 'status-icon-misleading'
  };

  // Status to icon color mapping
  const statusColorMap = {
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info',
    verified: 'verified',
    misleading: 'misleading'
  };

  // Size mapping for the container
  const containerSizeClasses = {
    sm: 'w-6 h-6 p-1',
    md: 'w-8 h-8 p-1.5',
    lg: 'w-10 h-10 p-2'
  };

  // Icon sizes (smaller than container)
  const iconSizeMap = {
    sm: 'xs',
    md: 'sm',
    lg: 'md'
  };

  // If no background, just render the icon
  if (!withBackground) {
    return (
      <Icon
        icon={icon}
        size={size}
        color={statusColorMap[status]}
        label={label}
        className={className}
        {...props}
      />
    );
  }

  // Build container className
  const containerClasses = [
    'status-icon',
    statusClasses[status],
    containerSizeClasses[size],
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={containerClasses}
      role={label ? 'img' : 'presentation'}
      aria-label={label}
      {...props}
    >
      <Icon
        icon={icon}
        size={iconSizeMap[size]}
        color={statusColorMap[status]}
        decorative={!!label}
      />
    </div>
  );
};

StatusIcon.propTypes = {
  /** The icon component from react-icons */
  icon: PropTypes.elementType.isRequired,

  /** Status type */
  status: PropTypes.oneOf(['success', 'warning', 'error', 'info', 'verified', 'misleading']),

  /** Size variant */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  /** Show colored background circle */
  withBackground: PropTypes.bool,

  /** Accessibility label describing the status */
  label: PropTypes.string,

  /** Additional CSS classes */
  className: PropTypes.string
};

export default StatusIcon;
