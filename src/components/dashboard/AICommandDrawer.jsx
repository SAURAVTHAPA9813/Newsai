import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiBookOpen, FiDollarSign, FiShuffle, FiMessageCircle, FiX } from 'react-icons/fi';
import ExplainModule from '../aimodules/ExplainModule';
import ContextTimelineModule from '../aimodules/ContextTimelineModule';
import MarketImpactModule from '../aimodules/MarketImpactModule';
import PerspectivesModule from '../aimodules/PerspectivesModule';

const AICommandDrawer = ({ articleId, isOpen, onClose }) => {
  const [activeCommand, setActiveCommand] = useState(null);

  const commands = [
    { id: 'explain', label: 'Explain', icon: FiMessageCircle, color: 'from-yellow-500 to-yellow-600' },
    { id: 'keypoints', label: 'Key Point', icon: FiBookOpen, color: 'from-blue-500 to-blue-600' },
    { id: 'market', label: 'Market', icon: FiDollarSign, color: 'from-green-500 to-green-600' },
    { id: 'perspectives', label: 'Perspectives', icon: FiShuffle, color: 'from-purple-500 to-purple-600' }
  ];

  const handleCommandClick = (e, commandId) => {
    e.stopPropagation(); // Prevent card onClick from triggering
    if (activeCommand === commandId) {
      setActiveCommand(null);
    } else {
      setActiveCommand(commandId);
    }
  };

  return (
    <div className="w-full">
      {/* Command Buttons */}
      <div className="flex items-center gap-2 px-4 py-3">
        {commands.map((command) => {
          const isActive = activeCommand === command.id;

          return (
            <motion.button
              key={command.id}
              onClick={(e) => handleCommandClick(e, command.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`flex items-center justify-center px-4 py-2 rounded-lg text-xs font-semibold transition-all min-w-[90px] ${
                isActive
                  ? `text-white shadow-lg bg-gradient-to-r ${command.color}`
                  : 'bg-white/60 text-text-secondary hover:bg-white border border-brand-blue/20 hover:border-brand-blue/50'
              }`}
            >
              <span>{command.label}</span>
            </motion.button>
          );
        })}

        {activeCommand && (
          <motion.button
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            onClick={(e) => { e.stopPropagation(); setActiveCommand(null); }}
            className="ml-auto p-2 rounded-lg bg-white/60 hover:bg-white transition-colors"
          >
            <FiX className="w-4 h-4 text-text-secondary" />
          </motion.button>
        )}
      </div>

      {/* Expandable AI Module Content */}
      <AnimatePresence>
        {activeCommand && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mx-4 mb-4 p-6 rounded-2xl bg-white/60 backdrop-blur-sm border border-white/60">
              {activeCommand === 'explain' && (
                <ExplainModule
                  articleId={articleId}
                  onClose={() => setActiveCommand(null)}
                />
              )}
              {activeCommand === 'keypoints' && (
                <ContextTimelineModule
                  articleId={articleId}
                  onClose={() => setActiveCommand(null)}
                />
              )}
              {activeCommand === 'market' && (
                <MarketImpactModule
                  articleId={articleId}
                  onClose={() => setActiveCommand(null)}
                />
              )}
              {activeCommand === 'perspectives' && (
                <PerspectivesModule
                  articleId={articleId}
                  onClose={() => setActiveCommand(null)}
                />
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AICommandDrawer;
