/**
 * News Verification Service
 * Cross-verifies news articles by checking consistency across multiple sources
 * Uses source credibility tiers and cross-reference validation
 */

const { getInstance: getProviderManager } = require("./ProviderManager");

/**
 * Tier 1 Sources (Highest Credibility: 95-100%)
 * Major international news organizations with rigorous fact-checking
 */
const TIER_1_SOURCES = [
  'reuters', 'associated press', 'ap news', 'bbc', 'the guardian',
  'washington post', 'new york times', 'wall street journal', 'financial times',
  'bloomberg', 'npr', 'pbs', 'the economist'
];

/**
 * Tier 2 Sources (High Credibility: 80-94%)
 * Reputable news organizations with good editorial standards
 */
const TIER_2_SOURCES = [
  'cnn', 'abc news', 'nbc news', 'cbs news', 'usa today', 'time',
  'newsweek', 'the atlantic', 'politico', 'the hill', 'axios', 'propublica',
  'business insider', 'forbes', 'cnbc', 'marketwatch', 'techcrunch', 'the verge',
  'wired', 'ars technica'
];

/**
 * Tier 3 Sources (Moderate Credibility: 60-79%)
 * Mainstream outlets with some editorial standards
 */
const TIER_3_SOURCES = [
  'huffpost', 'buzzfeed news', 'vice news', 'daily beast', 'salon',
  'slate', 'vox', 'quartz', 'mashable', 'engadget', 'gizmodo', 'lifehacker'
];

/**
 * Get source credibility tier and score
 * @param {string} sourceName - Source name to check
 * @returns {object} - { tier, score, badge }
 */
function getSourceCredibility(sourceName) {
  if (!sourceName) return { tier: 3, score: 30, badge: 'unverified' };

  const normalizedName = sourceName.toLowerCase().trim();

  // Check Tier 1 (95-100%)
  if (TIER_1_SOURCES.some(source => normalizedName.includes(source))) {
    return { tier: 1, score: 98, badge: 'cross-verified' };
  }

  // Check Tier 2 (80-94%)
  if (TIER_2_SOURCES.some(source => normalizedName.includes(source))) {
    return { tier: 2, score: 87, badge: 'verified' };
  }

  // Check Tier 3 (60-79%)
  if (TIER_3_SOURCES.some(source => normalizedName.includes(source))) {
    return { tier: 3, score: 70, badge: 'reviewing' };
  }

  // Unknown source
  return { tier: 4, score: 45, badge: 'unverified' };
}

/**
 * Extract key verification terms from article
 * @param {object} article - Article to analyze
 * @returns {string} Search query for verification
 */
function extractVerificationQuery(article) {
  const title = article.title || "";
  const description = article.description || "";

  // Remove common news words and extract key entities
  const stopWords = [
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "is",
    "are",
    "was",
    "were",
    "be",
    "been",
    "being",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "shall",
  ];

  const text = `${title} ${description}`.toLowerCase();
  const words = text.split(/\s+/).filter(
    (word) =>
      word.length > 3 && !stopWords.includes(word) && !/^\d+$/.test(word) // Remove pure numbers
  );

  // Get most frequent meaningful words (excluding source name)
  const sourceName = article.source?.name?.toLowerCase() || "";
  const filteredWords = words.filter((word) => !sourceName.includes(word));

  // Take top 5-7 most relevant words
  const keyWords = filteredWords.slice(0, 6);

  return keyWords.join(" ");
}

/**
 * Calculate similarity between two articles based on title overlap
 * @param {string} title1 - First article title
 * @param {string} title2 - Second article title
 * @returns {number} Similarity score (0-1)
 */
