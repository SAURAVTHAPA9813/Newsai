import PropTypes from 'prop-types';

/**
 * Icon Component
 *
 * A standardized wrapper for react-icons with consistent sizing, colors, and accessibility.
 *
 * @example
 * // Basic usage
 * <Icon icon={FiHome} size="md" color="primary" />
 *
 * @example
 * // With accessibility label
 * <Icon icon={FiSearch} size="lg" color="secondary" label="Search" />
 *
 * @example
 * // Interactive icon with hover effects
 * <Icon icon={FiStar} size="md" color="warning" interactive onClick={handleClick} />
 *
 * @example
 * // Decorative icon (hidden from screen readers)
 * <Icon icon={FiCheckCircle} size="sm" color="success" decorative />
 */
const Icon = ({
  icon: IconComponent,
  size = 'md',
  color = 'secondary',
  strokeWidth = 'regular',
  interactive = false,
  decorative = false,
  label,
  className = '',
  onClick,
  ...props
}) => {
  // Size mapping
  const sizeClasses = {
    xs: 'icon-xs',
    sm: 'icon-sm',
    md: 'icon-md',
    lg: 'icon-lg',
    xl: 'icon-xl'
  };

  // Color mapping
  const colorClasses = {
    primary: 'icon-primary',
    secondary: 'icon-secondary',
    tertiary: 'icon-tertiary',
    success: 'icon-success',
    warning: 'icon-warning',
    error: 'icon-error',
    info: 'icon-info',
    verified: 'text-icon-verified',
    likely: 'text-icon-likely',
    unverified: 'text-icon-unverified',
    misleading: 'text-icon-misleading'
  };

  // Stroke width mapping
  const strokeClasses = {
    thin: 'icon-stroke-thin',
    regular: 'icon-stroke-regular',
    bold: 'icon-stroke-bold'
  };

  // Build className
  const iconClasses = [
    sizeClasses[size],
    colorClasses[color],
    strokeClasses[strokeWidth],
    interactive && 'icon-interactive',
    className
  ]
    .filter(Boolean)
    .join(' ');

  // Accessibility attributes
  const a11yProps = {
    'aria-hidden': decorative ? 'true' : undefined,
    'aria-label': !decorative && label ? label : undefined,
    role: !decorative && onClick ? 'button' : undefined,
    tabIndex: !decorative && onClick ? 0 : undefined
  };

  // Handle keyboard interaction for interactive icons
  const handleKeyDown = (e) => {
    if (onClick && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      onClick(e);
    }
  };

  if (!IconComponent) {
    console.warn('Icon component requires an icon prop');
    return null;
  }

  return (
    <IconComponent
      className={iconClasses}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      {...a11yProps}
      {...props}
    />
  );
};

Icon.propTypes = {
  /** The icon component from react-icons (e.g., FiHome, FiSearch) */
  icon: PropTypes.elementType.isRequired,

  /** Size variant */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),

  /** Color variant based on semantic meaning */
  color: PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'success',
    'warning',
    'error',
    'info',
    'verified',
    'likely',
    'unverified',
    'misleading'
  ]),

  /** Stroke width for line icons */
  strokeWidth: PropTypes.oneOf(['thin', 'regular', 'bold']),

  /** Enable interactive hover effects and cursor pointer */
  interactive: PropTypes.bool,

  /** Mark icon as decorative (hidden from screen readers) */
  decorative: PropTypes.bool,

  /** Accessibility label for screen readers (required if not decorative) */
  label: PropTypes.string,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Click handler */
  onClick: PropTypes.func
};

export default Icon;
