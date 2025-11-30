// Mock IQ Lab API Service
// Provides sample data and persistence for IQ Lab training hub

// Generate 30-day history for streak
const generateDayHistory = () => {
  const history = [];
  const today = new Date();

  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];

    // Mock: User completed drill on most days except a few
    const completed = i > 2 ? Math.random() > 0.3 : i === 0 ? false : true;

    history.push({
      date: dateStr,
      completed,
      xpEarned: completed ? 50 : 0
    });
  }

  return history;
};

// Calculate current streak from history
const calculateCurrentStreak = (dayHistory) => {
  let streak = 0;
  for (let i = dayHistory.length - 1; i >= 0; i--) {
    if (dayHistory[i].completed) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
};

// Sample badges
const getSampleBadges = () => [
  {
    id: 'truth_seeker',
    title: 'Truth Seeker',
    description: 'Master of verification and fact-checking',
    category: 'TRUTH',
    status: 'UNLOCKED',
    icon: 'FiShield',
    criteria: {
      type: 'verify_count',
      threshold: 100,
      field: 'verifiedArticlesCount'
    },
    xpReward: 100,
    progress: { current: 100, target: 100 },
    unlockedAt: '2025-11-20T10:30:00Z'
  },
  {
    id: 'neural_link',
    title: 'Neural Link',
    description: 'Maintained a 7-day learning streak',
    category: 'STREAK',
    status: 'UNLOCKED',
    icon: 'FaBrain',
    criteria: {
      type: 'streak_days',
      threshold: 7,
      field: 'currentStreak'
    },
    xpReward: 100,
    progress: { current: 7, target: 7 },
    unlockedAt: '2025-11-18T08:15:00Z'
  },
  {
    id: 'market_whale',
    title: 'Market Whale',
    description: 'Read 50 finance and market reports',
    category: 'MARKET',
    status: 'LOCKED',
    icon: 'FiTrendingUp',
    criteria: {
      type: 'finance_reads',
      threshold: 50,
      field: 'financeReadsCount'
    },
    xpReward: 150,
    progress: { current: 32, target: 50 },
    unlockedAt: null
  },
  {
    id: 'zen_master',
    title: 'Zen Master',
    description: 'Used Zen Mode 20 times for mindful reading',
    category: 'MENTAL_HEALTH',
    status: 'LOCKED',
    icon: 'FiZap',
    criteria: {
      type: 'zen_sessions',
      threshold: 20,
      field: 'zenSessionsCount'
    },
    xpReward: 150,
    progress: { current: 8, target: 20 },
    unlockedAt: null
  },
  {
    id: 'geopolitics_sage',
    title: 'Geopolitics Sage',
    description: 'Mastered international relations and diplomacy',
    category: 'GENERAL',
    status: 'LOCKED',
    icon: 'FiGlobe',
    criteria: {
      type: 'geopolitics_score',
      threshold: 85,
      field: 'geopoliticsSkillScore'
    },
    xpReward: 200,
    progress: { current: 56, target: 85 },
    unlockedAt: null
  },
  {
    id: 'bias_buster',
    title: 'Bias Buster',
    description: 'Detected bias in 30 articles',
    category: 'TRUTH',
    status: 'LOCKED',
    icon: 'BiMask',
    criteria: {
      type: 'bias_detections',
      threshold: 30,
      field: 'biasDetectionsCount'
    },
    xpReward: 150,
    progress: { current: 18, target: 30 },
    unlockedAt: null
  },
  {
    id: 'marathon_mind',
    title: 'Marathon Mind',
    description: 'Maintained a 30-day streak',
    category: 'STREAK',
    status: 'LOCKED',
    icon: 'FiActivity',
    criteria: {
      type: 'streak_days',
      threshold: 30,
      field: 'currentStreak'
    },
    xpReward: 300,
    progress: { current: 12, target: 30 },
    unlockedAt: null
  },
  {
    id: 'daily_discipline',
    title: 'Daily Discipline',
    description: 'Completed 100 daily drills',
    category: 'GENERAL',
    status: 'LOCKED',
    icon: 'FiBook',
    criteria: {
      type: 'drills_completed',
      threshold: 100,
      field: 'drillsCompletedCount'
    },
    xpReward: 250,
    progress: { current: 45, target: 100 },
    unlockedAt: null
  }
];

// Sample philosophy quotes
const getPhilosophyQuotes = () => [
  {
    id: 'quote_1',
    text: 'In an age of information abundance, attention is the scarcest resource.',
    author: 'Herbert Simon',
    source: 'Designing Organizations for an Information-Rich World',
    tags: ['attention', 'mindfulness']
  },
  {
    id: 'quote_2',
    text: 'The task is not to see what has never been seen before, but to think what has never been thought before about what you see every day.',
    author: 'Erwin Schrödinger',
    source: '',
    tags: ['critical-thinking', 'observation']
  },
  {
    id: 'quote_3',
    text: 'Knowledge is of no value unless you put it into practice.',
    author: 'Anton Chekhov',
    source: '',
    tags: ['action', 'learning']
  },
  {
    id: 'quote_4',
    text: 'The media is the most powerful entity on earth. They have the power to make the innocent guilty and to make the guilty innocent.',
    author: 'Malcolm X',
    source: '',
    tags: ['media-literacy', 'power']
  },
  {
    id: 'quote_5',
    text: 'It is the mark of an educated mind to be able to entertain a thought without accepting it.',
    author: 'Aristotle',
    source: '',
    tags: ['critical-thinking', 'wisdom']
  }
];

// Sample daily question
const getTodayQuestion = () => ({
  id: `q_${new Date().toISOString().split('T')[0]}`,
  date: new Date().toISOString().split('T')[0],
  topicId: 'topic_ai_regulation',
  topicLabel: 'AI Regulation',
  difficulty: 'INTERMEDIATE',
  question: 'Which regulatory body recently announced new guidelines for AI transparency in consumer applications?',
  options: [
    'Federal Trade Commission (FTC)',
    'Securities and Exchange Commission (SEC)',
    'Food and Drug Administration (FDA)',
    'Environmental Protection Agency (EPA)'
  ],
  correctIndex: 0,
  explanation: 'The FTC recently announced guidelines requiring companies to disclose when AI is used in consumer-facing applications, focusing on transparency and preventing deceptive practices. This is part of a broader effort to regulate AI in commerce.',
  skillTags: ['factVerification', 'geopolitics']
});

// Default state
const getDefaultState = () => {
  const dayHistory = generateDayHistory();
  const currentStreak = calculateCurrentStreak(dayHistory);

  return {
    newsIq: {
      score: 73,
      xpTotal: 3450,
      xpLast30Days: 890,
      xpDailyCap: 5,
      lastUpdatedAt: new Date().toISOString()
    },
    skillScores: [
      {
        skill: 'factVerification',
        value: 85,
        change7d: 12,
        sampleSize: 45
      },
      {
        skill: 'biasDetection',
        value: 78,
        change7d: -3,
        sampleSize: 38
      },
      {
        skill: 'marketAnalysis',
        value: 64,
        change7d: 8,
        sampleSize: 22
      },
      {
        skill: 'geopolitics',
        value: 56,
        change7d: 15,
        sampleSize: 18
      }
    ],
    streak: {
      currentStreak,
      bestStreak: 18,
      lastActiveDate: dayHistory[dayHistory.length - 1].completed
        ? dayHistory[dayHistory.length - 1].date
        : dayHistory[dayHistory.length - 2].date,
      dayHistory
    },
    badges: getSampleBadges(),
    todayQuestion: getTodayQuestion(),
    todayAttempts: [],
    xpEvents: [],
    philosophyQuotes: getPhilosophyQuotes()
  };
};

// API Functions
export const getIQLabState = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('iqLab.state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Update today's question if date changed
          const today = new Date().toISOString().split('T')[0];
          if (parsed.todayQuestion.date !== today) {
            parsed.todayQuestion = getTodayQuestion();
            parsed.todayAttempts = [];
          }
          resolve(parsed);
          return;
        } catch (e) {
          console.error('Failed to parse saved state:', e);
        }
      }
      resolve(getDefaultState());
    }, 300);
  });
};