function calculateTitleSimilarity(title1, title2) {
  if (!title1 || !title2) return 0;

  const words1 = new Set(
    title1
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );
  const words2 = new Set(
    title2
      .toLowerCase()
      .split(/\s+/)
      .filter((w) => w.length > 2)
  );

  const intersection = new Set([...words1].filter((x) => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

/**
 * Verify an article by cross-checking with multiple sources
 * @param {object} article - Article to verify
 * @returns {Promise<object>} Verification result
 */
async function verifyArticle(article) {
  try {
    const providerManager = getProviderManager();
    const query = extractVerificationQuery(article);

    if (!query || query.trim().length < 10) {
      return {
        verified: false,
        confidence: 0,
        sources: 0,
        status: "insufficient_data",
        message: "Not enough content to verify",
      };
    }

    // Search for similar articles across all providers
    const searchResults = await providerManager.searchWithFallback(query, {
      page: 1,
      pageSize: 20,
    });

    if (!searchResults.articles || searchResults.articles.length === 0) {
      return {
        verified: false,
        confidence: 0,
        sources: 0,
        status: "no_similar_articles",
        message: "No similar articles found",
      };
    }

    // Filter out the original article and very low similarity matches
    const similarArticles = searchResults.articles.filter((otherArticle) => {
      if (otherArticle.url === article.url) return false;

      const similarity = calculateTitleSimilarity(
        article.title,
        otherArticle.title
      );
      return similarity > 0.3; // At least 30% title similarity
    });

    if (similarArticles.length === 0) {
      return {
        verified: false,
        confidence: 0,
        sources: 0,
        status: "no_corroboration",
        message: "No corroborating articles found",
      };
    }

    // Analyze source credibility of corroborating articles
    const corroboratingSources = similarArticles.map((otherArticle) => {
      const sourceCredibility = getSourceCredibility(otherArticle.source?.name);
      return {
        name: otherArticle.source?.name || "Unknown",
        credibility: sourceCredibility.score,
        similarity: calculateTitleSimilarity(article.title, otherArticle.title),
      };
    });

    // Calculate verification confidence
    const avgCredibility =
      corroboratingSources.reduce((sum, src) => sum + src.credibility, 0) /
      corroboratingSources.length;
    const sourceCount = corroboratingSources.length;
    const avgSimilarity =
      corroboratingSources.reduce((sum, src) => sum + src.similarity, 0) /
      corroboratingSources.length;

    // Confidence formula: weighted combination of source count, credibility, and similarity
    let confidence = 0;

    // Source count contribution (0-40 points)
    confidence += Math.min(sourceCount * 8, 40);

    // Average credibility contribution (0-40 points)
    confidence += (avgCredibility / 100) * 40;

    // Average similarity contribution (0-20 points)
    confidence += avgSimilarity * 20;

    confidence = Math.min(confidence, 100);

    // Determine verification status
    let status = "unverified";
    let verified = false;

    if (confidence >= 80) {
      status = "cross-verified";
      verified = true;
    } else if (confidence >= 60) {
      status = "verified";
      verified = true;
    } else if (confidence >= 40) {
      status = "likely_true";
    } else if (confidence >= 20) {
      status = "reviewing";
    }

    return {
      verified,
      confidence: Math.round(confidence),
      sources: sourceCount,
      status,
      corroboratingSources: corroboratingSources.slice(0, 5), // Top 5 for details
      message: verified
        ? `Verified by ${sourceCount} sources`
        : `Limited verification (${sourceCount} sources)`,
    };
  } catch (error) {
    console.error("Verification error:", error);
    return {
      verified: false,
      confidence: 0,
      sources: 0,
      status: "error",
      message: "Verification failed",
      error: error.message,
    };
  }
}

/**
 * Batch verify multiple articles
 * @param {Array<object>} articles - Articles to verify
 * @returns {Promise<Array<object>>} Verification results
 */
async function verifyArticlesBatch(articles) {
  const results = [];

  // Process in batches to avoid overwhelming the search APIs
  const batchSize = 3;
  for (let i = 0; i < articles.length; i += batchSize) {
    const batch = articles.slice(i, i + batchSize);
    const batchPromises = batch.map((article) => verifyArticle(article));
    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);

    // Small delay between batches to be respectful to APIs
    if (i + batchSize < articles.length) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }

  return results;
}

module.exports = {
  verifyArticle,
  verifyArticlesBatch,
  extractVerificationQuery,
  calculateTitleSimilarity,
  getSourceCredibility
};
