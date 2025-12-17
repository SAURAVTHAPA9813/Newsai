// Mock Neural Analytics API
// Provides comprehensive data for reading habits, topic trends, source diversity, and engagement stats

// Helper function to generate dates for the last N days
const generateDates = (days) => {
  const dates = [];
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  return dates;
};

// Mock data generators
const generateMockReadingSessions = () => {
  const topics = [
    { id: 'tech-1', name: 'AI & Machine Learning', category: 'TECH' },
    { id: 'finance-1', name: 'Stock Market', category: 'FINANCE' },
    { id: 'politics-1', name: 'US Elections', category: 'POLITICS' },
    { id: 'science-1', name: 'Climate Research', category: 'SCIENCE' },
    { id: 'health-1', name: 'Mental Health', category: 'HEALTH' },
    { id: 'politics-2', name: 'War & Conflict', category: 'POLITICS' },
  ];

  const sources = [
    { id: 'reuters', name: 'Reuters', tier: 'TIER_1' },
    { id: 'bloomberg', name: 'Bloomberg', tier: 'TIER_1' },
    { id: 'mit-tech', name: 'MIT Technology Review', tier: 'TIER_2' },
    { id: 'techcrunch', name: 'TechCrunch', tier: 'TIER_2' },
    { id: 'unknown-blog', name: 'Tech Blog XYZ', tier: 'TIER_3' },
  ];

  const sessions = [];
  for (let i = 0; i < 45; i++) {
    const topic = topics[Math.floor(Math.random() * topics.length)];
    const source = sources[Math.floor(Math.random() * sources.length)];
    const date = new Date();
    date.setDate(date.getDate() - Math.floor(Math.random() * 30));

    const readingMode = ['SKIM', 'DEEP_DIVE', 'DOOMSCROLL', 'INTENTIONAL'][Math.floor(Math.random() * 4)];
    const duration = readingMode === 'DEEP_DIVE' ? Math.random() * 20 + 10 : Math.random() * 5 + 1;

    sessions.push({
      id: `session-${i}`,
      startedAt: date.toISOString(),
      durationMinutes: Math.round(duration * 10) / 10,
      device: ['MOBILE', 'DESKTOP', 'TABLET'][Math.floor(Math.random() * 3)],
      topicId: topic.id,
      topicName: topic.name,
      topicCategory: topic.category,
      sourceId: source.id,
      sourceName: source.name,
      sourceTier: source.tier,
      wordCount: Math.floor(duration * 200),
      readingMode,
      engagementEvents: [
        { type: 'READ', timestamp: date.toISOString() },
        ...(Math.random() > 0.5 ? [{ type: 'OPENED_VERIFY_HUB', timestamp: date.toISOString() }] : []),
        ...(Math.random() > 0.7 ? [{ type: 'SAVED', timestamp: date.toISOString() }] : []),
      ],
      moodTag: ['CALM', 'FOCUSED', 'ANXIOUS', 'OVERWHELMED', 'NEUTRAL'][Math.floor(Math.random() * 5)],
      selfReportedAnxiety: topic.name.includes('War') ? Math.random() * 30 + 60 : Math.random() * 40 + 20,
    });
  }

  return sessions.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
};

const generateTopicMetrics = (sessions) => {
  const topicMap = {};

  sessions.forEach(session => {
    if (!topicMap[session.topicId]) {
      topicMap[session.topicId] = {
        topicId: session.topicId,
        topicName: session.topicName,
        category: session.topicCategory,
        minutesRead: 0,
        articlesCount: 0,
        anxietySum: 0,
      };
    }

    topicMap[session.topicId].minutesRead += session.durationMinutes;
    topicMap[session.topicId].articlesCount += 1;
    topicMap[session.topicId].anxietySum += session.selfReportedAnxiety;
  });

  return Object.values(topicMap).map(topic => ({
    ...topic,
    trendScore: Math.random() * 400 - 100, // -100 to +300
    anxietyCorrelation: topic.topicName.includes('War') ? 0.78 : Math.random() * 0.6 - 0.3,
    sentimentBalance: Math.random() * 2 - 1, // -1 to 1
    diversityScore: Math.random() * 40 + 60, // 60-100
  }));
};

const generateSourceMetrics = (sessions) => {
  const sourceMap = {};

  sessions.forEach(session => {
    if (!sourceMap[session.sourceId]) {
      sourceMap[session.sourceId] = {
        sourceId: session.sourceId,
        name: session.sourceName,
        domain: `${session.sourceId}.com`,
        tier: session.sourceTier,
        articlesCount: 0,
        minutesRead: 0,
      };
    }

    sourceMap[session.sourceId].minutesRead += session.durationMinutes;
    sourceMap[session.sourceId].articlesCount += 1;
  });

  return Object.values(sourceMap).map(source => ({
    ...source,
    diversityContribution: source.tier === 'TIER_1' ? Math.random() * 20 + 70 : Math.random() * 30 + 40,
    biasScore: source.tier === 'TIER_1' ? Math.random() * 20 : Math.random() * 40 + 30,
    reliabilityScore: source.tier === 'TIER_1' ? Math.random() * 15 + 85 : Math.random() * 30 + 50,
  }));
};

