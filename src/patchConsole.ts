const logs: Record<string, { type: string; message: string; origin: string }[]> = {};
const origConsole: Partial<typeof console> = {};
const methods = ['log', 'error', 'warn', 'info', 'debug'] as const;

beforeEach(() => {
  const testName = expect.getState().currentTestName || 'unknown';
  logs[testName] = [];
  methods.forEach((method) => {
    origConsole[method] = console[method];
    console[method] = (...args: any[]) => {
      // Capture origin (file:line)
      const stackLines =
        new Error().stack
          ?.split('\n')
          .slice(2, 5)
          .map((line) => line.trim())
          .join('\n') || '';
      logs[testName].push({
        type: method,
        message: args.join(' '),
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
  // process.stdout.write(
  //   `[DEBUG] Writing logs to temporary file for suite: ${suiteName}\n${JSON.stringify(logs, null, 2)}\n`,
  // );
  const tmpLogFile = path.join(os.tmpdir(), `jest-md-logs-${suiteName}.json`);
  fs.writeFileSync(tmpLogFile, JSON.stringify(logs, null, 2));
});
