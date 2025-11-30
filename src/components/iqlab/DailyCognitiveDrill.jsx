import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheckCircle, FiXCircle, FiSkipForward, FiCheck, FiX } from 'react-icons/fi';

const DailyCognitiveDrill = ({ question, attempts, onSubmit, onPractice }) => {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isAnswered, setIsAnswered] = useState(false);

  const hasCompletedToday = attempts.some(a => a.countsForDailyReward);
  const isPracticeMode = hasCompletedToday;

  const handleOptionClick = (index) => {
    if (isAnswered) return;
    setSelectedIndex(index);
  };

  const handleSubmit = async () => {
    if (selectedIndex === null || isAnswered) return;

    setIsAnswered(true);
    setShowExplanation(true);
    await onSubmit(question.id, selectedIndex);
  };

  const handleSkip = async () => {
    if (isAnswered) return;
    setIsAnswered(true);
    setShowExplanation(true);
    await onSubmit(question.id, null);
  };

  const handlePractice = () => {
    setSelectedIndex(null);
    setShowExplanation(false);
    setIsAnswered(false);
    onPractice();
  };

  const isCorrect = isAnswered && selectedIndex === question.correctIndex;
  const isIncorrect = isAnswered && selectedIndex !== null && selectedIndex !== question.correctIndex;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'BEGINNER': return 'bg-green-100 text-green-700 border-green-300';
      case 'INTERMEDIATE': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'ADVANCED': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
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
        <div className="flex items-center gap-2 mb-3">
          <FiCpu className="w-5 h-5 text-purple-600" />
          <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
            Daily Cognitive Drill
          </h2>
          {isPracticeMode && (
            <span className="px-2 py-0.5 rounded text-xs font-bold bg-amber-100 text-amber-700">
              PRACTICE
            </span>
          )}
        </div>
        <p className="text-xs text-text-secondary mb-3">Based on today's headlines</p>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
            Topic: {question.topicLabel}
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(question.difficulty)}`}>
            {question.difficulty}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-text-dark leading-relaxed">
          {question.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-6">
        {question.options.map((option, index) => {
          const isSelected = selectedIndex === index;
          const isThisCorrect = index === question.correctIndex;
          const showCorrect = isAnswered && isThisCorrect;
          const showIncorrect = isAnswered && isSelected && !isThisCorrect;

          return (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={isAnswered}
              whileHover={!isAnswered ? { scale: 1.01, x: 4 } : {}}
              whileTap={!isAnswered ? { scale: 0.99 } : {}}
              className={`w-full text-left px-4 py-4 rounded-xl font-medium text-base transition-all ${
                showCorrect
                  ? 'bg-green-100 border-2 border-green-500 text-green-900'
                  : showIncorrect
                  ? 'bg-red-100 border-2 border-red-500 text-red-900'
                  : isSelected
                  ? 'bg-brand-blue/20 border-2 border-brand-blue text-text-dark'
                  : 'bg-white/60 border border-gray-300 text-text-dark hover:border-brand-blue/50'
              } ${isAnswered ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  showCorrect
                    ? 'bg-green-500 text-white'
                    : showIncorrect
                    ? 'bg-red-500 text-white'
                    : isSelected
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {showCorrect ? <FiCheck /> : showIncorrect ? <FiX /> : String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
                {showCorrect && <FiCheckCircle className="w-5 h-5 text-green-600" />}
                {showIncorrect && <FiXCircle className="w-5 h-5 text-red-600" />}
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Actions */}
      {!isAnswered && (
        <div className="flex gap-3">
          <motion.button
            onClick={handleSubmit}
            disabled={selectedIndex === null}
            whileHover={selectedIndex !== null ? { scale: 1.02 } : {}}
            whileTap={selectedIndex !== null ? { scale: 0.98 } : {}}
            className={`flex-1 px-6 py-4 rounded-xl font-bold text-base uppercase tracking-wider transition-all ${
              selectedIndex !== null
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg hover:shadow-xl'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Submit Answer
          </motion.button>
          <motion.button
            onClick={handleSkip}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-4 rounded-xl font-semibold text-base bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50 transition-all flex items-center gap-2"
          >
            <FiSkipForward className="w-4 h-4" />
            Skip
          </motion.button>
        </div>
      )}

      {/* XP Feedback */}
      <AnimatePresence>
        {isAnswered && !isPracticeMode && selectedIndex !== null && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-4 p-4 rounded-xl text-center"
            style={{
              background: isCorrect
                ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))'
                : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(239, 68, 68, 0.05))',
              border: isCorrect ? '2px solid rgb(34, 197, 94)' : '2px solid rgb(239, 68, 68)'
            }}
          >
            <div className="text-2xl font-black mb-1" style={{ color: isCorrect ? 'rgb(34, 197, 94)' : 'rgb(239, 68, 68)' }}>
              {isCorrect ? '+50 XP' : '+0 XP'}
            </div>
            <div className="text-xs text-text-secondary">
              {isCorrect ? 'Daily XP earned · News IQ updated' : 'Try the next daily drill tomorrow'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Explanation */}
      <AnimatePresence>
        {showExplanation && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-6 p-5 rounded-xl bg-blue-50/80 border border-blue-300"
          >
            <div className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-2">
              Explanation
            </div>
            <p className="text-sm text-blue-900 leading-relaxed">
              {question.explanation}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Actions */}
      {isAnswered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 flex flex-wrap gap-2"
        >
          <motion.button
            onClick={handlePractice}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-purple-500/10 to-pink-500/10 text-purple-700 border border-purple-300 hover:border-purple-500 transition-all"
          >
            Try Another Question
          </motion.button>
          <button className="px-4 py-2 rounded-lg text-sm font-semibold bg-white/60 text-text-secondary border border-gray-300 hover:border-brand-blue/50 transition-all">
            Review Related Articles
          </button>
        </motion.div>
      )}
    </motion.div>
  );
};

export default DailyCognitiveDrill;
