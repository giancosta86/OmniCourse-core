module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },

  testPathIgnorePatterns: ["/_.+", "<rootDir>/dist/"],

  setupFilesAfterEnv: [
    "jest-extended/all",
    "@giancosta86/more-jest/dist/all",
    "<rootDir>/src/test/setup.ts"
  ]
};
