/**
 * Article Analysis Service
 * Analyzes news articles to generate credibility scores, anxiety levels, and impact metrics
 */

// Known source credibility database (0-100 scale)
const SOURCE_CREDIBILITY = {
  // Tier 1: Highly credible (90-100)
  'Reuters': 98,
  'Associated Press': 97,
  'BBC News': 95,
  'The New York Times': 92,
  'The Washington Post': 92,
  'The Guardian': 91,
  'NPR': 90,

  // Tier 2: Very credible (80-89)
  'The Wall Street Journal': 88,
  'Financial Times': 87,
  'The Economist': 86,
  'TIME': 85,
  'Bloomberg': 84,
  'CNN': 82,
  'Al Jazeera English': 81,

  // Tier 3: Credible (70-79)
  'USA Today': 78,
  'CBS News': 77,
  'ABC News': 76,
  'NBC News': 75,
  'Fox News': 72,
  'MSNBC': 72,
  'The Hill': 71,

  // Tier 4: Moderate credibility (60-69)
  'Newsweek': 68,
  'Business Insider': 65,
  'Forbes': 64,
  'TechCrunch': 63,
  'Ars Technica': 62,

  // Default for unknown sources
  'default': 55
};

// High-anxiety keywords (indicate stressful content)
const ANXIETY_KEYWORDS = {
  high: ['death', 'killed', 'war', 'attack', 'terror', 'shooting', 'murder', 'crisis', 'disaster', 'collapse', 'pandemic'],
  medium: ['concern', 'worry', 'risk', 'threat', 'warning', 'decline', 'loss', 'fall', 'drop', 'struggle'],
  low: ['issue', 'problem', 'challenge', 'change', 'shift']
};

/**
 * Calculate source credibility score
 * @param {string} sourceName - Name of the news source
 * @returns {number} Credibility score (0-100)
 */
function calculateSourceScore(sourceName) {
  if (!sourceName) return SOURCE_CREDIBILITY.default;

  // Direct match
  if (SOURCE_CREDIBILITY[sourceName]) {
    return SOURCE_CREDIBILITY[sourceName];
  }

  // Partial match (e.g., "BBC" matches "BBC News")
  const partialMatch = Object.keys(SOURCE_CREDIBILITY).find(key =>
    sourceName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(sourceName.toLowerCase())
  );

  if (partialMatch) {
    return SOURCE_CREDIBILITY[partialMatch];
  }

  return SOURCE_CREDIBILITY.default;
}

/**
 * Calculate anxiety/stress score based on article content
 * @param {string} title - Article title
 * @param {string} description - Article description
 * @param {string} category - Article category
 * @returns {number} Anxiety score (0-100, higher = more stressful)
 */
function calculateAnxietyScore(title = '', description = '', category = '') {
  const text = `${title} ${description}`.toLowerCase();
  let score = 0;

  // Base score by category
  const categoryScores = {
    'politics': 40,
    'health': 35,
    'science': 20,
    'technology': 15,
    'business': 30,
    'sports': 10,
    'entertainment': 5,
    'general': 25
  };

  score = categoryScores[category] || 25;

  // Add points for anxiety keywords
  ANXIETY_KEYWORDS.high.forEach(keyword => {
    if (text.includes(keyword)) score += 15;
  });

  ANXIETY_KEYWORDS.medium.forEach(keyword => {
    if (text.includes(keyword)) score += 8;
  });

  ANXIETY_KEYWORDS.low.forEach(keyword => {
    if (text.includes(keyword)) score += 3;
  });

  // Cap at 100
  return Math.min(score, 100);
}

/**
 * Determine verification badge based on source credibility
 * @param {number} sourceScore - Source credibility score
 * @returns {string} Verification status
 */
function getVerificationBadge(sourceScore) {
  if (sourceScore >= 90) return 'cross-verified';
  if (sourceScore >= 75) return 'verified';
  if (sourceScore >= 60) return 'reviewing';
  return 'unverified';
}

/**
 * Calculate life impact scores based on category and content
 * @param {string} category - Article category
 * @param {string} title - Article title
 * @returns {object} Impact scores for different life areas
 */
function calculateLifeImpact(category, title = '') {
  const text = title.toLowerCase();

  // Base scores by category
  const baseImpact = {
    'politics': { personal: 40, financial: 50, career: 45 },
    'health': { personal: 80, financial: 60, career: 30 },
    'science': { personal: 30, financial: 20, career: 40 },
    'technology': { personal: 50, financial: 40, career: 70 },
    'business': { personal: 30, financial: 85, career: 75 },
    'sports': { personal: 20, financial: 10, career: 15 },
    'entertainment': { personal: 15, financial: 5, career: 10 },
    'general': { personal: 30, financial: 30, career: 30 }
  };

  let impact = baseImpact[category] || baseImpact['general'];

  // Adjust based on keywords
  if (text.includes('tax') || text.includes('price') || text.includes('cost')) {
    impact.financial += 15;
  }
  if (text.includes('job') || text.includes('employment') || text.includes('work')) {
    impact.career += 20;
  }
  if (text.includes('health') || text.includes('safety') || text.includes('life')) {
    impact.personal += 20;
  }

  // Cap all at 100
  return {
    personal: Math.min(impact.personal, 100),
    financial: Math.min(impact.financial, 100),
    career: Math.min(impact.career, 100)
  };
}

