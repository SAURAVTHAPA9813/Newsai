/**
 * Article Validator Tests
 * Tests for article validation and normalization
 */

const {
  validateArticle,
  validateArticlesBatch,
  hasRequiredFields,
  isValidDate,
  parseDate,
  getDefaultImage,
  REQUIRED_FIELDS
} = require('../../../services/providers/articleValidator');

describe('Article Validator', () => {
  describe('isValidDate', () => {
    test('validates correct date string', () => {
      expect(isValidDate('2025-01-01T12:00:00Z')).toBe(true);
      expect(isValidDate('2025-12-14')).toBe(true);
    });

    test('validates Date object', () => {
      expect(isValidDate(new Date())).toBe(true);
    });

    test('rejects invalid dates', () => {
      expect(isValidDate('not-a-date')).toBe(false);
      expect(isValidDate('')).toBe(false);
      expect(isValidDate(null)).toBe(false);
      expect(isValidDate(undefined)).toBe(false);
    });
  });

  describe('parseDate', () => {
    test('parses valid date string', () => {
      const parsed = parseDate('2025-01-01T12:00:00Z');
      expect(parsed).toBeInstanceOf(Date);
      expect(parsed.getFullYear()).toBe(2025);
    });

    test('returns Date object as-is', () => {
      const date = new Date();
      expect(parseDate(date)).toBe(date);
    });

    test('fallbacks to current date for invalid input', () => {
      const parsed = parseDate('invalid');
      expect(parsed).toBeInstanceOf(Date);
      expect(isNaN(parsed.getTime())).toBe(false);
    });
  });

  describe('getDefaultImage', () => {
    test('returns default image for known categories', () => {
      expect(getDefaultImage('technology')).toContain('Technology');
      expect(getDefaultImage('business')).toContain('Business');
      expect(getDefaultImage('sports')).toContain('Sports');
    });

    test('returns general image for unknown category', () => {
      expect(getDefaultImage('unknown')).toContain('News');
      expect(getDefaultImage('')).toContain('News');
    });
  });

  describe('hasRequiredFields', () => {
    test('returns true for article with all required fields', () => {
      const article = {
        title: 'Test',
        url: 'https://example.com',
        publishedAt: new Date()
      };
      expect(hasRequiredFields(article)).toBe(true);
    });

    test('returns false for article missing required fields', () => {
      expect(hasRequiredFields({ title: 'Test' })).toBe(false);
      expect(hasRequiredFields({ url: 'https://example.com' })).toBe(false);
      expect(hasRequiredFields({})).toBe(false);
      expect(hasRequiredFields(null)).toBe(false);
    });
  });

  describe('validateArticle', () => {
    test('validates complete article successfully', () => {
      const article = {
        title: 'Test Article',
        description: 'Test description',
        content: 'Test content',
        url: 'https://example.com/article',
        urlToImage: 'https://example.com/image.jpg',
        publishedAt: new Date('2025-01-01'),
        source: { id: 'test', name: 'Test Source' },
        author: 'Test Author',
        category: 'technology'
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
      expect(result.article).toBeDefined();
      expect(result.article.title).toBe('Test Article');
      expect(result.article.provider).toBe('newsapi');
    });

    test('validates minimal article with required fields only', () => {
      const article = {
        title: 'Minimal Article',
        url: 'https://example.com/minimal',
        publishedAt: new Date()
      };

      const result = validateArticle(article, 'guardian');

      expect(result.valid).toBe(true);
      expect(result.article).toBeDefined();
      expect(result.article.description).toBe('Minimal Article'); // Falls back to title
      expect(result.article.author).toBe('Unknown'); // Default
      expect(result.article.category).toBe('general'); // Default
    });

    test('rejects article with missing title', () => {
      const article = {
        url: 'https://example.com',
        publishedAt: new Date()
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Missing or empty title');
    });

    test('rejects article with invalid URL', () => {
      const article = {
        title: 'Test',
        url: 'not-a-valid-url',
        publishedAt: new Date()
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid or missing URL');
    });

    test('rejects article with invalid date', () => {
      const article = {
        title: 'Test',
        url: 'https://example.com',
        publishedAt: 'invalid-date'
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Invalid or missing publishedAt date');
    });

    test('adds warnings for missing optional fields', () => {
      const article = {
        title: 'Test',
        url: 'https://example.com',
        publishedAt: new Date()
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0);
    });

    test('sanitizes HTML in content', () => {
      const article = {
        title: 'Test <script>alert("xss")</script>',
        url: 'https://example.com',
        publishedAt: new Date(),
        content: '<p>Good content</p><script>alert("bad")</script>'
      };

      const result = validateArticle(article, 'newsapi');

      expect(result.valid).toBe(true);
      expect(result.article.content).not.toContain('<script>');
    });

    test('throws error for invalid article input', () => {
      expect(() => validateArticle(null, 'newsapi')).toThrow('Article must be an object');
      expect(() => validateArticle('string', 'newsapi')).toThrow('Article must be an object');
    });

    test('throws error for missing provider', () => {
      const article = { title: 'Test', url: 'https://example.com', publishedAt: new Date() };
      expect(() => validateArticle(article, null)).toThrow('Provider name is required');
    });
  });

  describe('validateArticlesBatch', () => {
    test('validates batch of articles', () => {
      const articles = [
        { title: 'Article 1', url: 'https://example.com/1', publishedAt: new Date() },
        { title: 'Article 2', url: 'https://example.com/2', publishedAt: new Date() },
        { title: '', url: 'invalid', publishedAt: 'bad' } // Invalid
      ];

      const result = validateArticlesBatch(articles, 'newsapi');

      expect(result.total).toBe(3);
      expect(result.validCount).toBe(2);
      expect(result.invalidCount).toBe(1);
      expect(result.valid).toHaveLength(2);
      expect(result.invalid).toHaveLength(1);
    });

    test('handles empty array', () => {
      const result = validateArticlesBatch([], 'newsapi');

      expect(result.total).toBe(0);
      expect(result.validCount).toBe(0);
      expect(result.invalidCount).toBe(0);
    });

    test('throws error for non-array input', () => {
      expect(() => validateArticlesBatch('not-array', 'newsapi')).toThrow('Articles must be an array');
    });

    test('collects warnings from valid articles', () => {
      const articles = [
        { title: 'Article 1', url: 'https://example.com/1', publishedAt: new Date() }
      ];

      const result = validateArticlesBatch(articles, 'newsapi');

      expect(result.warnings.length).toBeGreaterThan(0);
      expect(result.warnings[0]).toHaveProperty('index');
      expect(result.warnings[0]).toHaveProperty('warnings');
    });
  });
});
