/** @type {import('jest').Config} */
module.exports = {
  testEnvironment: 'node',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  // Eval suites spawn a real claw subprocess and round-trip a 30B model;
  // wrap-rate runs 10 streamed completions back-to-back. 5 min covers worst case.
  testTimeout: 300000,
  // Run sequentially: only one model can hold unified memory at a time.
  maxWorkers: 1,
  reporters: ['default'],
};
