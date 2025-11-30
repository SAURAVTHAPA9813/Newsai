import { motion } from 'framer-motion';
import { FiShield, FiSettings } from 'react-icons/fi';
import { MdBlock } from 'react-icons/md';

const FirewallCard = ({ settings, onChange }) => {
  const anxietyModes = [
    { value: 'LOW', label: 'Low', tooltip: 'Show everything, including heavy news' },
    { value: 'BALANCED', label: 'Balanced', tooltip: 'Limit repetitive doom content' },
    { value: 'SENSITIVE', label: 'Sensitive', tooltip: 'Reduce distressing topics' }
  ];

  const hardBlockOptions = [
    { value: 'celebrity_gossip', label: 'Celebrity Gossip', icon: MdBlock },
    { value: 'violent_crime', label: 'Violent Crime', icon: MdBlock },
    { value: 'war_footage', label: 'War Footage', icon: MdBlock },
    { value: 'graphic_health', label: 'Graphic Health', icon: MdBlock }
  ];

  const exposureLimitOptions = [
    { key: 'war_conflict', label: 'War & Conflict' },
    { key: 'pandemics', label: 'Pandemics' },
    { key: 'politics_drama', label: 'Politics Drama' }
  ];

  const handleAnxietyChange = (mode) => {
    onChange({ ...settings, anxietyMode: mode });
  };

  const toggleHardBlock = (category) => {
    const current = settings.hardBlocks || [];
    const updated = current.includes(category)
      ? current.filter(c => c !== category)
      : [...current, category];
    onChange({ ...settings, hardBlocks: updated });
  };

  const handleExposureChange = (key, value) => {
    onChange({
      ...settings,
      exposureLimits: {
        ...(settings.exposureLimits || {}),
        [key]: parseInt(value) || 0
      }
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="rounded-3xl border border-brand-blue/20 p-6"
      style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-2">
          <FiShield className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            Mental Health Firewall
          </h2>
        </div>
        <p className="text-xs text-text-secondary">Tell the AI what to limit or block.</p>
      </div>

      <div className="space-y-5">
        {/* Anxiety Mode */}
        <div>
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 block">
            Anxiety Intensity Control
          </label>
          <div className="flex gap-2">
            {anxietyModes.map((mode) => {
              const isActive = settings.anxietyMode === mode.value;
              return (
                <motion.button
                  key={mode.value}
                  onClick={() => handleAnxietyChange(mode.value)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  title={mode.tooltip}
                  className={`flex-1 px-3 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-blue to-blue-300 text-white shadow-lg'
                      : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                  }`}
                >
                  {mode.label}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Hard Block Categories */}
        <div>
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 block">
            Hard Block Categories
          </label>
          <div className="space-y-2">
            {hardBlockOptions.map((option) => {
              const isBlocked = (settings.hardBlocks || []).includes(option.value);
              return (
                <motion.button
                  key={option.value}
                  onClick={() => toggleHardBlock(option.value)}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                    isBlocked
                      ? 'bg-red-50 text-red-700 border-2 border-red-400'
                      : 'bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50'
                  }`}
                >
                  <option.icon className="w-4 h-4" />
                  <span>{option.label}</span>
                  {isBlocked && <span className="ml-auto text-xs">BLOCKED</span>}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Exposure Limits */}
        <div>
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-3 block">
            Exposure Limits (per day)
          </label>
          <div className="space-y-3">
            {exposureLimitOptions.map((option) => {
              const value = (settings.exposureLimits || {})[option.key] || 0;
              return (
                <div key={option.key} className="flex items-center gap-3">
                  <label className="flex-1 text-sm text-text-dark font-medium">
                    {option.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={value}
                    onChange={(e) => handleExposureChange(option.key, e.target.value)}
                    className="w-20 px-3 py-2 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark text-center focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all"
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Firewall Summary */}
        {((settings.hardBlocks && settings.hardBlocks.length > 0) || settings.anxietyMode !== 'LOW') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-lg bg-amber-50/80 border border-amber-300"
          >
            <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
              Firewall Summary
            </div>
            <ul className="space-y-1">
              {settings.hardBlocks && settings.hardBlocks.map((block) => (
                <li key={block} className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                  <FiShield className="text-amber-600 w-3 h-3 mt-0.5" />
                  <span>{block.replace(/_/g, ' ')}: Blocked</span>
                </li>
              ))}
              <li className="text-xs text-amber-800 leading-relaxed flex items-start gap-2">
                <FiSettings className="text-amber-600 w-3 h-3 mt-0.5" />
                <span>Mode: {settings.anxietyMode}</span>
              </li>
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default FirewallCard;
