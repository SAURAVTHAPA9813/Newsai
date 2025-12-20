import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiUser, FiSettings, FiLogOut, FiChevronUp } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const UserProfileDock = ({ collapsed }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Get user initials for avatar
  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="relative p-3">
      {/* Profile Button */}
      <button
        onClick={toggleDropdown}
        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/50 transition-all duration-300 group"
      >
        {/* Avatar */}
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-sky-500 to-pink-500 flex items-center justify-center text-white font-bold flex-shrink-0">
          {getInitials(user?.name)}
        </div>

        {!collapsed && (
          <>
            {/* User Info */}
            <div className="flex-1 text-left min-w-0">
              <div className="font-semibold text-sm text-text-dark truncate">
                {user?.name || 'User'}
              </div>
              <div className="text-xs text-text-secondary truncate">
                {user?.email || 'user@example.com'}
              </div>
            </div>

            {/* Dropdown Icon */}
            <FiChevronUp
              className={`text-text-secondary transition-transform duration-300 ${
                dropdownOpen ? 'rotate-180' : ''
              }`}
            />
          </>
        )}
      </button>

      {/* Dropdown Menu */}
      {dropdownOpen && (
        <div
          className={`absolute bottom-full left-3 right-3 mb-2 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border border-white/40 overflow-hidden ${
            collapsed ? 'left-full ml-4 right-auto w-48' : ''
          }`}
        >
          {/* Profile */}
          <Link
            to="/profile"
            className="flex items-center gap-3 px-4 py-3 hover:bg-brand-blue/10 transition-colors"
            onClick={() => setDropdownOpen(false)}
          >
            <FiUser className="text-brand-blue" />
            <span className="text-sm font-medium text-text-dark">Profile</span>
          </Link>

          {/* Settings */}
          <button
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-blue/10 transition-colors"
            onClick={() => {
              setDropdownOpen(false);
              // Navigate to settings
            }}
          >
            <FiSettings className="text-brand-blue" />
            <span className="text-sm font-medium text-text-dark">Settings</span>
          </button>

          {/* Divider */}
          <div className="border-t border-gray-200 my-1" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors"
          >
            <FiLogOut />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      )}

      {/* Tooltip for collapsed state */}
      {collapsed && !dropdownOpen && (
        <div className="absolute left-full ml-4 bottom-3 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap z-50 pointer-events-none">
          <div className="font-semibold">{user?.name || 'User'}</div>
          <div className="text-xs text-gray-300">{user?.email || 'user@example.com'}</div>
          <div className="absolute right-full top-1/2 -translate-y-1/2 w-0 h-0 border-t-4 border-b-4 border-r-4 border-transparent border-r-gray-900" />
        </div>
      )}
    </div>
  );
};

export default UserProfileDock;
