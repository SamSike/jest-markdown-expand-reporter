import NodeEnvironment from 'jest-environment-node';
import fs from 'fs';
import os from 'os';
import path from 'path';

type TestLogs = Record<string, { logs: string[]; testFilePath: string; testName: string }>;

const consoleMethods = ['debug', 'error', 'info', 'log', 'warn'] as const;
type ConsoleMethod = (typeof consoleMethods)[number];

class LogEnv extends NodeEnvironment {
  private _testLogs: TestLogs = {};
  private _currentTest: string | null = null;
  private _origConsole: Partial<typeof console> = {};
  private _tmpLogFile: string;
  private _logsWritten = false;

  constructor(config: any, context: any) {
    super(config, context);
    this._tmpLogFile = path.join(os.tmpdir(), `jest-md-logs-${process.pid}.json`);
    this.enableConsoleCapture();
  }

  enableConsoleCapture() {
    consoleMethods.forEach((method: ConsoleMethod) => {
      this._origConsole[method] = console[method];
      (console as any)[method] = (...args: any[]) => {
        process.stdout.write(`[DEBUG] Patched console.${method}\n`);
        if (this._currentTest) {
          if (!this._testLogs[this._currentTest]) return;
          this._testLogs[this._currentTest].logs.push(`[${method}] ${args.join(' ')}`);
        }
        const orig = this._origConsole[method];
        if (typeof orig === 'function') {
          orig.apply(console, args);
        }
      };
    });
  }

  private writeLogsOnce() {
    if (!this._logsWritten) {
      fs.writeFileSync(this._tmpLogFile, JSON.stringify(this._testLogs, null, 2));
      this._logsWritten = true;
    }
    process.stdout.write(`Logs until now: ${JSON.stringify(this._testLogs, null, 2)}\n`);
  }

  async handleTestEvent(event: any) {
    if (event.name === 'test_start') {
      const testFile = event.test.parent?.file || '';
      const parentName = event.test.parent?.name || '';
      const testName = event.test.fullName || event.test.name;
      const testKey = `${testFile}::${parentName}::${testName}`;
      this._currentTest = testKey;
      this._testLogs[this._currentTest] = {
        logs: [],
        testFilePath: testFile,
        testName,
      };
    }
    if (event.name === 'test_done') {
      this._currentTest = null;
    }
    if (event.name === 'teardown') {
      this.writeLogsOnce();
      consoleMethods.forEach((method: ConsoleMethod) => {
        const orig = this._origConsole[method];
        if (orig) {
          (console as any)[method] = orig;
        }
      });
    }
  }
}

export default LogEnv;