const generateDailyAggregates = (sessions, days = 30) => {
  const dates = generateDates(days);
  const dailyMap = {};

  dates.forEach(date => {
    dailyMap[date] = {
      date,
      minutesRead: 0,
      articlesRead: 0,
      anxietySum: 0,
      anxietyCount: 0,
    };
  });

  sessions.forEach(session => {
    const date = session.startedAt.split('T')[0];
    if (dailyMap[date]) {
      dailyMap[date].minutesRead += session.durationMinutes;
      dailyMap[date].articlesRead += 1;
      dailyMap[date].anxietySum += session.selfReportedAnxiety;
      dailyMap[date].anxietyCount += 1;
    }
  });

  return dates.map(date => {
    const day = dailyMap[date];
    return {
      date,
      minutesRead: Math.round(day.minutesRead * 10) / 10,
      articlesRead: day.articlesRead,
      averageAnxiety: day.anxietyCount > 0 ? Math.round(day.anxietySum / day.anxietyCount) : 0,
      focusScore: Math.random() * 30 + 60,
      truthScore: Math.random() * 20 + 75,
      cognitiveLoad: Math.random() * 40 + 40,
    };
  });
};

const generateKpiCards = (sessions, dailyAggregates) => {
  const recentSessions = sessions.slice(0, 10);
  const deepDiveCount = recentSessions.filter(s => s.readingMode === 'DEEP_DIVE').length;
  const intentionalCount = recentSessions.filter(s => s.readingMode === 'INTENTIONAL').length;
  const verifyHubUsage = recentSessions.filter(s =>
    s.engagementEvents.some(e => e.type === 'OPENED_VERIFY_HUB')
  ).length;

  return [
    {
      type: 'FOCUS_SCORE',
      label: 'Focus',
      value: Math.round(((deepDiveCount + intentionalCount) / recentSessions.length) * 100),
      changePercent: Math.random() * 20 - 5,
      description: 'More deep dives, fewer doomscroll sessions.',
    },
    {
      type: 'TRUTH_SCORE',
      label: 'Truth Score',
      value: Math.round((verifyHubUsage / recentSessions.length) * 100),
      changePercent: Math.random() * 10 - 2,
      description: 'High-cred sources and regular Verify Hub checks.',
    },
    {
      type: 'COGNITIVE_LOAD',
      label: 'Cognitive Load',
      value: Math.round(dailyAggregates.slice(-7).reduce((sum, d) => sum + d.cognitiveLoad, 0) / 7),
      changePercent: Math.random() * 15 - 10,
      description: 'Slightly lighter information load than last week.',
    },
  ];
};

const generateInsights = (topicMetrics, sourceMetrics) => {
  const insights = [];

  // Check for topic concentration
  const totalMinutes = topicMetrics.reduce((sum, t) => sum + t.minutesRead, 0);
  const topTopic = topicMetrics.sort((a, b) => b.minutesRead - a.minutesRead)[0];
  if (topTopic && (topTopic.minutesRead / totalMinutes) > 0.5) {
    insights.push({
      id: 'insight-concentration',
      title: `Heavy tilt toward ${topTopic.category.toLowerCase()}`,
      body: `Over the last 7 days, ${Math.round((topTopic.minutesRead / totalMinutes) * 100)}% of your reading time has been on ${topTopic.category.toLowerCase()}.`,
      severity: 'NOTICE',
      actionHint: 'Consider diversifying topics in your Topic Matrix.',
    });
  }

  // Check for good source diversity
  const tier1Count = sourceMetrics.filter(s => s.tier === 'TIER_1').length;
  const tier2Count = sourceMetrics.filter(s => s.tier === 'TIER_2').length;
  if (tier1Count >= 2 && tier2Count >= 1) {
    insights.push({
      id: 'insight-diversity',
      title: 'Good source diversity',
      body: `Your reading comes from a mix of Tier 1 and Tier 2 sources, with a strong reliability profile.`,
      severity: 'INFO',
      actionHint: 'Keep this pattern by verifying new sources in Verify Hub.',
    });
  }

  // Check for anxiety correlation
  const anxiousTopic = topicMetrics.find(t => t.anxietyCorrelation > 0.6);
  if (anxiousTopic) {
    insights.push({
      id: 'insight-anxiety',
      title: `Anxiety spikes with ${anxiousTopic.topicName.toLowerCase()}`,
      body: `Sessions tagged with ${anxiousTopic.topicName.toLowerCase()} correlate with higher self-reported anxiety.`,
      severity: 'WARNING',
      actionHint: 'Consider limiting this content via the Mental Health Firewall.',
    });
  }

  return insights;
};

// Main API functions
export const getNeuralAnalyticsData = (filters = {}) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const sessions = generateMockReadingSessions();
      const topicMetrics = generateTopicMetrics(sessions);
      const sourceMetrics = generateSourceMetrics(sessions);
      const dailyAggregates = generateDailyAggregates(sessions, 30);
      const kpiCards = generateKpiCards(sessions, dailyAggregates);
      const insights = generateInsights(topicMetrics, sourceMetrics);

      resolve({
        filters: {
          timeRange: filters.timeRange || 'LAST_7_DAYS',
          startDate: filters.startDate || generateDates(7)[0],
          endDate: filters.endDate || new Date().toISOString().split('T')[0],
          deviceFilter: filters.deviceFilter || [],
          topicFilterId: filters.topicFilterId || null,
        },
        readingSessions: sessions.slice(0, 20), // Return recent 20 for session log
        topicMetrics,
        sourceMetrics,
        dailyAggregates,
        kpiCards,
        insights,
      });
    }, 500);
  });
};

export const getTopicTrendData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const dates = generateDates(30);
      const categories = ['TECH', 'FINANCE', 'POLITICS', 'SCIENCE', 'HEALTH'];

      const data = dates.map(date => {
        const dayData = { date };
        categories.forEach(category => {
          dayData[category] = Math.random() * 60 + 10;
        });
        return dayData;
      });

      resolve(data);
    }, 300);
  });
};

export const getIntegrityData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        verified: 68,
        unverified: 22,
        opinion: 10,
      });
    }, 300);
  });
};
