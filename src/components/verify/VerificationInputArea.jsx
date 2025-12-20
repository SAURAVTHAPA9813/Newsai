import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiFileText, FiTwitter, FiLink, FiBook, FiZap, FiX } from 'react-icons/fi';

const VerificationInputArea = ({ onVerify, isVerifying }) => {
  const [inputText, setInputText] = useState('');
  const [inputType, setInputType] = useState('HEADLINE');
  const [verificationMode, setVerificationMode] = useState('STANDARD');

  const inputPresets = [
    {
      value: 'HEADLINE',
      label: 'Headline',
      icon: FiFileText,
      placeholder: 'Example: "New AI model claims 99% cancer detection accuracy"',
      maxLength: 200
    },
    {
      value: 'TWEET_SOCIAL',
      label: 'Tweet / Social',
      icon: FiTwitter,
      placeholder: 'Example: "COVID vax causes infertility Share before they delete!"',
      maxLength: 280
    },
    {
      value: 'URL',
      label: 'URL',
      icon: FiLink,
      placeholder: 'Example: https://suspiciousblog.com/controversial-article',
      maxLength: 2000
    },
    {
      value: 'LONG_ARTICLE',
      label: 'Long Article',
      icon: FiBook,
      placeholder: 'Paste full article or long-form content here...',
      maxLength: 10000
    }
  ];

  const verificationModes = [
    { value: 'STANDARD', label: 'Standard', description: 'Balanced verification' },
    { value: 'STRICT', label: 'Strict', description: 'More conservative' },
    { value: 'EXPERIMENTAL', label: 'Experimental', badge: '⚠ Labs', description: 'Advanced analysis' }
  ];

  const currentPreset = inputPresets.find(p => p.value === inputType);
  const charCount = inputText.length;
  const maxChars = currentPreset?.maxLength || 200;

  // Calculate complexity
  const getComplexity = () => {
    if (charCount < 120) return 'SHORT';
    if (charCount <= 400) return 'MEDIUM';
    return 'LONG';
  };

  const handleSubmit = () => {
    if (inputText.trim() && !isVerifying) {
      onVerify({
        claimText: inputText,
        inputType,
        verificationMode,
        inputStats: {
          lengthChars: charCount,
          complexityBucket: getComplexity()
        }
      });
    }
  };

  const handleClear = () => {
    setInputText('');
  };

  // Example chips
  const exampleChips = [
    { text: "Try: 'COVID vax causes infertility'", preset: 'TWEET_SOCIAL' },
    { text: "Try: 'Breaking: Fed announces surprise rate cut'", preset: 'HEADLINE' }
  ];

  return (
    <div className="space-y-4">
      {/* Input Type Presets */}
      <div>
        <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-3">
          Input Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          {inputPresets.map((preset) => {
            const PresetIcon = preset.icon;
            const isActive = inputType === preset.value;

            return (
              <motion.button
                key={preset.value}
                onClick={() => setInputType(preset.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-blue to-blue-300 text-white shadow-lg'
                    : 'bg-white/60 text-text-secondary border border-brand-blue/20 hover:border-brand-blue/50'
                }`}
              >
                <PresetIcon className="w-4 h-4" />
                <span>{preset.label}</span>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Verification Mode Selector */}
      <div>
        <label className="block text-xs font-bold text-text-dark uppercase tracking-wider mb-3">
          Verification Mode
        </label>
        <div className="flex gap-2">
          {verificationModes.map((mode) => {
            const isActive = verificationMode === mode.value;

            return (
              <motion.button
                key={mode.value}
                onClick={() => setVerificationMode(mode.value)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                title={mode.description}
                className={`flex-1 px-3 py-2 rounded-lg text-xs font-semibold transition-all relative ${
                  isActive
                    ? 'bg-brand-blue/10 text-brand-blue border-2 border-brand-blue'
                    : 'bg-white/40 text-text-secondary border border-gray-300 hover:border-brand-blue/50'
                }`}
              >
                {mode.label}
                {mode.badge && (
                  <span className="ml-1 text-xs opacity-70">{mode.badge}</span>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Text Input Area */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-text-dark uppercase tracking-wider">
            Claim to Verify
          </label>
          {inputText && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={handleClear}
              className="flex items-center gap-1 text-xs text-text-secondary hover:text-brand-blue"
            >
              <FiX className="w-3 h-3" />
              Clear
            </motion.button>
          )}
        </div>

        <div className="relative">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value.slice(0, maxChars))}
            placeholder={currentPreset?.placeholder}
            rows={inputType === 'LONG_ARTICLE' ? 8 : 4}
            maxLength={maxChars}
            disabled={isVerifying}
            className="w-full px-4 py-3 rounded-xl bg-white/60 border border-brand-blue/20 text-text-dark placeholder-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-brand-blue/50 transition-all resize-none disabled:opacity-50"
            style={{
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)'
            }}
          />

          {/* Character counter */}
          <div className="absolute bottom-2 right-2 text-xs text-text-secondary bg-white/80 px-2 py-1 rounded">
            {charCount}/{maxChars}
          </div>
        </div>
      </div>

      {/* Input Integrity Indicator */}
      <div
        className="p-3 rounded-lg text-xs flex items-center gap-2 text-text-secondary"
        style={{
          background: 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <span>🔐 Encrypted Analysis</span>
        <span>•</span>
        <span>📏 Length: {charCount} chars</span>
        <span>•</span>
        <span>Complexity: {getComplexity()}</span>
      </div>

      {/* Example Chips */}
      {!inputText && (
        <div className="space-y-2">
          <p className="text-xs font-semibold text-text-secondary">Try an example:</p>
          <div className="flex flex-wrap gap-2">
            {exampleChips.map((chip, index) => (
              <motion.button
                key={index}
                onClick={() => {
                  setInputText(chip.text.replace("Try: '", "").replace("'", ""));
                  setInputType(chip.preset);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-blue-50 to-blue-20 text-brand-blue border border-brand-blue/20 hover:border-brand-blue/50 transition-all"
              >
                {chip.text}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Run Verification Button */}
      <motion.button
        onClick={handleSubmit}
        disabled={!inputText.trim() || isVerifying}
        whileHover={{ scale: inputText.trim() && !isVerifying ? 1.02 : 1 }}
        whileTap={{ scale: inputText.trim() && !isVerifying ? 0.98 : 1 }}
        className={`w-full px-6 py-4 rounded-xl font-bold text-sm uppercase tracking-wider transition-all flex items-center justify-center gap-3 ${
          inputText.trim() && !isVerifying
            ? 'bg-gradient-to-r from-brand-blue to-sky-500 text-white shadow-lg hover:shadow-xl'
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        }`}
      >
        {isVerifying ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            >
              <FiZap className="w-5 h-5" />
            </motion.div>
            <span>Analyzing...</span>
          </>
        ) : (
          <>
            <FiZap className="w-5 h-5" />
            <span>Run Verification</span>
          </>
        )}
      </motion.button>
    </div>
  );
};

export default VerificationInputArea;
