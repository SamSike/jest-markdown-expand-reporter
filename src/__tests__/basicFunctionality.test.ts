import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const REPORT_DIR = path.join(__dirname, 'tmp-reports');
const REPORT_FILE = path.join(REPORT_DIR, 'test-results.md');
const SAMPLE_FOLDER = path.join(__dirname, 'samples');
const TEST_PASS_FILE = path.join(SAMPLE_FOLDER, 'sample.pass.test.ts');
const TEST_FAIL_FILE = path.join(SAMPLE_FOLDER, 'sample.fail.test.ts');
const TEST_LOG_FILE = path.join(SAMPLE_FOLDER, 'sample.log.test.ts');

function runJest(testFile: string) {
  if (fs.existsSync(REPORT_FILE)) fs.unlinkSync(REPORT_FILE);
  try {
    execSync(
      `yarn jest ${testFile} --reporters=default --reporters=jest-markdown-expand-reporter --reporter-options="filename=test-results.md,publicPath=${REPORT_DIR}" --passWithNoTests --transform='{"^.+\\\\.ts$":"ts-jest"}'`,
      { cwd: __dirname, stdio: 'inherit' },
    );
  } catch {}
}

describe('jest-markdown-expand-reporter: Basic Functionality', () => {
  beforeAll(() => {
    if (!fs.existsSync(REPORT_DIR)) fs.mkdirSync(REPORT_DIR, { recursive: true });
  });

  afterAll(() => {
    fs.rmSync(REPORT_DIR, { recursive: true, force: true });
  });

  it('generates a Markdown report for passing tests', () => {
    runJest(TEST_PASS_FILE);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('jest-markdown-expand-reporter Test Results');
    expect(report).toMatch(/passed/i);
    expect(report).not.toMatch(/failed/i);
  });

  it('generates a Markdown report for failing tests', () => {
    runJest(TEST_FAIL_FILE);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('jest-markdown-expand-reporter Test Results');
    expect(report).toMatch(/failed/i);
    expect(report).toMatch(/Expected:/i);
    expect(report).toMatch(/Received:/i);
  });

  it('includes console logs in the report', () => {
    runJest(TEST_LOG_FILE);
    const report = fs.readFileSync(REPORT_FILE, 'utf-8');
    expect(report).toContain('Console Logs');
    expect(report).toMatch(/console\.log/);
    expect(report).toMatch(/This is a log message/);
  });
});
