// Mock Topic Matrix API Service
// Provides sample data and persistence for Topic Matrix settings

// Generate sample topics
const generateSampleTopics = () => {
  return [
    {
      id: 'topic_1',
      name: 'AI in Healthcare',
      categories: ['technology', 'health'],
      priority: 95,
      priorityBand: 'MUST_SEE',
      trendScore: 212,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_2', 'topic_4', 'topic_9'],
      description: 'Breakthroughs, risks, and regulations for AI used in hospitals and diagnostics.',
      stats: {
        mentions7d: 1240,
        avgCredibility: 87
      }
    },
    {
      id: 'topic_2',
      name: 'Machine Learning',
      categories: ['technology', 'ai'],
      priority: 88,
      priorityBand: 'HIGH',
      trendScore: 156,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_1', 'topic_3', 'topic_5'],
      description: 'Latest algorithms, frameworks, and applications in ML.',
      stats: {
        mentions7d: 980,
        avgCredibility: 82
      }
    },
    {
      id: 'topic_3',
      name: 'Climate Tech',
      categories: ['climate', 'technology'],
      priority: 82,
      priorityBand: 'HIGH',
      trendScore: 143,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_8', 'topic_12'],
      description: 'Innovations in carbon capture, renewable energy, and sustainability.',
      stats: {
        mentions7d: 756,
        avgCredibility: 85
      }
    },
    {
      id: 'topic_4',
      name: 'Digital Health Records',
      categories: ['health', 'technology'],
      priority: 78,
      priorityBand: 'HIGH',
      trendScore: 89,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_1', 'topic_9'],
      description: 'Privacy, interoperability, and standards for electronic health records.',
      stats: {
        mentions7d: 432,
        avgCredibility: 79
      }
    },
    {
      id: 'topic_5',
      name: 'Startup Funding',
      categories: ['business', 'finance'],
      priority: 75,
      priorityBand: 'HIGH',
      trendScore: 124,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_6', 'topic_11'],
      description: 'VC trends, fundraising rounds, and startup valuations.',
      stats: {
        mentions7d: 892,
        avgCredibility: 76
      }
    },
    {
      id: 'topic_6',
      name: 'Cryptocurrency',
      categories: ['finance', 'technology'],
      priority: 65,
      priorityBand: 'MEDIUM',
      trendScore: 98,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_5', 'topic_14'],
      description: 'Bitcoin, Ethereum, DeFi, and regulatory developments.',
      stats: {
        mentions7d: 1120,
        avgCredibility: 68
      }
    },
    {
      id: 'topic_7',
      name: 'Remote Work Culture',
      categories: ['work', 'lifestyle'],
      priority: 62,
      priorityBand: 'MEDIUM',
      trendScore: 67,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_15', 'topic_20'],
      description: 'Hybrid models, productivity tools, and workplace evolution.',
      stats: {
        mentions7d: 534,
        avgCredibility: 74
      }
    },
    {
      id: 'topic_8',
      name: 'Renewable Energy',
      categories: ['climate', 'energy'],
      priority: 68,
      priorityBand: 'MEDIUM',
      trendScore: 112,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_3', 'topic_12'],
      description: 'Solar, wind, and battery technology breakthroughs.',
      stats: {
        mentions7d: 678,
        avgCredibility: 83
      }
    },
    {
      id: 'topic_9',
      name: 'Medical Research',
      categories: ['health', 'science'],
      priority: 72,
      priorityBand: 'HIGH',
      trendScore: 95,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_1', 'topic_4'],
      description: 'Clinical trials, drug development, and breakthrough treatments.',
      stats: {
        mentions7d: 812,
        avgCredibility: 91
      }
    },
    {
      id: 'topic_10',
      name: 'Space Exploration',
      categories: ['science', 'technology'],
      priority: 58,
      priorityBand: 'MEDIUM',
      trendScore: 134,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_16', 'topic_22'],
      description: 'SpaceX, NASA missions, and commercial space travel.',
      stats: {
        mentions7d: 445,
        avgCredibility: 80
      }
    },
    {
      id: 'topic_11',
      name: 'Tech IPOs',
      categories: ['business', 'finance'],
      priority: 54,
      priorityBand: 'MEDIUM',
      trendScore: 78,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_5', 'topic_6'],
      description: 'Public offerings, market valuations, and tech stock trends.',
      stats: {
        mentions7d: 389,
        avgCredibility: 77
      }
    },
    {
      id: 'topic_12',
      name: 'Electric Vehicles',
      categories: ['technology', 'climate'],
      priority: 70,
      priorityBand: 'HIGH',
      trendScore: 156,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_3', 'topic_8'],
      description: 'EVs, charging infrastructure, and automotive innovation.',
      stats: {
        mentions7d: 923,
        avgCredibility: 81
      }
    },
    {
      id: 'topic_13',
      name: 'Cybersecurity',
      categories: ['technology', 'security'],
      priority: 80,
      priorityBand: 'HIGH',
      trendScore: 145,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_17', 'topic_21'],
      description: 'Data breaches, ransomware, and security best practices.',
      stats: {
        mentions7d: 1034,
        avgCredibility: 84
      }
    },
    {
      id: 'topic_14',
      name: 'Stock Market Trends',
      categories: ['finance', 'economy'],
      priority: 48,
      priorityBand: 'MEDIUM',
      trendScore: 89,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_6', 'topic_11'],
      description: 'Market movements, economic indicators, and investment strategies.',
      stats: {
        mentions7d: 1456,
        avgCredibility: 73
      }
    },
    {
      id: 'topic_15',
      name: 'Mental Health Awareness',
      categories: ['health', 'lifestyle'],
      priority: 65,
      priorityBand: 'MEDIUM',
      trendScore: 102,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_7', 'topic_19'],
      description: 'Therapy, wellness apps, and workplace mental health initiatives.',
      stats: {
        mentions7d: 623,
        avgCredibility: 86
      }
    },
    {
      id: 'topic_16',
      name: 'Quantum Computing',
      categories: ['technology', 'science'],
      priority: 60,
      priorityBand: 'MEDIUM',
      trendScore: 178,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_10', 'topic_2'],
      description: 'Quantum algorithms, hardware breakthroughs, and practical applications.',
      stats: {
        mentions7d: 345,
        avgCredibility: 88
      }
    },
    {
      id: 'topic_17',
      name: 'Privacy Legislation',
      categories: ['policy', 'technology'],
      priority: 72,
      priorityBand: 'HIGH',
      trendScore: 87,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_13', 'topic_18'],
      description: 'GDPR, data protection laws, and digital rights.',
      stats: {
        mentions7d: 467,
        avgCredibility: 82
      }
    },
    {
      id: 'topic_18',
      name: 'Celebrity Drama',
      categories: ['entertainment', 'celebrity'],
      priority: 15,
      priorityBand: 'IGNORE',
      trendScore: 234,
      firewallStatus: 'BLOCKED',
      relatedIds: [],
      description: 'Celebrity news, gossip, and entertainment drama.',
      stats: {
        mentions7d: 2340,
        avgCredibility: 42
      }
    },
    {
      id: 'topic_19',
      name: 'Education Technology',
      categories: ['education', 'technology'],
      priority: 56,
      priorityBand: 'MEDIUM',
      trendScore: 93,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_15', 'topic_25'],
      description: 'Online learning platforms, EdTech tools, and educational trends.',
      stats: {
        mentions7d: 512,
        avgCredibility: 79
      }
    },
    {
      id: 'topic_20',
      name: 'Work-Life Balance',
      categories: ['lifestyle', 'work'],
      priority: 52,
      priorityBand: 'MEDIUM',
      trendScore: 76,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_7', 'topic_15'],
      description: 'Time management, boundaries, and sustainable work practices.',
      stats: {
        mentions7d: 398,
        avgCredibility: 77
      }
    },
    {
      id: 'topic_21',
      name: 'Violent Crime',
      categories: ['crime', 'news'],
      priority: 25,
      priorityBand: 'LOW',
      trendScore: 156,
      firewallStatus: 'BLOCKED',
      relatedIds: [],
      description: 'Crime reports and violent incidents.',
      stats: {
        mentions7d: 1890,
        avgCredibility: 65
      }
    },
    {
      id: 'topic_22',
      name: 'Artificial General Intelligence',
      categories: ['ai', 'technology', 'science'],
      priority: 85,
      priorityBand: 'HIGH',
      trendScore: 198,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_1', 'topic_2', 'topic_16'],
      description: 'Progress toward AGI, safety concerns, and philosophical implications.',
      stats: {
        mentions7d: 876,
        avgCredibility: 84
      }
    },
    {
      id: 'topic_23',
      name: 'Supply Chain',
      categories: ['business', 'economy'],
      priority: 50,
      priorityBand: 'MEDIUM',
      trendScore: 67,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_14', 'topic_26'],
      description: 'Logistics, manufacturing, and global trade dynamics.',
      stats: {
        mentions7d: 567,
        avgCredibility: 80
      }
    },
    {
      id: 'topic_24',
      name: 'War & Conflict',
      categories: ['news', 'politics'],
      priority: 35,
      priorityBand: 'LOW',
      trendScore: 189,
      firewallStatus: 'LIMITED',
      relatedIds: [],
      description: 'International conflicts and geopolitical tensions.',
      stats: {
        mentions7d: 2134,
        avgCredibility: 78
      }
    },
    {
      id: 'topic_25',
      name: 'Skill Development',
      categories: ['education', 'career'],
      priority: 68,
      priorityBand: 'MEDIUM',
      trendScore: 84,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_19', 'topic_7'],
      description: 'Professional development, certifications, and career growth.',
      stats: {
        mentions7d: 445,
        avgCredibility: 81
      }
    },
    {
      id: 'topic_26',
      name: 'Macroeconomy',
      categories: ['economy', 'finance'],
      priority: 62,
      priorityBand: 'MEDIUM',
      trendScore: 102,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_14', 'topic_23'],
      description: 'Interest rates, inflation, GDP, and economic policy.',
      stats: {
        mentions7d: 934,
        avgCredibility: 82
      }
    },
    {
      id: 'topic_27',
      name: 'Gene Therapy',
      categories: ['health', 'science'],
      priority: 70,
      priorityBand: 'HIGH',
      trendScore: 145,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_9', 'topic_1'],
      description: 'CRISPR, genetic treatments, and personalized medicine.',
      stats: {
        mentions7d: 412,
        avgCredibility: 89
      }
    },
    {
      id: 'topic_28',
      name: 'Social Media Trends',
      categories: ['technology', 'culture'],
      priority: 38,
      priorityBand: 'LOW',
      trendScore: 198,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_18'],
      description: 'Platform changes, viral content, and digital culture.',
      stats: {
        mentions7d: 1678,
        avgCredibility: 58
      }
    },
    {
      id: 'topic_29',
      name: 'Sustainable Agriculture',
      categories: ['climate', 'agriculture'],
      priority: 55,
      priorityBand: 'MEDIUM',
      trendScore: 78,
      firewallStatus: 'ALLOWED',
      relatedIds: ['topic_3', 'topic_8'],
      description: 'Vertical farming, regenerative practices, and food security.',
      stats: {
        mentions7d: 378,
        avgCredibility: 83
      }
    },
    {
      id: 'topic_30',
      name: 'Pandemic News',
      categories: ['health', 'news'],
      priority: 42,
      priorityBand: 'MEDIUM',
      trendScore: 112,
      firewallStatus: 'LIMITED',
      relatedIds: ['topic_9'],
      description: 'Disease outbreaks, public health responses, and vaccine development.',
      stats: {
        mentions7d: 1234,
        avgCredibility: 85
      }
    }
  ];
};

