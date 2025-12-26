const mongoose = require('mongoose');

/**
 * Question Schema for daily quiz cache
 */
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0, max: 3 },
  explanation: { type: String, required: true },
  difficulty: { type: String, enum: ['easy', 'medium', 'hard'], default: 'medium' },
  points: { type: Number, default: 10 },
  category: { type: String, required: true } // Track category for skill scoring
}, { _id: false });

/**
 * Daily Quiz Cache Schema
 * Stores generated quiz for the day (updates once daily at 8 AM)
 */
const dailyQuizSchema = new mongoose.Schema({
  date: {
    type: String,
    required: true,
    unique: true,
    index: true
  }, // YYYY-MM-DD format

  generatedAt: {
    type: Date,
    required: true,
    default: Date.now
  },

  quizId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizTemplate',
    required: true
  },

  questions: [questionSchema],

  categories: [{
    type: String
  }], // Categories covered in this quiz

  totalPoints: {
    type: Number,
    required: true
  },

  status: {
    type: String,
    enum: ['generating', 'completed', 'failed'],
    default: 'completed'
  },

  error: String // Error message if generation failed
}, {
  timestamps: true
});

/**
 * Static method: Get today's quiz
 */
dailyQuizSchema.statics.getTodayQuiz = async function() {
  const today = new Date().toISOString().split('T')[0];
  return await this.findOne({ date: today, status: 'completed' });
};

/**
 * Static method: Check if quiz generation is needed
 */
dailyQuizSchema.statics.needsGeneration = async function() {
  const now = new Date();
  const hour = now.getHours();

  // Before 8 AM, use yesterday's quiz
  if (hour < 8) {
    return false;
  }

  const today = new Date().toISOString().split('T')[0];
  const existing = await this.findOne({
    date: today,
    status: { $in: ['completed', 'generating'] }
  });

  return !existing; // Need generation if no quiz exists for today
};

const DailyQuiz = mongoose.model('DailyQuiz', dailyQuizSchema);

module.exports = DailyQuiz;
