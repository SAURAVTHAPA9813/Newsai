import apiClient from "./apiClient";

// Backend IQ Lab endpoints (using quiz routes for now)
const iqLabAPI = {
  // GET /api/quiz/daily - Get daily quiz
  // Returns: { success: true, data: { quiz, hasAttempted, attempt } }
  getDailyQuiz: async () => {
    const response = await apiClient.get("/quiz/daily");
    return response; // { success: true, data: { quiz, hasAttempted, attempt } }
  },

  // GET /api/quiz/:id/questions - Get quiz questions
  // Returns: { success: true, data: { quizId, title, timeLimit, questions } }
  getQuizQuestions: async (quizId) => {
    const response = await apiClient.get(`/quiz/${quizId}/questions`);
    return response; // { success: true, data: { quizId, title, timeLimit, questions } }
  },

  // POST /api/quiz/:id/submit - Submit quiz answers
  // Body: { answers, timeSpent }
  // Returns: { success: true, data: { attempt, results, stats } }
  submitQuizAnswers: async (quizId, answers, timeSpent = 0) => {
    const response = await apiClient.post(`/quiz/${quizId}/submit`, {
      answers,
      timeSpent,
    });
    return response; // { success: true, data: { attempt, results, stats } }
  },

  // GET /api/quiz/history - Get quiz history
  // Returns: { success: true, data: attempts[] }
  getQuizHistory: async () => {
    const response = await apiClient.get("/quiz/history");
    return response; // { success: true, data: attempts }
  },

  // Client-side functions for IQ Lab state management
  // These would need backend endpoints for full implementation
  getIQLabState: async () => {
    // For now, return mock data - would need backend endpoint
    return {
      newsIq: { score: 78, xpTotal: 1250 },
      todayQuestion: {
        id: "q1",
        question: "What is the capital of France?",
        options: ["London", "Berlin", "Paris", "Madrid"],
        correctAnswer: 2,
        points: 10,
        category: "General Knowledge",
      },
      todayAttempts: [],
      skillScores: {
        currentEvents: 85,
        historicalContext: 72,
        sourceReliability: 90,
        biasDetection: 68,
        factChecking: 82,
      },
      streak: {
        currentStreak: 7,
        longestStreak: 23,
        lastCompleted: new Date().toISOString(),
      },
      badges: [
        {
          id: "b1",
          title: "First Steps",
          description: "Complete your first quiz",
          icon: "🚀",
          status: "UNLOCKED",
          unlockedAt: "2024-01-15T10:00:00Z",
          xpReward: 50,
        },
      ],
      philosophyQuotes: [
        {
          text: "The truth is rarely pure and never simple.",
          author: "Oscar Wilde",
          category: "Truth",
        },
      ],
    };
  },

  submitDrillAttempt: async (questionId, answeredIndex) => {
    // Mock implementation - would need backend endpoint
    const isCorrect = answeredIndex === 2; // Mock correct answer
    const earnedXp = isCorrect ? 10 : 0;

    return {
      attempt: {
        questionId,
        answeredIndex,
        isCorrect,
        earnedXp,
        countsForDailyReward: true,
      },
      updatedState: await this.getIQLabState(), // Mock updated state
    };
  },

  unlockBadge: async (badgeId) => {
    // Mock implementation - would need backend endpoint
    return await this.getIQLabState(); // Mock updated state
  },
};

export default iqLabAPI;
