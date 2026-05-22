import fs from 'fs';
import path from 'path';
import { runCLI } from '@jest/core';

const REPORT_DIR = path.join(__dirname, 'tmp-reports');
const REPORT_FILE = path.join(REPORT_DIR, 'test-results.md');
const SAMPLE_FOLDER = path.join(__dirname, 'samples');
const TEST_PASS_FILE = path.join(SAMPLE_FOLDER, 'sample.pass.test.ts');
const TEST_FAIL_FILE = path.join(SAMPLE_FOLDER, 'sample.fail.test.ts');
const TEST_LOG_FILE = path.join(SAMPLE_FOLDER, 'sample.log.test.ts');
const REPORTER_PATH = path.join(process.cwd(), 'dist', 'mdReporter.js');

async function runJest(testFile: string) {
  if (fs.existsSync(REPORT_FILE)) fs.unlinkSync(REPORT_FILE);
  const relativeTestPath = path.relative(process.cwd(), testFile).split(path.sep).join('/');
  const previousExitCode = process.exitCode;

  const result = await runCLI(
    {
      runInBand: true,
      passWithNoTests: true,
      rootDir: process.cwd(),
      testMatch: [`**/${relativeTestPath}`],
      testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
      reporters: [
        'default',
        [
          REPORTER_PATH,
          {
            filename: path.basename(REPORT_FILE),
            publicPath: REPORT_DIR,
            displayAllTests: true,
            consoleLogs: ['all'],
            skipDisplayIfNoFailures: false,
          },
        ],
      ],
    } as any,
    [process.cwd()],
  );

  process.exitCode = previousExitCode;
  return result;
}

describe('jest-markdown-expand-reporter: Basic Functionality', () => {
  beforeAll(() => {
    if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  });

  afterEach(() => {
    process.exitCode = 0;
  });

  afterAll(() => {
    fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  });

  it('generates a Markdown report for passing tests', async () => {
    const result = await runJest(TEST_PASS_FILE);
    expect(result.results.success).toBe(true);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('jest-markdown-expand-reporter Test Results');
    expect(report).toMatch(/passed/i);
    expect(report).toMatch(/Failed-0/i);
  });

  it('generates a Markdown report for failing tests', async () => {
    const result = await runJest(TEST_FAIL_FILE);
    expect(result.results.success).toBe(false);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('jest-markdown-expand-reporter Test Results');
    expect(report).toMatch(/failed/i);
    expect(report).toMatch(/Expected:/i);
    expect(report).toMatch(/Received:/i);
  });

  it('includes console logs in the report', async () => {
    const result = await runJest(TEST_LOG_FILE);
    expect(result.results.success).toBe(true);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('Console Logs');
    expect(report).toMatch(/console\.log/);
    expect(report).toMatch(/This is a log message/);
  });
});
