/**
 * Simple in-memory cache middleware
 * Caches API responses for specified duration
 */

const cache = new Map();

// Clean up old cache entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiresAt) {
      cache.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
 * Create cache middleware
 * @param {number} durationSeconds - Cache duration in seconds
 * @param {function} keyGenerator - Optional custom key generator function
 */
const cacheMiddleware = (durationSeconds = 60, keyGenerator = null) => {
  return (req, res, next) => {
    // Skip caching in non-GET requests
    if (req.method !== 'GET') {
      return next();
    }

    // Generate cache key
    const cacheKey = keyGenerator
      ? keyGenerator(req)
      : `${req.user?._id || 'anon'}:${req.originalUrl}`;

    // Check if cached response exists and is still valid
    const cachedResponse = cache.get(cacheKey);
    if (cachedResponse && Date.now() < cachedResponse.expiresAt) {
      console.log(`Cache HIT: ${cacheKey}`);
      return res.json(cachedResponse.data);
    }

    console.log(`Cache MISS: ${cacheKey}`);

    // Store original res.json
    const originalJson = res.json.bind(res);

    // Override res.json to cache the response
    res.json = function(data) {
      // Only cache successful responses
      if (data && data.success !== false) {
        cache.set(cacheKey, {
          data,
          expiresAt: Date.now() + (durationSeconds * 1000)
        });
      }
      return originalJson(data);
    };

    next();
  };
};

/**
 * Clear cache for specific key or pattern
 */
const clearCache = (pattern = null) => {
  if (!pattern) {
    cache.clear();
    return;
  }

  for (const key of cache.keys()) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
};

/**
 * Generate cache key with user and query params
 */
const userQueryKey = (req) => {
  const userId = req.user?._id || 'anon';
  const queryString = Object.keys(req.query)
    .sort()
    .map(k => `${k}=${req.query[k]}`)
    .join('&');
  return `${userId}:${req.path}:${queryString}`;
};

module.exports = {
  cacheMiddleware,
  clearCache,
  userQueryKey
};
