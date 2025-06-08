import fs from 'fs';
import path from 'path';
import os from 'os';
import MDGenerator from './mdGenerator';
import type { AggregatedResult, TestResult, AssertionResult } from '@jest/test-result';
import type { ConsoleBuffer } from '@jest/console';
import type { Config } from '@jest/types';

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
  consoleLogs: string[];
  displayAllTests: boolean = false;
  failureMessages: boolean = true;

  logs: Record<string, ConsoleBuffer> = {};

  constructor(globalConfig: Config.GlobalConfig, reporterOptions?: ReporterOptions) {
    this.globalConfig = globalConfig;
    this.options = reporterOptions || {};
    this.filename = this.options.filename || 'test-results.md';
    this.publicPath = this.options.publicPath || './';
    this.consoleLogs = this.options.consoleLogs || [];
    this.displayAllTests = this.options.displayAllTests || false;
    this.failureMessages = this.options.failureMessages || true;
    this.startTime = new Date();
    this.logs = {};
  }

  getOptions() {
    return {
      consoleLogs: this.consoleLogs,
      displayAllTests: this.displayAllTests,
      failureMessages: this.failureMessages,
    };
  }

  async onTestResult(test: any, testResult: TestResult) {
    this.logs[test.fullName || test.title] = testResult.console || [];
  }

  async onRunComplete(contexts: Set<unknown>, runResults: AggregatedResult) {
    const tmpDir = os.tmpdir();
    const enabledLogTypes = (this.consoleLogs || []).map((type) => type.toLowerCase());

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
        const testName = test.fullName || test.title;
        let logs = suiteLogs[testName] || [];

        // Only include logs if enabled in options
        if (
          enabledLogTypes.includes('all') ||
          enabledLogTypes.some((type) =>
            logs.some((log) => (log.type || '').toLowerCase() === type),
          )
        ) {
          // If not 'all', filter logs by enabled types
          if (!enabledLogTypes.includes('all')) {
            logs = logs.filter((log) =>
              enabledLogTypes.some((type) => (log.type || '').toLowerCase() === type),
            );
          }
          (test as any).consoleLogs = logs;
        } else {
          (test as any).consoleLogs = [];
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

    // Generate the markdown report using gen.ejs
    try {
      // fs.writeFileSync('output.json', JSON.stringify(data, null, 2));
      const report = await (MDGenerator as any).generate(data, data.date);
      if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath, { recursive: true });
      const filename = path.join(this.publicPath, this.filename);
      fs.writeFileSync(filename, report);
      // process.stdout.write(`Markdown report generated at: ${filename}\n`);
    } catch (err) {
      process.stderr.write(`Markdown report generation failed: ${JSON.stringify(err, null, 2)}\n`);
      process.exitCode = 1;
    }
  }
}

export default MDReporter;
