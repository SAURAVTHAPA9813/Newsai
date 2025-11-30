import { motion } from 'framer-motion';
import { FiCommand, FiPlus } from 'react-icons/fi';

const AIInstructionsCard = ({ policy, onChange }) => {
  const presets = [
    {
      id: 'careerGrowth',
      label: 'Career Growth',
      text: 'Prioritize content that supports long-term career growth and skill-building.'
    },
    {
      id: 'longTermInvesting',
      label: 'Long-term Investing',
      text: 'Emphasize long-term investing insights, deprioritize short-term hype and day-trading noise.'
    },
    {
      id: 'academicResearch',
      label: 'Academic',
      text: 'Favor peer-reviewed research, educational resources, and in-depth explainers over surface-level news.'
    },
    {
      id: 'calmLowAnxiety',
      label: 'Calm Mode',
      text: 'Reduce exposure to highly distressing, sensational, or doom-oriented headlines.'
    }
  ];

  const handleInstructionsChange = (value) => {
    onChange({ ...policy, rawInstructions: value });
  };

  const handlePresetClick = (preset) => {
    const currentText = policy.rawInstructions || '';
    const separator = currentText.trim() ? '\n\n' : '';
    const newText = currentText + separator + preset.text;
    handleInstructionsChange(newText);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
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
          <FiCommand className="w-5 h-5 text-brand-blue" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            AI Instructions
          </h2>
        </div>
        <p className="text-xs text-text-secondary">You tell the algorithm.</p>
      </div>

      <div className="space-y-4">
        {/* Presets */}
        <div>
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-2 block">
            Quick Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <motion.button
                key={preset.id}
                onClick={() => handlePresetClick(preset)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50 transition-all"
                title={`Append: ${preset.text}`}
              >
                <FiPlus className="w-3 h-3" />
                {preset.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Text Area */}
        <div>
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider mb-2 block">
            Your Instructions
          </label>
          <textarea
            value={policy.rawInstructions || ''}
            onChange={(e) => handleInstructionsChange(e.target.value)}
            placeholder="Examples:&#10;• Prioritize healthcare AI + nursing education&#10;• Deprioritize celebrity gossip, clickbait, and sports&#10;• Focus on policy changes that affect my career"
            rows={6}
            className="w-full px-3 py-3 rounded-lg bg-white/60 border border-brand-blue/20 text-sm text-text-dark placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all resize-none"
          />
        </div>

        {/* Policy Summary */}
        {policy.summaryLines && policy.summaryLines.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="p-4 rounded-lg bg-blue-50/80 border border-blue-300"
          >
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Active AI Policy
            </div>
            <ul className="space-y-1">
              {policy.summaryLines.map((line, index) => (
                <li key={index} className="text-xs text-blue-900 leading-relaxed flex items-start gap-2">
                  <span className="text-blue-600 mt-0.5">•</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default AIInstructionsCard;
