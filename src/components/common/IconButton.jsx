import PropTypes from 'prop-types';
import Icon from './Icon';

/**
 * IconButton Component
 *
 * An accessible button component designed specifically for icon-only actions.
 * Includes proper ARIA labels, focus states, and keyboard navigation.
 *
 * @example
 * // Basic usage
 * <IconButton
 *   icon={FiX}
 *   label="Close"
 *   onClick={handleClose}
 * />
 *
 * @example
 * // With size and color variants
 * <IconButton
 *   icon={FiBookmark}
 *   label="Save article"
 *   size="lg"
 *   variant="primary"
 *   onClick={handleSave}
 * />
 *
 * @example
 * // Disabled state
 * <IconButton
 *   icon={FiTrash}
 *   label="Delete"
 *   variant="error"
 *   disabled
 * />
 */
const IconButton = ({
  icon,
  label,
  size = 'md',
  variant = 'secondary',
  disabled = false,
  className = '',
  onClick,
  type = 'button',
  ...props
}) => {
  // Size mapping for button padding
  const buttonSizeClasses = {
    sm: 'icon-button-sm',
    md: 'icon-button-md',
    lg: 'icon-button-lg'
  };

  // Icon size mapping (slightly smaller than button)
  const iconSizeMap = {
    sm: 'sm',
    md: 'md',
    lg: 'lg'
  };

  // Variant mapping to icon colors
  const variantColorMap = {
    primary: 'primary',
    secondary: 'secondary',
    success: 'success',
    warning: 'warning',
    error: 'error',
    info: 'info'
  };

  // Build button className
  const buttonClasses = [
    'icon-button',
    buttonSizeClasses[size],
    disabled && 'opacity-50 cursor-not-allowed',
    className
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={buttonClasses}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      aria-label={label}
      {...props}
    >
      <Icon
        icon={icon}
        size={iconSizeMap[size]}
        color={disabled ? 'tertiary' : variantColorMap[variant]}
        decorative
      />
    </button>
  );
};

IconButton.propTypes = {
  /** The icon component from react-icons */
  icon: PropTypes.elementType.isRequired,

  /** Accessibility label describing the button action (required) */
  label: PropTypes.string.isRequired,

  /** Size variant */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),

  /** Visual variant */
  variant: PropTypes.oneOf(['primary', 'secondary', 'success', 'warning', 'error', 'info']),

  /** Disabled state */
  disabled: PropTypes.bool,

  /** Additional CSS classes */
  className: PropTypes.string,

  /** Click handler */
  onClick: PropTypes.func,

  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset'])
};

export default IconButton;
