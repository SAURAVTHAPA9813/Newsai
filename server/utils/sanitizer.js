/**
 * HTML/XSS Sanitization Utilities
 * Cleans user-generated or external content to prevent XSS attacks
 */

/**
 * Sanitize HTML string by removing/escaping dangerous tags and attributes
 * @param {string} html - HTML string to sanitize
 * @returns {string} - Sanitized HTML
 */
function sanitizeHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove script tags and their content
  let cleaned = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove event handlers (onclick, onerror, etc.)
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*["'][^"']*["']/gi, '');
  cleaned = cleaned.replace(/\s*on\w+\s*=\s*[^\s>]*/gi, '');

  // Remove javascript: protocol
  cleaned = cleaned.replace(/javascript:/gi, '');

  // Remove data: protocol (can be used for XSS)
  cleaned = cleaned.replace(/data:text\/html/gi, '');

  // Remove iframe tags
  cleaned = cleaned.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');

  // Remove object/embed tags
  cleaned = cleaned.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  cleaned = cleaned.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '');

  // Remove style tags (can contain expression() XSS in IE)
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return cleaned.trim();
}

/**
 * Sanitize plain text by escaping HTML entities
 * @param {string} text - Plain text to sanitize
 * @returns {string} - Sanitized text
 */
function sanitizeText(text) {
  if (!text || typeof text !== 'string') {
    return '';
  }

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
    .trim();
}

/**
 * Strip all HTML tags from a string, leaving only plain text
 * @param {string} html - HTML string
 * @returns {string} - Plain text
 */
function stripHtml(html) {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Remove all HTML tags
  let text = html.replace(/<[^>]+>/g, ' ');

  // Decode common HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/');

  // Collapse multiple spaces
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

/**
 * Sanitize article content (allows some safe HTML tags for formatting)
 * @param {string} content - Article content
 * @returns {string} - Sanitized content
 */
function sanitizeArticleContent(content) {
  if (!content || typeof content !== 'string') {
    return '';
  }

  // First pass: remove dangerous elements
  let cleaned = sanitizeHtml(content);

  // Allow only safe formatting tags: p, br, strong, em, ul, ol, li, a (with safe href)
  const allowedTags = ['p', 'br', 'strong', 'b', 'em', 'i', 'ul', 'ol', 'li', 'a', 'h1', 'h2', 'h3', 'blockquote'];

  // Remove any tags not in allowedTags
  cleaned = cleaned.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, (match, tag) => {
    if (allowedTags.includes(tag.toLowerCase())) {
      return match;
    }
    return '';
  });

  // Sanitize href attributes in anchor tags
  cleaned = cleaned.replace(/<a\s+[^>]*href\s*=\s*["']([^"']*)["'][^>]*>/gi, (match, href) => {
    // Only allow http/https URLs
    if (href.match(/^https?:\/\//i)) {
      return `<a href="${href}" target="_blank" rel="noopener noreferrer">`;
    }
    return '<a>';
  });

  return cleaned.trim();
}

/**
 * Sanitize user input (strict - no HTML allowed)
 * @param {string} input - User input
 * @param {number} maxLength - Maximum length (default: 10000)
 * @returns {string} - Sanitized input
 */
function sanitizeUserInput(input, maxLength = 10000) {
  if (!input || typeof input !== 'string') {
    return '';
  }

  // Strip all HTML
  let cleaned = stripHtml(input);

  // Trim to max length
  if (cleaned.length > maxLength) {
    cleaned = cleaned.substring(0, maxLength);
  }

  // Remove null bytes
  cleaned = cleaned.replace(/\0/g, '');

  // Remove control characters except newlines and tabs
  cleaned = cleaned.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');

  return cleaned.trim();
}

/**
 * Capitalize first letter of string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
function capitalize(str) {
  if (!str || typeof str !== 'string') {
    return '';
  }
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

module.exports = {
  sanitizeHtml,
  sanitizeText,
  stripHtml,
  sanitizeArticleContent,
  sanitizeUserInput,
  capitalize
};
