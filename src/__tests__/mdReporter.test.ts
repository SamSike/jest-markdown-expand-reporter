import fs from 'fs';
import path from 'path';
import { runCLI } from '@jest/core';

describe('MdReporter integration', () => {
  const reportPath = path.join(process.cwd(), 'test-reports', 'test-report.md');

  beforeEach(() => {
    if (fs.existsSync(reportPath)) {
      fs.unlinkSync(reportPath);
    }
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  it('should generate a markdown report with correct content for pass, fail, and skip', async () => {
    // Run Jest as a subprocess, targeting sample.test.ts
    const previousExitCode = process.exitCode;
    const result = await runCLI(
      {
        runInBand: true,
        passWithNoTests: false,
        testMatch: ['**/src/__tests__/sample.test.ts'],
        testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
        reporters: [
          'default',
          [
            require.resolve('../../dist/mdReporter.js'),
            {
              filename: 'test-report.md',
              publicPath: './test-reports',
              displayAllTests: true,
              consoleLogs: ['all'],
              skipDisplayIfNoFailures: false,
            },
          ],
        ],
        rootDir: process.cwd(),
      } as any,
      [process.cwd()],
    );
    process.exitCode = previousExitCode;

    expect(result.results.success).toBe(false); // There is a failing test
    expect(fs.existsSync(reportPath)).toBe(true);

    const content = fs.readFileSync(reportPath, 'utf8');

    expect(content).toContain('# jest-markdown-expand-reporter Test Summary');
    expect(content).toContain('# jest-markdown-expand-reporter Test Results');
    expect(content).toMatch(/Suites \(\d+\)\|Tests \(\d+\)/); // Table header
    expect(content).toContain('should pass');
    expect(content).toContain('should fail');
    expect(content).toContain('should skip');
    expect(content).toContain('Sample');
    expect(content).toMatch(/badge.*Passed-\d+-green/); // Passed badge
    expect(content).toMatch(/badge.*Failed-\d+-(red|lightgrey)/); // Failed badge
    expect(content).toMatch(/badge.*Pending-\d+-(orange|lightgrey)/); // Skipped badge
    expect(content).toMatch(/<table>/); // Table tag
  });
});