export const submitDrillAttempt = (questionId, answeredIndex) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('iqLab.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();

      const isCorrect = state.todayQuestion.correctIndex === answeredIndex;
      const isFirstDailyAttempt = state.todayAttempts.filter(a => a.countsForDailyReward).length === 0;
      const earnedXp = isCorrect && isFirstDailyAttempt ? 50 : isCorrect ? 10 : 0;

      // Create attempt
      const attempt = {
        questionId,
        answeredIndex,
        result: answeredIndex === null ? 'SKIPPED' : isCorrect ? 'CORRECT' : 'INCORRECT',
        firstTry: isFirstDailyAttempt,
        createdAt: new Date().toISOString(),
        earnedXp,
        countsForDailyReward: isFirstDailyAttempt && isCorrect
      };

      state.todayAttempts.push(attempt);

      // Update XP
      if (earnedXp > 0) {
        state.newsIq.xpTotal += earnedXp;
        state.newsIq.xpLast30Days += earnedXp;

        // Recalculate News IQ
        state.newsIq.score = Math.min(100, Math.max(0, 40 + Math.floor(state.newsIq.xpLast30Days / 100)));
        state.newsIq.lastUpdatedAt = new Date().toISOString();

        // Add XP event
        state.xpEvents.unshift({
          id: `xp_${Date.now()}`,
          sourceType: isFirstDailyAttempt ? 'DAILY_DRILL' : 'PRACTICE_DRILL',
          amount: earnedXp,
          createdAt: new Date().toISOString(),
          metadata: { questionId }
        });
      }

      // Update streak if first daily attempt and correct
      if (attempt.countsForDailyReward) {
        const today = new Date().toISOString().split('T')[0];
        state.streak.currentStreak = state.streak.currentStreak + 1;
        state.streak.lastActiveDate = today;
        state.streak.bestStreak = Math.max(state.streak.bestStreak, state.streak.currentStreak);

        // Update day history
        const todayIndex = state.streak.dayHistory.findIndex(d => d.date === today);
        if (todayIndex >= 0) {
          state.streak.dayHistory[todayIndex].completed = true;
          state.streak.dayHistory[todayIndex].xpEarned = earnedXp;
        }
      }

      // Update skill scores
      if (isCorrect && state.todayQuestion.skillTags) {
        state.todayQuestion.skillTags.forEach(tag => {
          const skill = state.skillScores.find(s => s.skill === tag);
          if (skill) {
            skill.sampleSize += 1;
            // Simple improvement logic
            skill.value = Math.min(100, skill.value + 1);
            skill.change7d += 1;
          }
        });
      }

      localStorage.setItem('iqLab.state', JSON.stringify(state));
      resolve({ attempt, updatedState: state });
    }, 500);
  });
};