/**
 * Generate realistic engagement metrics based on source and topic
 * @param {number} sourceScore - Source credibility score
 * @param {string} category - Article category
 * @returns {number} Estimated engagement count
 */
function calculateEngagement(sourceScore, category) {
  // Base engagement by source tier
  let base = (sourceScore / 100) * 5000;

  // Category multipliers
  const categoryMultipliers = {
    'politics': 1.8,
    'technology': 1.5,
    'business': 1.3,
    'health': 1.4,
    'sports': 1.6,
    'entertainment': 2.0,
    'science': 1.2,
    'general': 1.0
  };

  const multiplier = categoryMultipliers[category] || 1.0;
  const engagement = Math.floor(base * multiplier * (0.8 + Math.random() * 0.4)); // Add 20% variance

  return engagement;
}

/**
 * Analyze a complete article and return all scores
 * @param {object} article - Article object from NewsAPI
 * @returns {object} Analysis results with all scores
 */
function analyzeArticle(article) {
  const sourceName = article.source?.name || 'Unknown';
  const title = article.title || '';
  const description = article.description || '';
  const category = article.category || 'general';

  const sourceScore = calculateSourceScore(sourceName);
  const anxietyScore = calculateAnxietyScore(title, description, category);
  const verificationBadge = getVerificationBadge(sourceScore);
  const lifeImpact = calculateLifeImpact(category, title);
  const engagement = calculateEngagement(sourceScore, category);

  return {
    sourceScore,
    anxietyScore,
    verificationBadge,
    lifeImpact,
    engagement,
    // Additional metadata
    sourceTier: sourceScore >= 90 ? 'premium' : sourceScore >= 75 ? 'verified' : sourceScore >= 60 ? 'standard' : 'unverified',
    stressLevel: anxietyScore > 70 ? 'high' : anxietyScore > 40 ? 'medium' : 'low'
  };
}

/**
 * Calculate global volatility index based on current news landscape
 * @param {Array} articles - Array of articles to analyze
 * @returns {object} Volatility data with index, source count, and metrics
 */
function calculateGlobalVolatility(articles) {
  if (!articles || articles.length === 0) {
    return {
      index: 50,
      sourceCount: 0,
      breakingNewsCount: 0,
      avgAnxiety: 0
    };
  }

  // 1. Calculate average anxiety score
  let totalAnxiety = 0;
  articles.forEach(article => {
    const anxiety = calculateAnxietyScore(
      article.title || '',
      article.description || '',
      article.category || 'general'
    );
    totalAnxiety += anxiety;
  });
  const avgAnxiety = totalAnxiety / articles.length;

  // 2. Count unique sources (higher diversity = higher volatility)
  const uniqueSources = new Set(articles.map(a => a.source?.name).filter(Boolean));
  const sourceCount = uniqueSources.size;

  // 3. Count "breaking news" indicators
  const breakingKeywords = ['breaking', 'just in', 'developing', 'urgent', 'alert'];
  const breakingNewsCount = articles.filter(article => {
    const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
    return breakingKeywords.some(keyword => text.includes(keyword));
  }).length;

  // 4. Analyze source credibility variance (high variance = higher volatility)
  const credibilityScores = articles.map(a => calculateSourceScore(a.source?.name));
  const avgCredibility = credibilityScores.reduce((sum, score) => sum + score, 0) / credibilityScores.length;
  const credibilityVariance = credibilityScores.reduce((sum, score) => {
    return sum + Math.pow(score - avgCredibility, 2);
  }, 0) / credibilityScores.length;
  const credibilityStdDev = Math.sqrt(credibilityVariance);

  // 5. Calculate composite volatility index (0-100)
  // Higher anxiety, more sources, more breaking news, higher credibility variance = higher volatility
  let volatilityIndex = 0;

  // Anxiety contribution (0-35 points)
  volatilityIndex += (avgAnxiety / 100) * 35;

  // Source diversity contribution (0-25 points)
  // More sources = more volatility (cap at 150 sources for max score)
  volatilityIndex += Math.min(sourceCount / 150, 1) * 25;

  // Breaking news contribution (0-20 points)
  // Cap at 10 breaking news items for max score
  volatilityIndex += Math.min(breakingNewsCount / 10, 1) * 20;

  // Credibility variance contribution (0-20 points)
  // Higher variance in source quality = higher volatility (cap at stddev of 20)
  volatilityIndex += Math.min(credibilityStdDev / 20, 1) * 20;

  // Round to integer
  volatilityIndex = Math.round(volatilityIndex);

  return {
    index: volatilityIndex,
    sourceCount,
    breakingNewsCount,
    avgAnxiety: Math.round(avgAnxiety)
  };
}

module.exports = {
  calculateSourceScore,
  calculateAnxietyScore,
  getVerificationBadge,
  calculateLifeImpact,
  calculateEngagement,
  analyzeArticle,
  calculateGlobalVolatility
};
