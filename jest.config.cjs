module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: './',
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*.ts'],
  testPathIgnorePatterns: ['<rootDir>/node_modules'],
  coverageReporters: ['json', 'html'],
  testMatch: ['<rootDir>/src/**/*.spec.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  }
}
