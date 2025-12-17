import { motion } from 'framer-motion';
import { FiFileText, FiDatabase, FiTarget, FiClock, FiShield } from 'react-icons/fi';

const VerifyTabNavigation = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'summary', label: 'Summary', icon: FiFileText },
    { id: 'evidence', label: 'Evidence', icon: FiDatabase },
    { id: 'bias', label: 'Bias & Sentiment', icon: FiTarget },
    { id: 'timeline', label: 'Timeline', icon: FiClock },
    { id: 'risk', label: 'Risk & Guidance', icon: FiShield }
  ];

  return (
    <div className="relative border-b border-brand-blue/10">
      <div className="flex gap-1 overflow-x-auto">
        {tabs.map((tab) => {
          const TabIcon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <motion.button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className={`relative flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-all ${
                isActive
                  ? 'text-brand-blue'
                  : 'text-text-secondary hover:text-brand-blue'
              }`}
            >
              <TabIcon className="w-4 h-4" />
              <span>{tab.label}</span>

              {/* Active indicator */}
              {isActive && (
                <motion.div
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-blue"
                  style={{
                    boxShadow: '0 0 10px rgba(65, 105, 225, 0.5)'
                  }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default VerifyTabNavigation;
