/**
 * Category Mapping Tests
 * Tests for UI <-> Provider category mappings
 */

const {
  UI_CATEGORIES,
  mapToProviderCategory,
  normalizeToUICategory,
  getProviderCategories,
  isValidCategoryForProvider,
  getUICategories
} = require('../../config/categoryMapping');

describe('Category Mapping', () => {
  describe('UI_CATEGORIES', () => {
    test('contains expected categories', () => {
      expect(UI_CATEGORIES).toContain('general');
      expect(UI_CATEGORIES).toContain('business');
      expect(UI_CATEGORIES).toContain('technology');
      expect(UI_CATEGORIES).toContain('sports');
      expect(UI_CATEGORIES).toContain('health');
      expect(UI_CATEGORIES).toContain('science');
      expect(UI_CATEGORIES).toContain('entertainment');
      expect(UI_CATEGORIES).toContain('politics');
      expect(UI_CATEGORIES).toContain('world');
    });

    test('has exactly 9 categories', () => {
      expect(UI_CATEGORIES).toHaveLength(9);
    });
  });

  describe('mapToProviderCategory', () => {
    test('maps technology to NewsAPI correctly', () => {
      expect(mapToProviderCategory('technology', 'newsapi')).toBe('technology');
    });

    test('maps sports to Guardian correctly (sport)', () => {
      expect(mapToProviderCategory('sports', 'guardian')).toBe('sport');
    });

    test('maps entertainment to Guardian correctly (culture)', () => {
      expect(mapToProviderCategory('entertainment', 'guardian')).toBe('culture');
    });

    test('maps politics to GNews correctly (nation)', () => {
      expect(mapToProviderCategory('politics', 'gnews')).toBe('nation');
    });

    test('maps general to NewsData correctly (top)', () => {
      expect(mapToProviderCategory('general', 'newsdata')).toBe('top');
    });

    test('maps all UI categories to NewsAPI without error', () => {
      UI_CATEGORIES.forEach(cat => {
        const mapped = mapToProviderCategory(cat, 'newsapi');
        expect(mapped).toBeDefined();
        expect(typeof mapped).toBe('string');
      });
    });

    test('maps all UI categories to Guardian without error', () => {
      UI_CATEGORIES.forEach(cat => {
        const mapped = mapToProviderCategory(cat, 'guardian');
        expect(mapped).toBeDefined();
        expect(typeof mapped).toBe('string');
      });
    });

    test('maps all UI categories to GNews without error', () => {
      UI_CATEGORIES.forEach(cat => {
        const mapped = mapToProviderCategory(cat, 'gnews');
        expect(mapped).toBeDefined();
        expect(typeof mapped).toBe('string');
      });
    });

    test('maps all UI categories to NewsData without error', () => {
      UI_CATEGORIES.forEach(cat => {
        const mapped = mapToProviderCategory(cat, 'newsdata');
        expect(mapped).toBeDefined();
        expect(typeof mapped).toBe('string');
      });
    });

    test('handles case insensitivity', () => {
      expect(mapToProviderCategory('TECHNOLOGY', 'newsapi')).toBe('technology');
      expect(mapToProviderCategory('Technology', 'NEWSAPI')).toBe('technology');
    });

    test('handles whitespace', () => {
      expect(mapToProviderCategory('  technology  ', '  newsapi  ')).toBe('technology');
    });

    test('falls back to general for unknown category', () => {
      expect(mapToProviderCategory('unknown-category', 'newsapi')).toBe('general');
      expect(mapToProviderCategory('invalid', 'guardian')).toBe('world');
    });

    test('falls back to general for unknown provider', () => {
      expect(mapToProviderCategory('technology', 'unknown-provider')).toBe('general');
    });

    test('handles invalid inputs gracefully', () => {
      expect(mapToProviderCategory('', 'newsapi')).toBe('general');
      expect(mapToProviderCategory(null, 'newsapi')).toBe('general');
      expect(mapToProviderCategory(undefined, 'newsapi')).toBe('general');
      expect(mapToProviderCategory('technology', '')).toBe('general');
      expect(mapToProviderCategory('technology', null)).toBe('general');
    });
  });

  describe('normalizeToUICategory', () => {
    test('normalizes NewsAPI categories correctly', () => {
      expect(normalizeToUICategory('technology', 'newsapi')).toBe('technology');
      expect(normalizeToUICategory('business', 'newsapi')).toBe('business');
    });

    test('normalizes Guardian sections correctly', () => {
      expect(normalizeToUICategory('sport', 'guardian')).toBe('sports');
      expect(normalizeToUICategory('culture', 'guardian')).toBe('entertainment');
      expect(normalizeToUICategory('society', 'guardian')).toBe('health');
    });

    test('normalizes GNews categories correctly', () => {
      expect(normalizeToUICategory('nation', 'gnews')).toBe('politics');
      expect(normalizeToUICategory('world', 'gnews')).toBe('world');
    });

    test('normalizes NewsData categories correctly', () => {
      expect(normalizeToUICategory('top', 'newsdata')).toBe('general');
    });

    test('handles case insensitivity', () => {
      expect(normalizeToUICategory('SPORT', 'guardian')).toBe('sports');
      expect(normalizeToUICategory('Sport', 'GUARDIAN')).toBe('sports');
    });

    test('handles whitespace', () => {
      expect(normalizeToUICategory('  sport  ', '  guardian  ')).toBe('sports');
    });

    test('falls back to general for unknown category', () => {
      expect(normalizeToUICategory('unknown', 'newsapi')).toBe('general');
      expect(normalizeToUICategory('invalid', 'guardian')).toBe('general');
    });

    test('falls back to general for unknown provider', () => {
      expect(normalizeToUICategory('technology', 'unknown-provider')).toBe('general');
    });

    test('handles invalid inputs gracefully', () => {
      expect(normalizeToUICategory('', 'newsapi')).toBe('general');
      expect(normalizeToUICategory(null, 'newsapi')).toBe('general');
      expect(normalizeToUICategory(undefined, 'newsapi')).toBe('general');
      expect(normalizeToUICategory('technology', '')).toBe('general');
      expect(normalizeToUICategory('technology', null)).toBe('general');
    });
  });

  describe('getProviderCategories', () => {
    test('returns categories for NewsAPI', () => {
      const categories = getProviderCategories('newsapi');
      expect(categories).toContain('general');
      expect(categories).toContain('technology');
      expect(categories).toContain('business');
    });

    test('returns sections for Guardian', () => {
      const categories = getProviderCategories('guardian');
      expect(categories).toContain('world');
      expect(categories).toContain('sport');
      expect(categories).toContain('culture');
    });

    test('returns unique categories only', () => {
      const categories = getProviderCategories('newsapi');
      const unique = [...new Set(categories)];
      expect(categories).toEqual(unique);
    });

    test('handles case insensitivity', () => {
      const lower = getProviderCategories('newsapi');
      const upper = getProviderCategories('NEWSAPI');
      expect(lower).toEqual(upper);
    });

    test('returns empty array for unknown provider', () => {
      expect(getProviderCategories('unknown')).toEqual([]);
    });

    test('handles invalid inputs gracefully', () => {
      expect(getProviderCategories('')).toEqual([]);
      expect(getProviderCategories(null)).toEqual([]);
      expect(getProviderCategories(undefined)).toEqual([]);
    });
  });

  describe('isValidCategoryForProvider', () => {
    test('validates correct category for provider', () => {
      expect(isValidCategoryForProvider('technology', 'newsapi')).toBe(true);
      expect(isValidCategoryForProvider('sport', 'guardian')).toBe(true);
    });

    test('rejects invalid category for provider', () => {
      expect(isValidCategoryForProvider('invalid-category', 'newsapi')).toBe(false);
    });

    test('handles case insensitivity', () => {
      expect(isValidCategoryForProvider('TECHNOLOGY', 'newsapi')).toBe(true);
    });

    test('returns false for invalid inputs', () => {
      expect(isValidCategoryForProvider('', 'newsapi')).toBe(false);
      expect(isValidCategoryForProvider(null, 'newsapi')).toBe(false);
      expect(isValidCategoryForProvider('technology', null)).toBe(false);
    });
  });

  describe('getUICategories', () => {
    test('returns all UI categories', () => {
      const categories = getUICategories();
      expect(categories).toHaveLength(9);
      expect(categories).toEqual(UI_CATEGORIES);
    });

    test('returns a copy, not the original array', () => {
      const categories = getUICategories();
      expect(categories).not.toBe(UI_CATEGORIES);
    });
  });

  describe('Bidirectional mapping consistency', () => {
    test('UI -> Provider -> UI mapping is consistent for NewsAPI', () => {
      UI_CATEGORIES.forEach(uiCat => {
        const providerCat = mapToProviderCategory(uiCat, 'newsapi');
        const backToUI = normalizeToUICategory(providerCat, 'newsapi');
        expect(UI_CATEGORIES).toContain(backToUI);
      });
    });

    test('UI -> Provider -> UI mapping is consistent for Guardian', () => {
      UI_CATEGORIES.forEach(uiCat => {
        const providerCat = mapToProviderCategory(uiCat, 'guardian');
        const backToUI = normalizeToUICategory(providerCat, 'guardian');
        expect(UI_CATEGORIES).toContain(backToUI);
      });
    });

    test('UI -> Provider -> UI mapping is consistent for GNews', () => {
      UI_CATEGORIES.forEach(uiCat => {
        const providerCat = mapToProviderCategory(uiCat, 'gnews');
        const backToUI = normalizeToUICategory(providerCat, 'gnews');
        expect(UI_CATEGORIES).toContain(backToUI);
      });
    });

    test('UI -> Provider -> UI mapping is consistent for NewsData', () => {
      UI_CATEGORIES.forEach(uiCat => {
        const providerCat = mapToProviderCategory(uiCat, 'newsdata');
        const backToUI = normalizeToUICategory(providerCat, 'newsdata');
        expect(UI_CATEGORIES).toContain(backToUI);
      });
    });
  });
});
