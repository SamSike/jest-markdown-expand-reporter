module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: ['./dist/patchConsole.js'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/',
    '/coverage/',
    '/src/__tests__/samples/',
    '/src/__tests__/sample\\.test\\.ts$',
  ],
  reporters: [
    [
      './dist/mdReporter.js',
      {
        filename: 'test-report.md',
        publicPath: './test-reports',
        displayAllTests: true,
        consoleLogs: ['all'],
        prioritizeFailures: true,
        ciOutput: ['GITHUB_STEP_SUMMARY'],
        enableAnnotations: true,
      },
    ],
  ],
};
