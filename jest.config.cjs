module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.tsx', '!<rootDir>/envConfig.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['json', 'html'],
  testMatch: ['<rootDir>/src/**/*.test.tsx', '!<rootDir>/envConfig.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
