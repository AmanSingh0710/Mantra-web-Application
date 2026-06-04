//BACKEND/jest.config.js
module.exports = {
  testEnvironment: "node",
  testTimeout: 15000,
  forceExit: true,
  maxWorkers: 1,

   setupFilesAfterEnv: [
    "<rootDir>/tests/setup.js"
  ]
};