// Default state
const getDefaultState = () => ({
  contextProfile: {
    industry: 'Software Engineer',
    role: 'Mid',
    regionLabel: 'United States',
    regionGranularity: 'COUNTRY',
    focusAreas: ['AI', 'Healthcare Policy', 'Startups'],
    contextInfluence: 0.7
  },
  firewallSettings: {
    anxietyMode: 'BALANCED',
    hardBlocks: ['celebrity_gossip', 'violent_crime'],
    exposureLimits: {
      war_conflict: 2,
      pandemics: 1,
      politics_drama: 3
    }
  },
  aiPolicy: {
    rawInstructions: '',
    derivedTags: [],
    summaryLines: []
  },
  topics: generateSampleTopics(),
  topicPreferences: [],
  uiState: {
    viewMode: 'GRID',
    searchQuery: '',
    activeFilter: 'ALL',
    sortMode: 'RELEVANCE',
    selectedTopicId: null
  }
});

// Main API functions
export const getTopicMatrixState = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Try to load from localStorage
      const saved = localStorage.getItem('topicMatrix.state');
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          // Merge with defaults to ensure all fields exist
          const merged = {
            ...getDefaultState(),
            ...parsed,
            topics: generateSampleTopics() // Always use fresh topics
          };
          resolve(merged);
          return;
        } catch (e) {
          console.error('Failed to parse saved state:', e);
        }
      }
      resolve(getDefaultState());
    }, 300);
  });
};

