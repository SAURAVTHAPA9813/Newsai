/**
 * Jest Setup File
 * Runs before all tests to configure the test environment
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.JWT_SECRET = 'test-jwt-secret-key-for-testing-only';
process.env.MONGODB_URI = 'mongodb://localhost:27017/newsai-test';
process.env.PORT = '5001'; // Different port for testing

// Mock API keys (not real keys, just for testing)
process.env.NEWS_API_KEY = 'test-newsapi-key-12345';
process.env.GUARDIAN_API_KEY = 'test-guardian-key-12345';
process.env.GNEWS_API_KEY = 'test-gnews-key-12345';
process.env.NEWSDATA_API_KEY = 'test-newsdata-key-12345';
process.env.GOOGLE_GEMINI_API_KEY = 'test-gemini-key-12345';

// Suppress console logs during tests (comment out for debugging)
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error for debugging test failures
  error: console.error
};

// Increase test timeout for integration tests
jest.setTimeout(10000);

// Mock setTimeout/setInterval to avoid timing issues
jest.useFakeTimers({
  doNotFake: [
    'nextTick',
    'setImmediate',
    'clearImmediate',
    'Date'
  ]
});

// Global test utilities
global.mockArticle = {
  title: 'Test Article Title',
  description: 'Test article description with sample content',
  content: 'Full article content goes here with more details',
  url: 'https://example.com/test-article',
  urlToImage: 'https://example.com/image.jpg',
  publishedAt: new Date('2025-01-01T12:00:00Z'),
  source: {
    id: 'test-source',
    name: 'Test Source'
  },
  author: 'Test Author',
  category: 'technology'
};

global.mockArticleMinimal = {
  title: 'Minimal Article',
  url: 'https://example.com/minimal',
  publishedAt: new Date('2025-01-01T12:00:00Z')
};

global.mockArticleInvalid = {
  title: '',
  url: 'not-a-valid-url',
  publishedAt: 'invalid-date'
};

// Cleanup after all tests
afterAll(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
});
