let fs: typeof import('fs') | null = null;
let path: typeof import('path') | null = null;
let os: typeof import('os') | null = null;
let MDSummaryGenerator: any = null;
let MDTestByTestGenerator: any = null;

try {
  fs = require('fs');
} catch {}
try {
  path = require('path');
} catch {}
try {
  os = require('os');
} catch {}
try {
  MDSummaryGenerator = require('./mdSummaryGenerator').default || require('./mdSummaryGenerator');
  MDTestByTestGenerator =
    require('./mdTestByTestGenerator').default || require('./mdTestByTestGenerator');
} catch {}

import type { AggregatedResult, TestResult, AssertionResult } from '@jest/test-result';
import type { ConsoleBuffer } from '@jest/console';
import type { Config } from '@jest/types';
import { safePrependAppend } from './fileLockUtils';

enum LogOptions {
  // Display console logs in the report
  ALL_LOGS = 'all',
  DEBUG = 'debug',
  ERROR = 'error',
  INFO = 'info',
  LOG = 'log',
  WARN = 'warn',
}

interface ReporterOptions {
  filename?: string;
  publicPath?: string;
  consoleLogs?: LogOptions[];
  displayAllTests?: boolean;
  failureMessages?: boolean;
  ciOutput?: string[];
  prioritizeFailures?: boolean;
  skipDisplayIfNoFailures?: boolean;
  enableAnnotations?: boolean;
}

interface LogSyntax {
  type: LogOptions;
  message: string;
  origin: string;
}

class MDReporter {
  globalConfig: Config.GlobalConfig;
  options: ReporterOptions;
  startTime: Date;

  filename: string;
  publicPath: string;
  ciOutput: string[];
  consoleLogs: string[];
  displayAllTests: boolean;
  failureMessages: boolean;
  prioritizeFailures: boolean;
  skipDisplayIfNoFailures: boolean;
  enableAnnotations: boolean;

  logs: Record<string, ConsoleBuffer> = {};

  constructor(globalConfig: Config.GlobalConfig, reporterOptions?: ReporterOptions) {
    this.globalConfig = globalConfig;
    this.options = reporterOptions ?? {};
    this.filename = this.options.filename ?? 'test-results.md';
    this.publicPath = this.options.publicPath ?? './';
    this.ciOutput = this.options.ciOutput ?? [];
    this.consoleLogs = this.options.consoleLogs ?? [];
    this.displayAllTests = this.options.displayAllTests ?? false;
    this.failureMessages = this.options.failureMessages ?? true;
    this.prioritizeFailures = this.options.prioritizeFailures ?? false;
    this.skipDisplayIfNoFailures = this.options.skipDisplayIfNoFailures ?? true;
    this.enableAnnotations =
      this.options.enableAnnotations ?? 'GITHUB_STEP_SUMMARY' in this.ciOutput;
    this.startTime = new Date();
    this.logs = {};
  }

  getOptions() {
    return {
      consoleLogs: this.consoleLogs,
      displayAllTests: this.displayAllTests,
      failureMessages: this.failureMessages,
      prioritizeFailures: this.prioritizeFailures,
      skipDisplayIfNoFailures: this.skipDisplayIfNoFailures,
      enableAnnotations: this.enableAnnotations,
    };
  }

  async onTestResult(test: any, testResult: TestResult) {
    if (!path) return;

    const suitePath = test.path ?? test.testFilePath ?? 'unknown-suite';
    const suiteName = path.basename(suitePath, path.extname(suitePath));
    const testKey = `${suiteName}::${test.fullName ?? test.title}`;
    this.logs[testKey] = testResult.console ?? [];
  }

