/**
 * Trend Analysis Service
 * Analyzes news articles to extract trending topics and their momentum
 */

// Common stop words to filter out
const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
  'of', 'with', 'by', 'from', 'as', 'is', 'was', 'are', 'were', 'been',
  'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'should',
  'could', 'may', 'might', 'can', 'that', 'this', 'these', 'those', 'it',
  'its', 'his', 'her', 'their', 'what', 'which', 'who', 'when', 'where',
  'why', 'how', 'all', 'each', 'every', 'both', 'few', 'more', 'most',
  'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same',
  'so', 'than', 'too', 'very', 'says', 'said', 'new', 'news', 'report',
  'reports', 'reported', 'according'
]);

// High-value keywords and their categories
const KEYWORD_CATEGORIES = {
  tech: ['AI', 'artificial intelligence', 'ChatGPT', 'OpenAI', 'Google', 'Microsoft',
         'Apple', 'Meta', 'Tesla', 'Nvidia', 'AMD', 'Intel', 'tech', 'technology',
         'software', 'hardware', 'chip', 'semiconductor', 'cloud', 'quantum'],
  economy: ['Federal Reserve', 'Fed', 'inflation', 'interest rate', 'economy',
            'economic', 'GDP', 'recession', 'market', 'stock', 'trading', 'Wall Street',
            'unemployment', 'jobs', 'employment', 'wage', 'consumer'],
  politics: ['Biden', 'Trump', 'Congress', 'Senate', 'House', 'election', 'vote',
             'Democrat', 'Republican', 'White House', 'government', 'policy',
             'legislation', 'political'],
  crypto: ['Bitcoin', 'BTC', 'Ethereum', 'ETH', 'crypto', 'cryptocurrency',
           'blockchain', 'DeFi', 'NFT', 'altcoin', 'mining'],
  health: ['health', 'healthcare', 'medical', 'hospital', 'doctor', 'patient',
           'disease', 'vaccine', 'COVID', 'pandemic', 'drug', 'treatment'],
  climate: ['climate', 'global warming', 'carbon', 'emission', 'renewable',
            'solar', 'wind', 'green energy', 'sustainability', 'environment'],
  auto: ['Tesla', 'EV', 'electric vehicle', 'autonomous', 'self-driving',
         'automotive', 'car', 'vehicle'],
  finance: ['bank', 'banking', 'financial', 'investment', 'investor', 'fund',
            'capital', 'venture', 'IPO', 'merger', 'acquisition']
};

// Company/entity tracking for more precise trends
const TRACKED_ENTITIES = {
  'OpenAI': { category: 'tech', keywords: ['OpenAI', 'ChatGPT', 'GPT-4', 'GPT-5', 'Sam Altman'] },
  'Google': { category: 'tech', keywords: ['Google', 'Alphabet', 'Gemini', 'Bard', 'Sundar Pichai'] },
  'Microsoft': { category: 'tech', keywords: ['Microsoft', 'Copilot', 'Azure', 'Satya Nadella'] },
  'Apple': { category: 'tech', keywords: ['Apple', 'iPhone', 'iOS', 'Tim Cook', 'Vision Pro'] },
  'Nvidia': { category: 'tech', keywords: ['Nvidia', 'GPU', 'Jensen Huang', 'NVDA'] },
  'Tesla': { category: 'auto', keywords: ['Tesla', 'Elon Musk', 'TSLA', 'EV'] },
  'Meta': { category: 'tech', keywords: ['Meta', 'Facebook', 'Instagram', 'Mark Zuckerberg'] },
  'Amazon': { category: 'tech', keywords: ['Amazon', 'AWS', 'Jeff Bezos', 'AMZN'] },
  'Federal Reserve': { category: 'economy', keywords: ['Federal Reserve', 'Fed', 'Jerome Powell', 'FOMC', 'interest rate'] },
  'Bitcoin': { category: 'crypto', keywords: ['Bitcoin', 'BTC', 'crypto'] },
  'AI Regulation': { category: 'tech', keywords: ['AI regulation', 'AI policy', 'AI ethics', 'AI governance'] },
  'Climate Policy': { category: 'climate', keywords: ['climate policy', 'Paris Agreement', 'net zero', 'carbon tax'] }
};

/**
 * Extract trending topics from news articles
 * @param {Array} articles - Array of news articles
 * @param {number} topN - Number of top trends to return
 * @returns {Array} Array of trending topics with momentum scores
 */
