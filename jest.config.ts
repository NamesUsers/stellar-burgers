import type { Config } from 'jest';

const config: Config = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': 'babel-jest'
  },
  testEnvironment: 'jsdom',
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  moduleDirectories: ['node_modules', 'src'],
  moduleNameMapper: {
    '^../../utils/burger-api$': '<rootDir>/src/__mocks__/utils/burger-api.ts',
    '^../../utils/cookie$': '<rootDir>/src/__mocks__/utils/cookie.js'
  },
  transformIgnorePatterns: [
    'node_modules/(?!(.*\\.mjs$)|(@reduxjs/toolkit|react-redux|axios|@babel/runtime))'
  ],
  setupFilesAfterEnv: []
};

export default config;