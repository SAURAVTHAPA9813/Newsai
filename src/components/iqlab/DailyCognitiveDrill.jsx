import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCpu, FiCheckCircle, FiXCircle, FiSkipForward, FiCheck, FiX, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { submitDailyQuiz } from '../../services/iqLabAPI';

const DailyCognitiveDrill = ({ question, attempts, onSubmit }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState(null);

  // Check if quiz was already attempted today
  const hasAttempted = question.attempted || attempts.length > 0;

  // Get current question
  const currentQuestion = question.questions?.[currentQuestionIndex];
  const totalQuestions = question.questions?.length || 0;
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;

  const handleOptionClick = (index) => {
    if (quizCompleted || hasAttempted) return;
    setSelectedIndex(index);
  };

  const handleNextQuestion = () => {
    // Save current answer
    if (selectedIndex !== null) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: selectedIndex
      }));
    }

    // Move to next question
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      // Load saved answer for next question if exists
      const savedAnswer = userAnswers[currentQuestionIndex + 1];
      setSelectedIndex(savedAnswer !== undefined ? savedAnswer : null);
    }
  };

  const handlePreviousQuestion = () => {
    // Save current answer
    if (selectedIndex !== null) {
      setUserAnswers(prev => ({
        ...prev,
        [currentQuestionIndex]: selectedIndex
      }));
    }

    // Move to previous question
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load saved answer for previous question
      const savedAnswer = userAnswers[currentQuestionIndex - 1];
      setSelectedIndex(savedAnswer !== undefined ? savedAnswer : null);
    }
  };

  const handleSubmitQuiz = async () => {
    if (quizCompleted || hasAttempted) return;

    // Save current answer before submitting
    const finalAnswers = {
      ...userAnswers,
      [currentQuestionIndex]: selectedIndex
    };

    // Build answers array - backend expects simple array of answer indices
    const answersArray = [];
    for (let i = 0; i < totalQuestions; i++) {
      // Backend expects just the answer index (0, 1, 2, 3), not an object
      answersArray.push(finalAnswers[i] !== undefined ? finalAnswers[i] : -1);
    }

    setIsSubmitting(true);

    try {
      const response = await submitDailyQuiz(question.id, answersArray, 0);

      if (response.success) {
        setQuizCompleted(true);
        setResults(response.data.results);

        // Call parent's onSubmit to refresh state
        if (onSubmit) {
          await onSubmit();
        }
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      alert('Failed to submit quiz. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate answered questions count
  const answeredCount = Object.keys({ ...userAnswers, ...(selectedIndex !== null ? { [currentQuestionIndex]: selectedIndex } : {}) }).length;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'hard': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  // Loading state
  if (!currentQuestion) {
    return (
      <div className="rounded-3xl border border-brand-blue/20 p-6 text-center" style={{
        background: 'rgba(255, 255, 255, 0.7)',
        backdropFilter: 'blur(20px)'
      }}>
        <p className="text-text-secondary">Loading quiz...</p>
      </div>
    );
  }

  // Already attempted state
  if (hasAttempted && attempts.length > 0) {
    const lastAttempt = attempts[0];
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
        <div className="text-center py-8">
          <FiCheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-text-dark mb-2">Quiz Completed!</h3>
          <p className="text-text-secondary mb-4">You've already completed today's quiz</p>
          <div className="flex items-center justify-center gap-6 mb-6">
            <div>
              <div className="text-3xl font-black text-sky-600">{lastAttempt.score}</div>
              <div className="text-xs text-text-secondary">Score</div>
            </div>
            <div>
              <div className="text-3xl font-black text-green-600">{lastAttempt.percentage}%</div>
              <div className="text-xs text-text-secondary">Accuracy</div>
            </div>
          </div>
          <p className="text-sm text-text-secondary">Come back tomorrow for a new challenge!</p>
        </div>
      </motion.div>
    );
  }

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
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <FiCpu className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg font-bold text-text-dark uppercase tracking-wider">
              Daily Cognitive Drill
            </h2>
          </div>
          <div className="text-sm font-bold text-sky-600">
            Question {currentQuestionIndex + 1} of {totalQuestions}
          </div>
        </div>
        <p className="text-xs text-text-secondary mb-3">Based on today's headlines</p>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-text-secondary">
              Progress: {answeredCount}/{totalQuestions} answered
            </span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              className="h-full bg-gradient-to-r from-sky-500 to-pink-500"
            />
          </div>
        </div>

        {/* Pills */}
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
            Category: {currentQuestion.category || 'General'}
          </span>
          <span className={`px-3 py-1 rounded-lg text-xs font-semibold border ${getDifficultyColor(currentQuestion.difficulty)}`}>
            {currentQuestion.difficulty || 'Medium'}
          </span>
        </div>
      </div>

      {/* Question */}
      <div className="mb-6">
        <p className="text-lg font-semibold text-text-dark leading-relaxed">
          {currentQuestion.question}
        </p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-6">
        {currentQuestion.options?.map((option, index) => {
          const isSelected = selectedIndex === index;

          return (
            <motion.button
              key={index}
              onClick={() => handleOptionClick(index)}
              disabled={quizCompleted}
              whileHover={!quizCompleted ? { scale: 1.01, x: 4 } : {}}
              whileTap={!quizCompleted ? { scale: 0.99 } : {}}
              className={`w-full text-left px-4 py-4 rounded-xl font-medium text-base transition-all ${
                isSelected
                  ? 'bg-brand-blue/20 border-2 border-brand-blue text-text-dark'
                  : 'bg-white/60 border border-gray-300 text-text-dark hover:border-brand-blue/50'
              } ${quizCompleted ? 'cursor-not-allowed opacity-75' : 'cursor-pointer'}`}
            >
              <div className="flex items-center gap-3">
                <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  isSelected
                    ? 'bg-brand-blue text-white'
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {String.fromCharCode(65 + index)}
                </span>
                <span className="flex-1">{option}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Navigation Actions */}
      {!quizCompleted && (
        <div className="flex gap-3">
          {/* Previous Button */}
          <motion.button
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
            whileHover={currentQuestionIndex > 0 ? { scale: 1.02 } : {}}
            whileTap={currentQuestionIndex > 0 ? { scale: 0.98 } : {}}
            className={`px-4 py-3 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 ${
              currentQuestionIndex > 0
                ? 'bg-white/80 text-text-dark border border-gray-300 hover:border-brand-blue/50'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <FiChevronLeft className="w-4 h-4" />
            Previous
          </motion.button>

          {/* Next or Submit Button */}
          {!isLastQuestion ? (
            <motion.button
              onClick={handleNextQuestion}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider bg-gradient-to-r from-sky-500 to-blue-500 text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Next Question
              <FiChevronRight className="w-4 h-4" />
            </motion.button>
          ) : (
            <motion.button
              onClick={handleSubmitQuiz}
              disabled={isSubmitting || answeredCount < totalQuestions}
              whileHover={answeredCount === totalQuestions && !isSubmitting ? { scale: 1.02 } : {}}
              whileTap={answeredCount === totalQuestions && !isSubmitting ? { scale: 0.98 } : {}}
              className={`flex-1 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wider transition-all ${
                answeredCount === totalQuestions && !isSubmitting
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg hover:shadow-xl'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
            </motion.button>
          )}
        </div>
      )}

      {/* Quiz Completed Feedback */}
      <AnimatePresence>
        {quizCompleted && results && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="mt-6 p-6 rounded-xl text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.1), rgba(34, 197, 94, 0.05))',
              border: '2px solid rgb(34, 197, 94)'
            }}
          >
            <FiCheckCircle className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <div className="text-2xl font-black mb-2 text-green-700">
              Quiz Completed!
            </div>
            <div className="text-sm text-text-secondary mb-4">
              Your answers have been submitted. Reloading stats...
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help Text */}
      {!quizCompleted && answeredCount < totalQuestions && (
        <div className="mt-4 text-center text-xs text-text-secondary">
          Answer all {totalQuestions} questions to submit the quiz
        </div>
      )}
    </motion.div>
  );
};

export default DailyCognitiveDrill;
