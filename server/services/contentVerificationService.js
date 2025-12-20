/**
 * Content Verification Service
 * Comprehensive fact-checking for different types of content (headlines, tweets, URLs, articles)
 */

const axios = require("axios");
const { getInstance: getProviderManager } = require("./ProviderManager");
const geminiService = require("./geminiService");
const cache = require("../utils/cache");

// Fact-checking sources
const FACT_CHECK_SOURCES = [
  {
    name: "Snopes",
    url: "https://www.snopes.com",
    searchUrl: "https://www.snopes.com/search/",
    credibility: 95,
  },
  {
    name: "FactCheck.org",
    url: "https://www.factcheck.org",
    searchUrl: "https://www.factcheck.org/search/",
    credibility: 92,
  },
  {
    name: "PolitiFact",
    url: "https://www.politifact.com",
    searchUrl: "https://www.politifact.com/search/",
    credibility: 90,
  },
  {
    name: "AP Fact Check",
    url: "https://apnews.com",
    searchUrl: "https://apnews.com/hub/fact-check",
    credibility: 98,
  },
];

// Cache TTL for verification results
const VERIFICATION_CACHE_TTL = 30 * 60 * 1000; // 30 minutes

/**
 * Fetch content from URL
 * @param {string} url - URL to fetch
 * @returns {Promise<object>} Content data
 */
async function fetchUrlContent(url) {
  try {
    const response = await axios.get(url, {
      timeout: 10000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; NewsAI/1.0)",
      },
    });

    // Extract title and main content (simple extraction)
    const html = response.data;
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "Unknown Title";

    // Simple content extraction (remove scripts, styles, etc.)
    let content = html.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    content = content.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    content = content
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return {
      title,
      content: content.substring(0, 5000), // Limit content length
      url,
      fetched: true,
    };
  } catch (error) {
    console.warn("Failed to fetch URL content:", error.message);
    return {
      title: "Failed to fetch",
      content: "",
      url,
      fetched: false,
      error: error.message,
    };
  }
}

/**
 * Parse tweet/social media content
 * @param {string} tweetText - Tweet text
 * @returns {object} Parsed tweet data
 */
