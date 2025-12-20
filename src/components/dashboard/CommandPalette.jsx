import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiSearch,
  FiCommand,
  FiList,
  FiClock,
  FiSmile,
  FiFilter,
  FiTrendingUp,
  FiZap,
  FiArrowRight
} from 'react-icons/fi';

const CommandPalette = ({ isOpen, onClose, onCommandExecute }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const searchInputRef = useRef(null);

  // Quick command presets
  const quickCommands = [
    {
      id: 'summarize-top',
      icon: FiList,
      label: 'Summarize top 5 stories',
      description: 'Get a quick overview of today\'s most important news',
      color: 'from-blue-500 to-blue-600',
      shortcut: '⌘'
    },
    {
      id: 'what-changed',
      icon: FiClock,
      label: 'What changed since yesterday?',
      description: 'See key developments and new stories from the past 24h',
      color: 'from-sky-500 to-sky-600',
      shortcut: '⌘2'
    },
    {
      id: 'uplifting-news',
      icon: FiSmile,
      label: 'Find me uplifting news',
      description: 'Filter for positive and inspiring stories',
      color: 'from-green-500 to-green-600',
      shortcut: '⌘3'
    },
    {
      id: 'tech-only',
      icon: FiFilter,
      label: 'Show only tech news',
      description: 'Focus on technology and innovation stories',
      color: 'from-orange-500 to-orange-600',
      shortcut: '⌘4'
    },
    {
      id: 'trending',
      icon: FiTrendingUp,
      label: 'What\'s trending right now?',
      description: 'See the most viral and discussed stories',
      color: 'from-pink-500 to-pink-600',
      shortcut: '⌘5'
    }
  ];

  // AI suggestions based on search query
  const generateSuggestions = (query) => {
    if (!query || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Mock AI suggestions - in production, this would call an API
    const aiSuggestions = [
      {
        type: 'ai-answer',
        icon: FiZap,
        text: `AI Analysis: ${query}`,
        subtext: 'Get instant AI insights about this topic',
        color: 'from-brand-blue to-sky-500'
      },
      {
        type: 'search',
        icon: FiSearch,
        text: `Search articles for "${query}"`,
        subtext: 'Find all related articles in your feed',
        color: 'from-gray-500 to-gray-600'
      },
      {
        type: 'filter',
        icon: FiFilter,
        text: `Filter by ${query}`,
        subtext: 'Show only articles about this topic',
        color: 'from-blue-500 to-blue-600'
      }
    ];

    setSuggestions(aiSuggestions);
  };

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      const totalItems = suggestions.length > 0 ? suggestions.length : quickCommands.length;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % totalItems);
          break;
        case 'ArrowUp':
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + totalItems) % totalItems);
          break;
        case 'Enter':
          e.preventDefault();
          handleSelectCommand(selectedIndex);
          break;
        case 'Escape':
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, suggestions, quickCommands]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Update suggestions when search query changes
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      generateSuggestions(searchQuery);
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchQuery]);

  const handleSelectCommand = (index) => {
    const items = suggestions.length > 0 ? suggestions : quickCommands;
    const selectedItem = items[index];

    if (onCommandExecute) {
      if (suggestions.length > 0) {
        onCommandExecute({ type: selectedItem.type, query: searchQuery });
      } else {
        onCommandExecute({ type: 'quick-command', id: selectedItem.id });
      }
    }

    // Reset and close
    setSearchQuery('');
    setSuggestions([]);
    setSelectedIndex(0);
    onClose();
  };

  const handleCommandClick = (commandId, index) => {
    setSelectedIndex(index);
    handleSelectCommand(index);
  };

  if (!isOpen) return null;

  const displayItems = suggestions.length > 0 ? suggestions : quickCommands;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
          />

          {/* Command Palette Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4"
          >
            <div
              className="rounded-3xl shadow-2xl overflow-hidden border border-brand-blue/30"
              style={{
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(40px)',
                WebkitBackdropFilter: 'blur(40px)'
              }}
            >
              {/* Header with Search */}
              <div className="p-6 border-b border-brand-blue/10">
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 rounded-lg bg-gradient-to-br from-brand-blue to-sky-500">
                    <FiCommand className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-lg font-bold text-text-dark">AI Command Center</h2>
                </div>

                {/* Search Input */}
                <div className="relative mt-4">
                  <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-secondary" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Ask AI anything..."
                    className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/60 border border-brand-blue/20 text-text-dark placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
                  />
                  {searchQuery && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                      <div className="flex items-center gap-1 text-xs text-text-secondary">
                        <FiZap className="w-3 h-3 text-brand-blue" />
                        <span>AI ready</span>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Commands/Suggestions List */}
              <div className="max-h-96 overflow-y-auto p-4">
                <div className="space-y-2">
                  {/* Section Label */}
                  <div className="px-3 py-2">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">
                      {suggestions.length > 0 ? 'AI Suggestions' : 'Quick Commands'}
                    </span>
                  </div>

                  {/* Command Items */}
                  {displayItems.map((item, index) => {
                    const ItemIcon = item.icon;
                    const isSelected = index === selectedIndex;
                    const label = item.label || item.text;
                    const description = item.description || item.subtext;

                    return (
                      <motion.button
                        key={item.id || item.type}
                        onClick={() => handleCommandClick(item.id, index)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        whileHover={{ x: 4 }}
                        className={`w-full p-4 rounded-xl text-left transition-all ${
                          isSelected
                            ? 'bg-gradient-to-r from-brand-blue/10 to-sky-500/10 border-2 border-brand-blue/30'
                            : 'bg-white/40 border-2 border-transparent hover:border-brand-blue/20'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          {/* Icon */}
                          <div
                            className={`p-3 rounded-lg bg-gradient-to-br ${item.color} flex-shrink-0`}
                          >
                            <ItemIcon className="w-5 h-5 text-white" />
                          </div>

                          {/* Text Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="text-sm font-bold text-text-dark truncate">
                                {label}
                              </h3>
                            </div>
                            <p className="text-xs text-text-secondary line-clamp-1">
                              {description}
                            </p>
                          </div>

                          {/* Shortcut or Arrow */}
                          <div className="flex-shrink-0">
                            {item.shortcut ? (
                              <div className="px-2 py-1 rounded bg-gray-200/60 text-xs font-mono text-text-secondary">
                                {item.shortcut}
                              </div>
                            ) : (
                              <FiArrowRight className={`w-4 h-4 transition-all ${
                                isSelected ? 'text-brand-blue' : 'text-text-secondary'
                              }`} />
                            )}
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-brand-blue/10 bg-gradient-to-r from-blue-50 to-sky-50">
                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white/60 rounded font-mono">↑↓</kbd>
                      Navigate
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white/60 rounded font-mono">↵</kbd>
                      Select
                    </span>
                    <span className="flex items-center gap-1">
                      <kbd className="px-2 py-1 bg-white/60 rounded font-mono">Esc</kbd>
                      Close
                    </span>
                  </div>
                  <span className="text-brand-blue font-semibold">
                    Powered by GPT-4
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
