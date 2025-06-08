module.exports = {
  preset: 'ts-jest',
  testEnvironment: './dist/logEnv.js',
  testEnvironmentOptions: {
    console: 'inherit',
  },
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  reporters: [
    'default',
    [
      './dist/new.js',
      {
        filename: 'test-report.md',
        publicPath: './test-reports',
        displayAllTests: true,
        detailed: ['failure-message', 'all'],
      },
    ],
  ],
  verbose: false,
};
