const mongoose = require('mongoose');

// QuizTemplate Schema - The actual quiz content
const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true, min: 0, max: 3 }, // Index of correct option
  explanation: { type: String },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  points: { type: Number, default: 10 }
}, { _id: false });

const quizTemplateSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    required: true,
    enum: ['news', 'politics', 'technology', 'science', 'business', 'sports', 'entertainment', 'general'],
    default: 'general'
  },
  type: {
    type: String,
    enum: ['daily', 'weekly', 'special', 'topic'],
    default: 'daily'
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [questionSchema],
  totalPoints: {
    type: Number,
    default: 0
  },
  timeLimit: {
    type: Number, // in minutes
    default: 10
  },
  isActive: {
    type: Boolean,
    default: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date
  },
  articleReference: {
    title: String,
    url: String,
    summary: String
  }
}, {
  timestamps: true
});

// Calculate total points before saving
quizTemplateSchema.pre('save', function(next) {
  if (this.questions && this.questions.length > 0) {
    this.totalPoints = this.questions.reduce((sum, q) => sum + (q.points || 10), 0);
  }
  next();
});

// Indexes
quizTemplateSchema.index({ category: 1, isActive: 1 });
quizTemplateSchema.index({ type: 1, startDate: -1 });

// UserQuizAttempt Schema - User's quiz attempts
const userAnswerSchema = new mongoose.Schema({
  questionIndex: { type: Number, required: true },
  userAnswer: { type: Number, required: true },
  isCorrect: { type: Boolean, required: true },
  pointsEarned: { type: Number, default: 0 }
}, { _id: false });

const userQuizAttemptSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  quiz: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'QuizTemplate',
    required: true
  },
  answers: [userAnswerSchema],
  score: {
    type: Number,
    default: 0
  },
  totalPoints: {
    type: Number,
    default: 0
  },
  percentage: {
    type: Number,
    default: 0
  },
  timeSpent: {
    type: Number, // in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  }
}, {
  timestamps: true
});

// Calculate score before saving
userQuizAttemptSchema.pre('save', function(next) {
  if (this.completed && this.totalPoints > 0) {
    this.percentage = Math.round((this.score / this.totalPoints) * 100);
  }
  next();
});

// Indexes
userQuizAttemptSchema.index({ user: 1, quiz: 1 });
userQuizAttemptSchema.index({ user: 1, createdAt: -1 });
userQuizAttemptSchema.index({ completed: 1 });

// Export both models
const QuizTemplate = mongoose.model('QuizTemplate', quizTemplateSchema);
const UserQuizAttempt = mongoose.model('UserQuizAttempt', userQuizAttemptSchema);

module.exports = { QuizTemplate, UserQuizAttempt };
