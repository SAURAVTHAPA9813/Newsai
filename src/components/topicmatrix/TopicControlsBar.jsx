import { motion } from 'framer-motion';
import { FiSearch, FiGrid, FiCircle, FiPlus } from 'react-icons/fi';

const TopicControlsBar = ({ uiState, onUIStateChange }) => {
  const filters = [
    { label: 'All', value: 'ALL' },
    { label: 'Priority', value: 'PRIORITY' },
    { label: 'Shielded', value: 'SHIELDED' },
    { label: 'Blocked', value: 'BLOCKED' }
  ];

  const sortModes = [
    { label: 'Relevance', value: 'RELEVANCE' },
    { label: 'A–Z', value: 'ALPHA' },
    { label: 'Trend ↑', value: 'TREND' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-wrap items-center gap-3 mb-4"
    >
      {/* Search */}
      <div className="flex-1 min-w-[200px]">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-text-secondary" />
          <input
            type="text"
            value={uiState.searchQuery || ''}
            onChange={(e) => onUIStateChange({ searchQuery: e.target.value })}
            placeholder="Search topics..."
            className="w-full pl-10 pr-4 py-2 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
          />
        </div>
      </div>

      {/* View Mode Toggle */}
      <div className="flex gap-1 bg-white/60 p-1 rounded-lg border border-brand-blue/20">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUIStateChange({ viewMode: 'GRID' })}
          className={`p-2 rounded-md transition-all ${
            uiState.viewMode === 'GRID'
              ? 'bg-brand-blue text-white'
              : 'text-text-secondary hover:bg-white/80'
          }`}
          title="Grid View"
        >
          <FiGrid className="w-4 h-4" />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onUIStateChange({ viewMode: 'BUBBLES' })}
          className={`p-2 rounded-md transition-all ${
            uiState.viewMode === 'BUBBLES'
              ? 'bg-brand-blue text-white'
              : 'text-text-secondary hover:bg-white/80'
          }`}
          title="Bubble View"
        >
          <FiCircle className="w-4 h-4" />
        </motion.button>
      </div>

      {/* Filter */}
      <select
        value={uiState.activeFilter || 'ALL'}
        onChange={(e) => onUIStateChange({ activeFilter: e.target.value })}
        className="px-3 py-2 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
      >
        {filters.map((filter) => (
          <option key={filter.value} value={filter.value}>
            Show: {filter.label}
          </option>
        ))}
      </select>

      {/* Sort */}
      <select
        value={uiState.sortMode || 'RELEVANCE'}
        onChange={(e) => onUIStateChange({ sortMode: e.target.value })}
        className="px-3 py-2 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
      >
        {sortModes.map((mode) => (
          <option key={mode.value} value={mode.value}>
            Sort: {mode.label}
          </option>
        ))}
      </select>

      {/* New Topic Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-brand-blue to-purple-600 text-white text-sm font-semibold shadow-lg hover:shadow-xl transition-all"
      >
        <FiPlus className="w-4 h-4" />
        New Topic
      </motion.button>
    </motion.div>
  );
};

export default TopicControlsBar;
