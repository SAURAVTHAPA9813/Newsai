import { FiShield, FiTrendingUp, FiZap, FiGlobe, FiActivity, FiBook } from 'react-icons/fi';
import { FaBrain } from 'react-icons/fa';
import { BiMask } from 'react-icons/bi';

// Icon mapping for badge icons
const iconMap = {
  FiShield: FiShield,
  FaBrain: FaBrain,
  FiTrendingUp: FiTrendingUp,
  FiZap: FiZap,
  FiGlobe: FiGlobe,
  BiMask: BiMask,
  FiActivity: FiActivity,
  FiBook: FiBook,
};

/**
 * Get a React Icon component from a string identifier
 * @param {string} iconName - The icon identifier (e.g., 'FiShield')
 * @param {string} className - Optional className for styling
 * @returns {JSX.Element} The icon component
 */
export const getBadgeIcon = (iconName, className = '') => {
  const IconComponent = iconMap[iconName];

  if (!IconComponent) {
    console.warn(`Icon "${iconName}" not found in icon map`);
    return null;
  }

  return <IconComponent className={className} />;
};

export default getBadgeIcon;
