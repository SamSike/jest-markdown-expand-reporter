import util from 'util';

const logs: Record<string, { type: string; message: string; origin: string }[]> = {};
const origConsole: Partial<typeof console> = {};
const methods = ['log', 'error', 'warn', 'info', 'debug'] as const;
const JEST_CONSOLE_STACK_LINES = parseInt(process.env.JEST_CONSOLE_STACK_LINES || '1', 10);

beforeEach(() => {
  const testName = expect.getState().currentTestName || 'unknown';
  logs[testName] = [];
  methods.forEach((method) => {
    origConsole[method] = console[method];
    console[method] = (...args: any[]) => {
      // Capture origin (file:line)
      const MIN = 2;
      const MAX = JEST_CONSOLE_STACK_LINES >= 0 ? 2 + JEST_CONSOLE_STACK_LINES : 3;
      const stackLines =
        new Error().stack
          ?.split('\n')
          .slice(MIN, MAX)
          .map((line) => line.trim())
          .join('\n') || '';
      logs[testName].push({
        type: method,
        message: util.format(...args),
        origin: stackLines,
      });
      origConsole[method]?.apply(console, args);
    };
  });
});

afterEach(() => {
  methods.forEach((method) => {
    if (origConsole[method]) {
      console[method] = origConsole[method]!;
    }
  });
});

afterAll(() => {
  const fs = require('fs');
  const os = require('os');
  const path = require('path');
  const state = expect.getState();
  const suitePath = state.testPath || 'unknown-suite';
  const suiteName = path.basename(suitePath, path.extname(suitePath));
  const tmpLogFile = path.join(os.tmpdir(), `jest-md-logs-${suiteName}.json`);
  fs.writeFileSync(tmpLogFile, JSON.stringify(logs, null, 2));
});
