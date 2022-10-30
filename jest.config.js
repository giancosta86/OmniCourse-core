module.exports = {
  transform: {
    "^.+\\.(t|j)sx?$": ["@swc/jest"]
  },

  testPathIgnorePatterns: ["<rootDir>/dist/", "/_.+"],

  setupFilesAfterEnv: ["jest-extended/all"]
};
