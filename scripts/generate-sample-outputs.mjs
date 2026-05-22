import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCLI } from '@jest/core';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const tempOutputDir = path.join(rootDir, 'test-reports', '.sample-output-tmp');
const sampleOutputDir = path.join(rootDir, 'sample-outputs');
const reportFilename = 'sample-output.md';
const reportPath = path.join(tempOutputDir, reportFilename);
const reporterPath = path.join(rootDir, 'dist', 'mdReporter.js');

const scenarios = [
  {
    file: 'noOptions.md',
    options: {
      filename: reportFilename,
      publicPath: tempOutputDir,
    },
  },
  {
    file: 'displayAll.md',
    options: {
      filename: reportFilename,
      publicPath: tempOutputDir,
      displayAllTests: true,
    },
  },
  {
    file: 'failureMessages.md',
    options: {
      filename: reportFilename,
      publicPath: tempOutputDir,
      displayAllTests: true,
      failureMessages: true,
    },
  },
  {
    file: 'allOptions.md',
    options: {
      filename: reportFilename,
      publicPath: tempOutputDir,
      displayAllTests: true,
      failureMessages: true,
      consoleLogs: ['all'],
      prioritizeFailures: true,
      skipDisplayIfNoFailures: false,
    },
  },
];

function normalizeOutput(raw) {
  return raw
    .replace(/^> \*\*Started\*\*: .*$/gm, '> **Started**: <generated>')
    .replace(/\b\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z\b/g, '<timestamp>')
    .replace(/>\d+\.\d+</g, '><duration><')
    .replace(new RegExp(rootDir.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), '<workspace>')
    .replace(/\r\n/g, '\n');
}

async function generateScenario(scenario) {
  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }

  const previousExitCode = process.exitCode;
  await runCLI(
    {
      runInBand: true,
      passWithNoTests: false,
      rootDir,
      testMatch: ['**/src/__tests__/sample.test.ts'],
      testPathIgnorePatterns: ['/node_modules/', '/dist/', '/coverage/'],
      reporters: ['default', [reporterPath, scenario.options]],
    },
    [rootDir],
  );
  process.exitCode = previousExitCode ?? 0;

  if (!fs.existsSync(reportPath)) {
    throw new Error(`Expected report file was not generated for ${scenario.file}`);
  }

  const output = fs.readFileSync(reportPath, 'utf8');
  fs.writeFileSync(path.join(sampleOutputDir, scenario.file), normalizeOutput(output), 'utf8');
}

async function run() {
  fs.mkdirSync(tempOutputDir, { recursive: true });
  fs.mkdirSync(sampleOutputDir, { recursive: true });

  for (const scenario of scenarios) {
    // eslint-disable-next-line no-await-in-loop
    await generateScenario(scenario);
  }

  if (fs.existsSync(reportPath)) {
    fs.unlinkSync(reportPath);
  }
}

run().catch((error) => {
  process.stderr.write(`${error.stack || error}\n`);
  process.exit(1);
});
