module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.tsx', '!envConfig.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['json', 'html'],
  testMatch: ['<rootDir>/src/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