  async onRunComplete(contexts: Set<unknown>, runResults: AggregatedResult) {
    if (!fs || !path || !os || !MDSummaryGenerator) return false;

    const tmpDir = os.tmpdir();
    const enabledLogTypes = (this.consoleLogs ?? []).map((type) => type.toLowerCase());

    // For each test suite, read its corresponding log file
    for (const suite of runResults.testResults as TestResult[]) {
      const suiteFile = suite.testFilePath
        ? path.basename(suite.testFilePath, path.extname(suite.testFilePath))
        : 'unknown-suite';
      const logFile = path.join(tmpDir, `jest-md-logs-${suiteFile}.json`);
      let suiteLogs: Record<string, LogSyntax[]> = {};
      if (fs.existsSync(logFile)) {
        try {
          suiteLogs = JSON.parse(fs.readFileSync(logFile, 'utf-8'));
        } catch (e) {
          process.stderr.write(`Could not parse log file ${logFile}: ${e}\n`);
        }
      }

      // Attach logs to each test in the suite, filtering by enabled log types
      for (const test of suite.testResults as AssertionResult[]) {
        const testName = test.fullName ?? test.title;
        let logs = suiteLogs[testName] ?? [];

        // Only include logs if enabled in options
        if (
          enabledLogTypes.includes('all') ||
          enabledLogTypes.some((type) =>
            logs.some((log) => (log.type ?? '').toLowerCase() === type),
          )
        ) {
          // If not 'all', filter logs by enabled types
          if (!enabledLogTypes.includes('all')) {
            logs = logs.filter((log) =>
              enabledLogTypes.some((type) => (log.type ?? '').toLowerCase() === type),
            );
          }
          (test as any).consoleLogs = logs;
        } else {
          (test as any).consoleLogs = [];
        }

        // Output GitHub Actions annotations for each failed test if enabled
        if (this.enableAnnotations && process.env.GITHUB_STEP_SUMMARY) {
          if (test.status === 'failed' && test.failureMessages && test.failureMessages.length > 0) {
            // Try to extract line/column from failure stack, fallback to suiteFile
            let file = suiteFile;
            let line = 1;
            let col = 1;
            const stack = test.failureMessages.join('\n');
            const match =
              stack.match(/at .*\((.*):(\d+):(\d+)\)/) || stack.match(/at (.*):(\d+):(\d+)/);
            if (match) {
              file = match[1] || suiteFile;
              line = parseInt(match[2] || '1', 10);
              col = parseInt(match[3] || '1', 10);
            }
            // Output GitHub Actions error annotation
            process.stdout.write(
              `::error file=${file},line=${line},col=${col}::${test.fullName || test.title}\n`,
            );
          }
        }
      }
    }

    // Prepare data for the EJS template
    const data = {
      packageName: this.globalConfig.rootDir ? path.basename(this.globalConfig.rootDir) : 'Project',
      date: this.startTime,
      testResults: runResults.testResults,
      ...this.getOptions(),
      // Add these summary fields:
      numPassedTestSuites: runResults.numPassedTestSuites,
      numFailedTestSuites: runResults.numFailedTestSuites,
      numPendingTestSuites: runResults.numPendingTestSuites,
      numTotalTestSuites: runResults.numTotalTestSuites,
      numPassedTests: runResults.numPassedTests,
      numFailedTests: runResults.numFailedTests,
      numPendingTests: runResults.numPendingTests,
      numTotalTests: runResults.numTotalTests,
    };

    try {
      const summaryReport = await (MDSummaryGenerator as any).generate(data, data.date);
      const testByTestReport = await (MDTestByTestGenerator as any).generate(data, data.date);
      if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath, { recursive: true });
      const filename = path.join(this.publicPath, this.filename);
      fs.writeFileSync(filename, summaryReport + testByTestReport, 'utf8');

      // If CI output is specified, write the report to each specified environment variable
      if (this.ciOutput.length > 0) {
        for (const envVar of this.ciOutput) {
          const envPath = process.env[envVar];
          if (envPath) {
            await safePrependAppend(envPath, summaryReport, testByTestReport, 'utf8');
          } else {
            process.stderr.write(`Environment variable ${envVar} is not set.\n`);
          }
        }
      }
    } catch (err) {
      process.stderr.write(`Markdown report generation failed: ${JSON.stringify(err, null, 2)}\n`);
      process.exitCode = 1;
    }
  }
}

export default MDReporter;
