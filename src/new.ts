import fs from 'fs';
import path from 'path';
import os from 'os';
import MDGenerator from './mdGenerator';
import type { AggregatedResult, TestResult, AssertionResult } from '@jest/test-result';
import type { ConsoleBuffer } from '@jest/console';
import type { Config } from '@jest/types';

enum LogOptions {
  // Display failure messages in the report
  FAILURE_MESSAGE = 'failureMessage',
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
  detailed?: LogOptions[];
  displayAllTests?: boolean;
}

class MDReporter {
  globalConfig: Config.GlobalConfig;
  options: ReporterOptions;

  filename: string;
  publicPath: string;
  detailed: string[];
  displayAllTests: boolean = false;

  logs: Record<string, ConsoleBuffer> = {};

  constructor(globalConfig: Config.GlobalConfig, reporterOptions?: ReporterOptions) {
    this.globalConfig = globalConfig;
    this.options = reporterOptions || {};
    this.filename = this.options.filename || 'test-results.md';
    this.publicPath = this.options.publicPath || './';
    this.detailed = this.options.detailed || [];
    this.displayAllTests = this.options.displayAllTests || false;
    this.logs = {};
  }

  getOptions() {
    return {
      detailed: this.detailed,
      displayAllTests: this.displayAllTests,
    };
  }

  async onTestResult(test: any, testResult: TestResult) {
    this.logs[test.fullName || test.title] = testResult.console || [];
  }

  async onRunComplete(contexts: Set<unknown>, runResults: AggregatedResult) {
    // Merge all log files from all workers
    const tmpDir = os.tmpdir();
    const logFiles = fs
      .readdirSync(tmpDir)
      .filter((f) => f.startsWith('jest-md-logs-') && f.endsWith('.json'));
    let allLogs: Record<string, { logs: string[]; testFilePath: string; testName: string }> = {};

    for (const file of logFiles) {
      try {
        const fileLogs = JSON.parse(fs.readFileSync(path.join(tmpDir, file), 'utf-8'));
        allLogs = { ...allLogs, ...fileLogs };
      } catch (e) {
        process.stderr.write(`Could not parse log file ${file}: ${e}\n`);
      }
    }

    // Attach logs to each test result
    for (const suite of runResults.testResults as TestResult[]) {
      for (const test of suite.testResults as AssertionResult[]) {
        const logEntry = Object.values(allLogs).find(
          (entry) =>
            entry.testFilePath === suite.testFilePath &&
            entry.testName === (test.fullName || test.title),
        );
        (test as any).consoleLogs = logEntry || {
          logs: [],
          testFilePath: suite.testFilePath,
          testName: test.fullName || test.title,
        };
      }
    }

    // Prepare data for the EJS template
    const data = {
      packageName: this.globalConfig.rootDir ? path.basename(this.globalConfig.rootDir) : 'Project',
      date: new Date(),
      testResults: runResults.testResults,
      ...this.getOptions(),
    };

    // Generate the markdown report using gen.ejs
    try {
      const report = await (MDGenerator as any).generate(data, data.date);
      if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath, { recursive: true });
      const filename = path.join(this.publicPath, this.filename);
      fs.writeFileSync(filename, report);
      process.stdout.write(`Markdown report generated at: ${filename}\n`);
    } catch (err) {
      process.stderr.write(`Markdown report generation failed: ${JSON.stringify(err, null, 2)}\n`);
      process.exitCode = 1;
    }
  }
}

export default MDReporter;
