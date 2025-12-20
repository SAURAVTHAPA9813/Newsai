const express = require("express");
const router = express.Router();
const { verifyContent } = require("../services/contentVerificationService");
const { protect } = require("../middleware/auth");

// Rate limiting for verification requests
const verificationRequests = new Map();
const MAX_REQUESTS_PER_HOUR = 50;

/**
 * Check rate limit for verification requests
 * @param {string} userId - User ID
 * @returns {boolean} True if allowed
 */
function checkRateLimit(userId) {
  const now = Date.now();
  const hourAgo = now - 60 * 60 * 1000;

  if (!verificationRequests.has(userId)) {
    verificationRequests.set(userId, []);
  }

  const userRequests = verificationRequests.get(userId);

  // Remove old requests
  const recentRequests = userRequests.filter((time) => time > hourAgo);

  if (recentRequests.length >= MAX_REQUESTS_PER_HOUR) {
    return false;
  }

  // Add current request
  recentRequests.push(now);
  verificationRequests.set(userId, recentRequests);

  return true;
}

/**
 * POST /api/verification/verify
 * Verify a claim or content
 * Body: { claimText, inputType, verificationMode }
 */
router.post("/verify", protect, async (req, res) => {
  try {
    const {
      claimText,
      inputType = "HEADLINE",
      verificationMode = "STANDARD",
    } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!claimText || claimText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: "Claim text is required",
      });
    }

    if (claimText.length > 10000) {
      return res.status(400).json({
        success: false,
        message: "Claim text is too long (max 10,000 characters)",
      });
    }

    // Check rate limit
    if (!checkRateLimit(userId)) {
      return res.status(429).json({
        success: false,
        message: "Too many verification requests. Please try again later.",
      });
    }

    // Validate input type
    const validInputTypes = ["HEADLINE", "TWEET_SOCIAL", "URL", "LONG_ARTICLE"];
    if (!validInputTypes.includes(inputType)) {
      return res.status(400).json({
        success: false,
        message: "Invalid input type",
      });
    }

    // Validate verification mode
    const validModes = ["STANDARD", "STRICT", "EXPERIMENTAL"];
    if (!validModes.includes(verificationMode)) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification mode",
      });
    }

    console.log(
      `🔍 Verification request: ${inputType} in ${verificationMode} mode by user ${userId}`
    );

    // Perform verification
    const result = await verifyContent(claimText, inputType, verificationMode);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error("Verification API Error:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

/**
 * GET /api/verification/history
 * Get user's verification history
 */
router.get("/history", protect, async (req, res) => {
  try {
    // TODO: Implement verification history storage and retrieval
    res.json({
      success: true,
      data: {
        history: [],
        message: "History feature coming soon",
      },
    });
  } catch (error) {
    console.error("Verification History Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verification history",
    });
  }
});

/**
 * GET /api/verification/stats
 * Get verification statistics
 */
router.get("/stats", protect, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRequests = verificationRequests.get(userId) || [];
    const hourAgo = Date.now() - 60 * 60 * 1000;
    const recentRequests = userRequests.filter((time) => time > hourAgo);

    res.json({
      success: true,
      data: {
        requestsThisHour: recentRequests.length,
        maxRequestsPerHour: MAX_REQUESTS_PER_HOUR,
        remainingRequests: Math.max(
          0,
          MAX_REQUESTS_PER_HOUR - recentRequests.length
        ),
      },
    });
  } catch (error) {
    console.error("Verification Stats Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch verification stats",
    });
  }
});

module.exports = router;
