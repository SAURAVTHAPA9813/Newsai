/**
 * Simple in-memory cache with TTL (Time To Live)
 * Prevents hitting NewsAPI rate limits while keeping data fresh
 */

class SimpleCache {
  constructor() {
    this.cache = new Map();
  }

  /**
   * Set a value in cache with TTL
   * @param {string} key - Cache key
   * @param {any} value - Value to cache
   * @param {number} ttlMs - Time to live in milliseconds (default: 5 minutes)
   */
  set(key, value, ttlMs = 5 * 60 * 1000) {
    const expiresAt = Date.now() + ttlMs;
    this.cache.set(key, {
      value,
      expiresAt
    });
  }

  /**
   * Get a value from cache
   * @param {string} key - Cache key
   * @returns {any|null} - Cached value or null if expired/not found
   */
  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // Check if expired
    if (Date.now() > cached.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return cached.value;
  }

  /**
   * Check if a key exists and is not expired
   * @param {string} key - Cache key
   * @returns {boolean}
   */
  has(key) {
    return this.get(key) !== null;
  }

  /**
   * Clear a specific key
   * @param {string} key - Cache key
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * Clear all cache
   */
  clear() {
    this.cache.clear();
  }

  /**
   * Clean up expired entries
   */
  cleanup() {
    const now = Date.now();
    for (const [key, { expiresAt }] of this.cache.entries()) {
      if (now > expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Get cache statistics
   * @returns {object} - Cache stats
   */
  stats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const { expiresAt } of this.cache.values()) {
      if (now > expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      total: this.cache.size,
      valid,
      expired
    };
  }
}

// Create global cache instance
const cache = new SimpleCache();

// Run cleanup every 10 minutes
setInterval(() => {
  cache.cleanup();
  console.log('Cache cleanup completed:', cache.stats());
}, 10 * 60 * 1000);

module.exports = cache;