export const updateContextProfile = (profile) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('topicMatrix.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();
      state.contextProfile = profile;
      localStorage.setItem('topicMatrix.state', JSON.stringify(state));
      resolve(profile);
    }, 100);
  });
};

export const updateFirewallSettings = (settings) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('topicMatrix.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();
      state.firewallSettings = settings;
      localStorage.setItem('topicMatrix.state', JSON.stringify(state));
      resolve(settings);
    }, 100);
  });
};

export const updateAiPolicy = (policy) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('topicMatrix.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();
      state.aiPolicy = policy;
      localStorage.setItem('topicMatrix.state', JSON.stringify(state));
      resolve(policy);
    }, 100);
  });
};

export const updateTopicPreference = (topicId, preferences) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('topicMatrix.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();

      // Find existing preference or create new
      const existingIndex = state.topicPreferences.findIndex(p => p.topicId === topicId);
      if (existingIndex >= 0) {
        state.topicPreferences[existingIndex] = preferences;
      } else {
        state.topicPreferences.push(preferences);
      }

      localStorage.setItem('topicMatrix.state', JSON.stringify(state));
      resolve(preferences);
    }, 100);
  });
};

export const updateUIState = (uiState) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const saved = localStorage.getItem('topicMatrix.state');
      const state = saved ? JSON.parse(saved) : getDefaultState();
      state.uiState = { ...state.uiState, ...uiState };
      localStorage.setItem('topicMatrix.state', JSON.stringify(state));
      resolve(state.uiState);
    }, 50);
  });
};

const mockTopicMatrixAPI = {
  getTopicMatrixState,
  updateContextProfile,
  updateFirewallSettings,
  updateAiPolicy,
  updateTopicPreference,
  updateUIState
};

export default mockTopicMatrixAPI;