export const unlockBadge = (badgeId) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('iqLab.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();

      const badge = state.badges.find(b => b.id === badgeId);
      if (badge && badge.status === 'LOCKED') {
        badge.status = 'UNLOCKED';
        badge.unlockedAt = new Date().toISOString();

        // Award XP
        state.newsIq.xpTotal += badge.xpReward;
        state.newsIq.xpLast30Days += badge.xpReward;
        state.newsIq.score = Math.min(100, Math.max(0, 40 + Math.floor(state.newsIq.xpLast30Days / 100)));

        // Add XP event
        state.xpEvents.unshift({
          id: `xp_${Date.now()}`,
          sourceType: 'BADGE_REWARD',
          amount: badge.xpReward,
          createdAt: new Date().toISOString(),
          metadata: { badgeId }
        });

        localStorage.setItem('iqLab.state', JSON.stringify(state));
      }

      resolve(state);
    }, 200);
  });
};

export const updateSkillScores = (skillUpdates) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('iqLab.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();

      skillUpdates.forEach(update => {
        const skill = state.skillScores.find(s => s.skill === update.skill);
        if (skill) {
          Object.assign(skill, update);
        }
      });

      localStorage.setItem('iqLab.state', JSON.stringify(state));
      resolve(state.skillScores);
    }, 100);
  });
};

const mockIQLabAPI = {
  getIQLabState,
  submitDrillAttempt,
  unlockBadge,
  updateSkillScores
};

export default mockIQLabAPI;
