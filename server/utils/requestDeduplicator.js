/**
 * Request Deduplication Utility
 *
 * Prevents duplicate concurrent API requests by caching ongoing promises.
 * This is critical for free tier API limits where multiple users might
 * request the same data simultaneously.
 *
 * Example:
 *   const result = await deduplicator.getOrFetch('news:headlines', fetchFunction);
 */

class RequestDeduplicator {
  constructor() {
    this.ongoingRequests = new Map();
  }

  /**
   * Get cached result from ongoing request or start new request
   * @param {string} key - Unique identifier for the request
   * @param {Function} fetchFn - Async function to fetch data if not in progress
   * @returns {Promise} - Result from fetch function
   */
  async getOrFetch(key, fetchFn) {
    // Check if request is already in progress
    if (this.ongoingRequests.has(key)) {
      console.log(`🔄 Deduplicating request: ${key}`);
      return this.ongoingRequests.get(key);
    }

    // Start new request
    const promise = (async () => {
      try {
        const result = await fetchFn();
        return result;
      } finally {
        // Clean up after request completes
        this.ongoingRequests.delete(key);
      }
    })();

    // Cache the promise
    this.ongoingRequests.set(key, promise);

    return promise;
  }

  /**
   * Clear all ongoing requests
   */
  clear() {
    this.ongoingRequests.clear();
  }

  /**
   * Get number of ongoing requests
   * @returns {number}
   */
  getCount() {
    return this.ongoingRequests.size;
  }

  /**
   * Check if a request is in progress
   * @param {string} key
   * @returns {boolean}
   */
  has(key) {
    return this.ongoingRequests.has(key);
  }
}

// Singleton instance
let instance = null;

/**
 * Get the singleton deduplicator instance
 * @returns {RequestDeduplicator}
 */
function getInstance() {
  if (!instance) {
    instance = new RequestDeduplicator();
  }
  return instance;
}

module.exports = {
  getInstance,
  RequestDeduplicator
};
