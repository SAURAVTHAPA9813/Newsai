import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiBookOpen } from 'react-icons/fi';

const PhilosophyModule = ({ quotes }) => {
  const [currentQuote, setCurrentQuote] = useState(null);

  useEffect(() => {
    if (quotes && quotes.length > 0) {
      // Select random quote on mount
      const randomIndex = Math.floor(Math.random() * quotes.length);
      setCurrentQuote(quotes[randomIndex]);
    }
  }, [quotes]);

  if (!currentQuote) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="rounded-3xl border border-brand-blue/20 p-4 relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.6) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: '0 8px 32px rgba(65, 105, 225, 0.1)'
      }}
    >
      {/* Animated Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 50%, rgba(139, 92, 246, 0.3) 0%, transparent 50%),
                           radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.3) 0%, transparent 50%)`
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <FiBookOpen className="w-5 h-5 text-sky-600" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            Information Philosophy
          </h2>
        </div>

        {/* Quote */}
        <div className="mb-3">
          <p className="text-base text-text-dark leading-relaxed italic mb-3">
            "{currentQuote.text}"
          </p>
          <div className="text-sm font-semibold text-sky-700">
            – {currentQuote.author}
          </div>
          {currentQuote.source && (
            <div className="text-xs text-text-secondary mt-1">
              {currentQuote.source}
            </div>
          )}
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {currentQuote.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 rounded text-xs font-medium bg-sky-100 text-sky-700"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default PhilosophyModule;
