/**
 * URL Validation Utilities
 * Validates URLs from news providers to prevent malicious or malformed URLs
 */

/**
 * Check if a string is a valid HTTP/HTTPS URL
 * @param {string} urlString - URL to validate
 * @returns {boolean} - True if valid URL
 */
function isValidUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return false;
  }

  try {
    const url = new URL(urlString);

    // Only allow HTTP and HTTPS protocols
    if (!['http:', 'https:'].includes(url.protocol)) {
      return false;
    }

    // Must have a hostname
    if (!url.hostname || url.hostname.length === 0) {
      return false;
    }

    // Hostname must contain at least one dot (e.g., example.com)
    if (!url.hostname.includes('.')) {
      return false;
    }

    // Reject localhost/private IPs in production
    if (process.env.NODE_ENV === 'production') {
      const hostname = url.hostname.toLowerCase();
      if (
        hostname === 'localhost' ||
        hostname.startsWith('127.') ||
        hostname.startsWith('192.168.') ||
        hostname.startsWith('10.') ||
        hostname === '0.0.0.0'
      ) {
        return false;
      }
    }

    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Validate and normalize a URL
 * @param {string} urlString - URL to validate
 * @returns {string|null} - Normalized URL or null if invalid
 */
function normalizeUrl(urlString) {
  if (!isValidUrl(urlString)) {
    return null;
  }

  try {
    const url = new URL(urlString);

    // Normalize protocol to https if possible
    if (url.protocol === 'http:' && !url.hostname.includes('localhost')) {
      url.protocol = 'https:';
    }

    return url.toString();
  } catch (error) {
    return null;
  }
}

/**
 * Check if a URL is from a trusted news domain
 * @param {string} urlString - URL to check
 * @returns {boolean} - True if from a known news source
 */
function isTrustedNewsDomain(urlString) {
  if (!isValidUrl(urlString)) {
    return false;
  }

  try {
    const url = new URL(urlString);
    const hostname = url.hostname.toLowerCase();

    // Common trusted news domains
    const trustedDomains = [
      'bbc.com', 'bbc.co.uk',
      'cnn.com', 'reuters.com',
      'theguardian.com', 'guardian.co.uk',
      'nytimes.com', 'wsj.com',
      'washingtonpost.com', 'bloomberg.com',
      'apnews.com', 'npr.org',
      'techcrunch.com', 'wired.com',
      'theverge.com', 'arstechnica.com'
    ];

    return trustedDomains.some(domain =>
      hostname === domain || hostname.endsWith(`.${domain}`)
    );
  } catch (error) {
    return false;
  }
}

module.exports = {
  isValidUrl,
  normalizeUrl,
  isTrustedNewsDomain
};