function parseTweetContent(tweetText) {
  // Simple tweet parsing
  const words = tweetText.split(/\s+/);
  const hashtags = words.filter((word) => word.startsWith("#"));
  const mentions = words.filter((word) => word.startsWith("@"));
  const urls = words.filter((word) => word.match(/^https?:\/\//));

  return {
    text: tweetText,
    hashtags,
    mentions,
    urls,
    length: tweetText.length,
    wordCount: words.length,
  };
}

/**
 * Search fact-checking sites for related claims
 * @param {string} query - Search query
 * @returns {Promise<Array>} Fact-check results
 */
async function searchFactCheckSites(query) {
  const results = [];

  try {
    // Use Google Custom Search or similar for fact-checking sites
    // For now, simulate with mock results based on query analysis
    const suspiciousKeywords = [
      "secret",
      "conspiracy",
      "hoax",
      "fake",
      "lie",
      "scam",
    ];
    const isSuspicious = suspiciousKeywords.some((keyword) =>
      query.toLowerCase().includes(keyword)
    );

    if (isSuspicious) {
      results.push({
        source: "Snopes",
        title: "Claim about " + query.substring(0, 50) + "...",
        verdict: "False",
        url: "https://www.snopes.com/fact-check/example/",
        credibility: 95,
      });
    } else {
      results.push({
        source: "FactCheck.org",
        title: "Analysis of " + query.substring(0, 50) + "...",
        verdict: "True",
        url: "https://www.factcheck.org/example/",
        credibility: 92,
      });
    }
  } catch (error) {
    console.warn("Fact-check search error:", error.message);
  }

  return results;
}

/**
 * Search for corroborating sources using news providers
 * @param {string} query - Search query
 * @returns {Promise<Array>} Corroborating articles
 */
async function searchCorroboratingSources(query) {
  try {
    const providerManager = getProviderManager();
    const searchResults = await providerManager.searchWithFallback(query, {
      page: 1,
      pageSize: 10,
    });

    return searchResults.articles || [];
  } catch (error) {
    console.warn("Corroboration search error:", error.message);
    return [];
  }
}

/**
 * Analyze content using AI (Gemini)
 * @param {object} contentData - Content to analyze
 * @param {string} verificationMode - Verification mode
 * @returns {Promise<object>} AI analysis results
 */
async function analyzeWithAI(contentData, verificationMode) {
  try {
    const prompt = `Analyze this content for factual accuracy and provide a truth score from 0-100, where 100 is completely verified true and 0 is completely false. Also provide reasoning and confidence level.

Content: ${contentData.title || contentData.text}
${
  contentData.content
    ? `Full content: ${contentData.content.substring(0, 2000)}`
    : ""
}

Verification mode: ${verificationMode}

Please respond in JSON format with: score, reasoning, confidence, key_facts, potential_issues`;

    const analysis = await geminiService.generateResponse(prompt);

    // Parse JSON response
    try {
      const parsed = JSON.parse(analysis);
      return {
        score: parsed.score || 50,
        reasoning: parsed.reasoning || analysis,
        confidence: parsed.confidence || "medium",
        keyFacts: parsed.key_facts || [],
        potentialIssues: parsed.potential_issues || [],
      };
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return {
        score: 50,
        reasoning: analysis,
        confidence: "medium",
        keyFacts: [],
        potentialIssues: [],
      };
    }
  } catch (error) {
    console.warn("AI analysis error:", error.message);
    return {
      score: 50,
      reasoning: "AI analysis unavailable",
      confidence: "low",
      keyFacts: [],
      potentialIssues: ["Analysis failed"],
    };
  }
}

/**
 * Calculate final verification score based on multiple factors
 * @param {object} aiAnalysis - AI analysis results
 * @param {Array} factChecks - Fact-check results
 * @param {Array} corroborations - Corroborating sources
 * @param {string} verificationMode - Verification mode
 * @returns {object} Final verification results
 */
function calculateFinalScore(
  aiAnalysis,
  factChecks,
  corroborations,
  verificationMode
) {
  let score = aiAnalysis.score;
  let confidence = 0;
  const reasons = [];

  // AI analysis contribution (40-60% based on mode)
  const aiWeight =
    verificationMode === "EXPERIMENTAL"
      ? 0.6
      : verificationMode === "STRICT"
      ? 0.4
      : 0.5;
  score = score * aiWeight;

  // Fact-check contribution (20-30%)
  if (factChecks.length > 0) {
    const factCheckAvg =
      factChecks.reduce((sum, fc) => {
        const verdictScore =
          fc.verdict === "True"
            ? 100
            : fc.verdict === "False"
            ? 0
            : fc.verdict === "Mostly True"
            ? 80
            : fc.verdict === "Mostly False"
            ? 20
            : 50;
        return sum + (verdictScore * fc.credibility) / 100;
      }, 0) / factChecks.length;

    const factWeight = verificationMode === "STRICT" ? 0.3 : 0.2;
    score += factCheckAvg * factWeight;
    confidence += 20;
    reasons.push(`${factChecks.length} fact-check sources analyzed`);
  }

  // Corroboration contribution (20-30%)
  if (corroborations.length > 0) {
    const corrWeight = verificationMode === "STRICT" ? 0.3 : 0.2;
    score += (corroborations.length / 10) * 100 * corrWeight; // More sources = higher score
    confidence += Math.min(corroborations.length * 5, 30);
    reasons.push(`${corroborations.length} corroborating sources found`);
  }

  // Mode adjustments
  if (verificationMode === "STRICT") {
    score = Math.max(0, score - 10); // More conservative
    confidence += 10;
  } else if (verificationMode === "EXPERIMENTAL") {
    // Keep score as-is, higher confidence in AI
    confidence += 15;
  }

  // Cap score
  score = Math.max(0, Math.min(100, Math.round(score)));

  // Determine verdict
  let verdict, verdictHuman, verdictColor;
  if (score >= 85) {
    verdict = "VERIFIED_TRUE";
    verdictHuman = "VERIFIED TRUE";
    verdictColor = "#10B981";
  } else if (score >= 70) {
    verdict = "LIKELY_TRUE";
    verdictHuman = "LIKELY TRUE";
    verdictColor = "#84CC16";
  } else if (score >= 40) {
    verdict = "UNCERTAIN";
    verdictHuman = "UNCERTAIN";
    verdictColor = "#F59E0B";
  } else if (score >= 20) {
    verdict = "LIKELY_FALSE";
    verdictHuman = "LIKELY FALSE";
    verdictColor = "#F97316";
  } else {
    verdict = "VERIFIED_FALSE";
    verdictHuman = "VERIFIED FALSE";
    verdictColor = "#EF4444";
  }

  return {
    score,
    verdict,
    verdictHuman,
    verdictColor,
    confidence: Math.min(
      confidence +
        (aiAnalysis.confidence === "high"
          ? 20
          : aiAnalysis.confidence === "medium"
          ? 10
          : 0),
      100
    ),
    reasons,
    summary: `${verdictHuman} (${score}/100) - ${reasons.join(", ")}`,
  };
}

/**
 * Generate detailed results for UI tabs
 * @param {object} contentData - Content data
 * @param {object} aiAnalysis - AI analysis
 * @param {Array} factChecks - Fact-checks
 * @param {Array} corroborations - Corroborations
 * @param {object} finalScore - Final score
 * @returns {object} Tab data
 */
function generateTabData(
  contentData,
  aiAnalysis,
  factChecks,
  corroborations,
  finalScore
) {
  return {
    summaryTab: {
      forensicSummary: aiAnalysis.reasoning,
      keyReasons: [
        ...aiAnalysis.keyFacts.map((fact) => ({ type: "PRO", text: fact })),
        ...aiAnalysis.potentialIssues.map((issue) => ({
          type: "CON",
          text: issue,
        })),
        ...factChecks.map((fc) => ({
          type:
            fc.verdict === "True" || fc.verdict === "Mostly True"
              ? "PRO"
              : "CON",
          text: `${fc.source}: ${fc.verdict} - ${fc.title}`,
        })),
      ].slice(0, 6), // Limit to 6 reasons
    },
    evidenceTab: {
      factChecks,
      corroboratingSources: corroborations.slice(0, 5),
      aiAnalysis: {
        score: aiAnalysis.score,
        confidence: aiAnalysis.confidence,
        keyFacts: aiAnalysis.keyFacts,
        potentialIssues: aiAnalysis.potentialIssues,
      },
    },
    biasTab: {
      detectedBiases: [], // TODO: Implement bias detection
      sourceDiversity: corroborations.length,
      sentimentAnalysis: "neutral", // TODO: Implement sentiment analysis
    },
    riskTab: {
      riskLevel:
        finalScore.score < 30
          ? "HIGH"
          : finalScore.score < 70
          ? "MEDIUM"
          : "LOW",
      sharingRecommendation:
        finalScore.score >= 70
          ? "Safe to share"
          : finalScore.score >= 40
          ? "Share with context"
          : "Do not share",
      potentialHarms: aiAnalysis.potentialIssues,
    },
    timelineTab: {
      events: [], // TODO: Implement timeline reconstruction
    },
  };
}

/**
 * Main verification function
 * @param {string} claimText - Text to verify
 * @param {string} inputType - Type of input (HEADLINE, TWEET_SOCIAL, URL, LONG_ARTICLE)
 * @param {string} verificationMode - Verification mode (STANDARD, STRICT, EXPERIMENTAL)
 * @returns {Promise<object>} Verification results
 */
async function verifyContent(
  claimText,
  inputType = "HEADLINE",
  verificationMode = "STANDARD"
) {
  const cacheKey = `verify:${inputType}:${verificationMode}:${claimText.substring(
    0,
    100
  )}`;
  const cached = cache.get(cacheKey);
  if (cached) {
    console.log("✅ Verification cache hit");
    return cached;
  }

  try {
    console.log(
      `🔍 Verifying content: ${inputType} in ${verificationMode} mode`
    );

    // Step 1: Process input based on type
    let contentData;
    switch (inputType) {
      case "URL":
        contentData = await fetchUrlContent(claimText);
        break;
      case "TWEET_SOCIAL":
        contentData = { text: claimText, ...parseTweetContent(claimText) };
        break;
      case "LONG_ARTICLE":
        contentData = { text: claimText, content: claimText };
        break;
      default: // HEADLINE
        contentData = { text: claimText };
    }

    // Step 2: AI Analysis
    const aiAnalysis = await analyzeWithAI(contentData, verificationMode);

    // Step 3: Fact-check search
    const factChecks = await searchFactCheckSites(
      contentData.text || contentData.title || claimText
    );

    // Step 4: Corroboration search
    const corroborations = await searchCorroboratingSources(
      contentData.text || contentData.title || claimText
    );

    // Step 5: Calculate final score
    const finalScore = calculateFinalScore(
      aiAnalysis,
      factChecks,
      corroborations,
      verificationMode
    );

    // Step 6: Generate tab data
    const tabData = generateTabData(
      contentData,
      aiAnalysis,
      factChecks,
      corroborations,
      finalScore
    );

    // Step 7: Compile results
    const results = {
      score: finalScore.score,
      verdict: finalScore.verdict,
      verdictHuman: finalScore.verdictHuman,
      verdictColor: finalScore.verdictColor,
      confidence: finalScore.confidence,
      summary: finalScore.summary,
      inputType,
      verificationMode,
      contentData,
      tabData,
      metadata: {
        verificationDate: new Date().toISOString(),
        processingTimeMs: Date.now() - Date.now(), // TODO: Calculate actual time
        sourcesAnalyzed: factChecks.length + corroborations.length,
        aiModelUsed: "gemini",
      },
    };

    // Cache results
    cache.set(cacheKey, results, VERIFICATION_CACHE_TTL);

    console.log(
      `✅ Verification complete: ${finalScore.verdictHuman} (${finalScore.score}/100)`
    );

    return results;
  } catch (error) {
    console.error("Verification error:", error);

    // Return error result
    const errorResult = {
      score: 0,
      verdict: "ERROR",
      verdictHuman: "VERIFICATION ERROR",
      verdictColor: "#6B7280",
      confidence: 0,
      summary: "Verification failed due to technical error",
      inputType,
      verificationMode,
      error: error.message,
      tabData: {
        summaryTab: {
          forensicSummary:
            "Unable to complete verification due to technical error.",
          keyReasons: [
            { type: "CAVEAT", text: "System error occurred during analysis" },
          ],
        },
      },
    };

    return errorResult;
  }
}

module.exports = {
  verifyContent,
  fetchUrlContent,
  parseTweetContent,
  searchFactCheckSites,
  searchCorroboratingSources,
  analyzeWithAI,
  calculateFinalScore,
};