exports.extractTrendingTopics = (articles, topN = 8) => {
  if (!articles || articles.length === 0) {
    return [];
  }

  // Score entities based on mentions
  const entityScores = {};

  articles.forEach((article, index) => {
    const text = `${article.title || ''} ${article.description || ''}`.toLowerCase();
    const recencyWeight = 1 + (articles.length - index) / articles.length; // More recent = higher weight

    // Check each tracked entity
    Object.entries(TRACKED_ENTITIES).forEach(([entity, data]) => {
      const mentionCount = data.keywords.reduce((count, keyword) => {
        const regex = new RegExp(keyword.toLowerCase(), 'gi');
        const matches = text.match(regex);
        return count + (matches ? matches.length : 0);
      }, 0);

      if (mentionCount > 0) {
        if (!entityScores[entity]) {
          entityScores[entity] = {
            name: entity,
            score: 0,
            mentions: 0,
            category: data.category
          };
        }
        entityScores[entity].score += mentionCount * recencyWeight;
        entityScores[entity].mentions += mentionCount;
      }
    });
  });

  // Convert to array and sort by score
  const trends = Object.values(entityScores)
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(trend => {
      // Calculate momentum/change percentage (simulated based on score)
      // Higher scores = higher momentum
      const baseChange = Math.min(trend.score * 25, 350); // Scale to reasonable percentage
      const randomVariation = (Math.random() - 0.3) * 50; // Add some variation
      const change = Math.round(baseChange + randomVariation);

      return {
        name: trend.name,
        change: Math.max(change, 15), // Minimum 15% change to show it's trending
        category: trend.category,
        mentions: trend.mentions
      };
    });

  return trends;
};

/**
 * Extract keyword phrases from articles (fallback if entity tracking doesn't find enough)
 * @param {Array} articles - Array of articles
 * @param {number} topN - Number of phrases to return
 * @returns {Array} Array of trending keyword phrases
 */
exports.extractKeywordPhrases = (articles, topN = 8) => {
  if (!articles || articles.length === 0) {
    return [];
  }

  const phraseScores = {};

  articles.forEach((article, index) => {
    const text = `${article.title || ''} ${article.description || ''}`;
    const recencyWeight = 1 + (articles.length - index) / articles.length;

    // Extract 2-3 word phrases
    const words = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !STOP_WORDS.has(word));

    // Create bigrams and trigrams
    for (let i = 0; i < words.length - 1; i++) {
      const bigram = `${words[i]} ${words[i + 1]}`;
      const trigram = i < words.length - 2 ? `${words[i]} ${words[i + 1]} ${words[i + 2]}` : null;

      [bigram, trigram].forEach(phrase => {
        if (phrase && phrase.length > 5) {
          if (!phraseScores[phrase]) {
            phraseScores[phrase] = { phrase, score: 0, count: 0 };
          }
          phraseScores[phrase].score += recencyWeight;
          phraseScores[phrase].count += 1;
        }
      });
    }
  });

  // Filter and sort phrases
  return Object.values(phraseScores)
    .filter(item => item.count >= 2) // Mentioned at least twice
    .sort((a, b) => b.score - a.score)
    .slice(0, topN)
    .map(item => ({
      name: item.phrase
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      change: Math.round(Math.min(item.score * 30, 300)),
      category: 'general',
      mentions: item.count
    }));
};

/**
 * Get market data (placeholder for now - can integrate real APIs later)
 * @returns {Object} Market data for major indices
 */
exports.getMarketData = () => {
  // TODO: Integrate real market data APIs (Alpha Vantage, Finnhub, etc.)
  // For now, return realistic-looking simulated data
  const now = new Date();
  const hour = now.getHours();

  // Market is open 9:30 AM - 4 PM ET (14:30 - 21:00 UTC)
  const isMarketHours = hour >= 14 && hour < 21;

  // Simulate realistic market movements
  const sp500Base = 4520;
  const btcBase = 42000;
  const vixBase = 15.5;

  return {
    sp500: {
      value: sp500Base + Math.round((Math.random() - 0.5) * 100),
      change: Number(((Math.random() - 0.45) * 2).toFixed(2))
    },
    btc: {
      value: btcBase + Math.round((Math.random() - 0.5) * 2000),
      change: Number(((Math.random() - 0.4) * 5).toFixed(2))
    },
    vix: {
      value: Number((vixBase + (Math.random() - 0.5) * 3).toFixed(2)),
      change: Number(((Math.random() - 0.5) * 2).toFixed(2))
    },
    isMarketOpen: isMarketHours
  };
};

/**
 * Analyze articles and return comprehensive trend data
 * @param {Array} articles - News articles to analyze
 * @returns {Object} Complete trend analysis
 */
exports.analyzeTrends = (articles) => {
  const entityTrends = exports.extractTrendingTopics(articles, 6);
  const keywordTrends = exports.extractKeywordPhrases(articles, 4);

  // Combine and deduplicate
  const allTrends = [...entityTrends, ...keywordTrends];
  const uniqueTrends = allTrends
    .filter((trend, index, self) =>
      index === self.findIndex(t => t.name.toLowerCase() === trend.name.toLowerCase())
    )
    .slice(0, 8);

  const marketData = exports.getMarketData();

  return {
    trends: uniqueTrends,
    marketData,
    lastUpdated: new Date().toISOString()
  };
};
