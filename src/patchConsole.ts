let utilSafe: typeof import('util') | null = null;
try {
  utilSafe = require('util');
} catch {
  utilSafe = null;
}

const logs: Record<string, { type: string; message: string; origin: string }[]> = {};
const origConsole: Partial<typeof console> = {};
const methods = ['log', 'error', 'warn', 'info', 'debug'] as const;
const JEST_CONSOLE_STACK_LINES = parseInt(process.env.JEST_CONSOLE_STACK_LINES ?? '1', 10);

beforeEach(() => {
  try {
    const jestExpect = (global as any).expect;
    const testName = jestExpect.getState().currentTestName ?? 'unknown';
    logs[testName] = [];
    methods.forEach((method) => {
      origConsole[method] = console[method];
      try {
        console[method] = (...args: any[]) => {
          // Capture origin (file:line)
          const MIN = 2;
          const MAX = JEST_CONSOLE_STACK_LINES >= 0 ? 2 + JEST_CONSOLE_STACK_LINES : 3;
          const stackLines =
            new Error().stack
              ?.split('\n')
              .slice(MIN, MAX)
              .map((line) => line.trim())
              .join('\n') ?? '';
          logs[testName].push({
            type: method,
            message: utilSafe ? utilSafe.format(...args) : args.map(String).join(' '),
            origin: stackLines,
          });
          args.push(`\n  \x1b[90m${stackLines}\x1b[0m`);
          origConsole[method]?.apply(console, args);
        };
      } catch {
        // In case patching console fails, we still want to log the message
        console[method] = origConsole[method];
      }
    });
  } catch {}
});

afterEach(() => {
  try {
    methods.forEach((method) => {
      if (origConsole[method]) {
        console[method] = origConsole[method]!;
      }
    });
  } catch {}
});

afterAll(() => {
  try {
    let fs: typeof import('fs') | null = null;
    let os: typeof import('os') | null = null;
    let path: typeof import('path') | null = null;
    try {
      fs = require('fs');
      os = require('os');
      path = require('path');
    } catch {}
    if (fs && os && path) {
      const jestExpect = (global as any).expect;
      const state = jestExpect?.getState?.() ?? {};
      const suitePath = state.testPath ?? 'unknown-suite';
      const suiteName = path.basename(suitePath, path.extname(suitePath));
      const tmpLogFile = path.join(os.tmpdir(), `jest-md-logs-${suiteName}.json`);
      try {
        fs.writeFileSync(tmpLogFile, JSON.stringify(logs, null, 2));
      } catch {}
    }
  } catch {}
});
