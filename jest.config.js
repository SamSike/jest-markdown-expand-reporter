module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./src/patchConsole.ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  reporters: [
    [
      './dist/mdReporter.js',
      {
        filename: 'test-report.md',
        publicPath: './test-reports',
        displayAllTests: true,
        consoleLogs: ['all'],
      },
    ],
  ],
};
