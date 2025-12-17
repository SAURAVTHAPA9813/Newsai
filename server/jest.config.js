/**
 * Jest Configuration
 * Testing setup for multi-provider news system
 */

module.exports = {
  // Test environment
  testEnvironment: 'node',

  // Coverage thresholds (90%+ required for production)
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    },
    // Specific thresholds for critical files
    './services/providers/articleValidator.js': {
      branches: 95,
      functions: 95,
      lines: 95,
      statements: 95
    },
    './config/categoryMapping.js': {
      branches: 100,
      functions: 100,
      lines: 100,
      statements: 100
    }
  },

  // Coverage collection
  collectCoverageFrom: [
    'services/**/*.js',
    'config/**/*.js',
    'utils/**/*.js',
    'controllers/**/*.js',
    'models/**/*.js',
    '!**/node_modules/**',
    '!**/test-*.js',
    '!**/list-models.js'
  ],

  // Test match patterns
  testMatch: [
    '**/__tests__/**/*.js',
    '**/?(*.)+(spec|test).js'
  ],

  // Setup files
  setupFilesAfterEnv: ['<rootDir>/tests/setup.js'],

  // Coverage reporters
  coverageReporters: [
    'text',
    'text-summary',
    'html',
    'lcov'
  ],

  // Module paths
  modulePaths: ['<rootDir>'],

  // Clear mocks between tests
  clearMocks: true,

  // Verbose output
  verbose: true,

  // Test timeout (5 seconds)
  testTimeout: 5000,

  // Ignore patterns
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],

  // Coverage ignore patterns
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '/tests/',
    'server.js',
    'index.mjs'
  ]
};
