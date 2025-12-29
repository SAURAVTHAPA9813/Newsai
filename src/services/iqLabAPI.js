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

  // GET /api/iqlab/state - Get complete IQ Lab state
  // Returns: { success: true, data: { newsIq, todayQuestion, skillScores, streak, badges } }
  getIQLabState: async () => {
    const response = await apiClient.get("/iqlab/state");
    return response; // { success: true, data: { newsIq, todayQuestion, todayAttempts, skillScores, streak, badges } }
  },

  // Submit daily quiz (uses existing quiz endpoint)
  submitDailyQuiz: async (quizId, answers, timeSpent = 0) => {
    const response = await apiClient.post(`/quiz/${quizId}/submit`, {
      answers,
      timeSpent
    });
    return response;
  },
};

// Export default object
export default iqLabAPI;

// Also export individual functions as named exports for convenience
export const getDailyQuiz = iqLabAPI.getDailyQuiz;
export const getQuizQuestions = iqLabAPI.getQuizQuestions;
export const submitQuizAnswers = iqLabAPI.submitQuizAnswers;
export const submitDailyQuiz = iqLabAPI.submitDailyQuiz;
export const getQuizHistory = iqLabAPI.getQuizHistory;
export const getIQLabState = iqLabAPI.getIQLabState;
