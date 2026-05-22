# jest-markdown-expand-reporter

A markdown reporter for Jest that generates readable, expandable test reports for local development and CI.

It is designed to help you quickly answer three questions after a test run:

- What failed?
- Where did it fail?
- What logs and failure details do I need to debug it fast?

## What This Package Does

`jest-markdown-expand-reporter` plugs into Jest's reporter system and produces markdown output with:

- A concise summary section first (suite and test counts by status)
- Detailed per-test sections with expandable content
- Failure-first views with jump links
- Optional grouped console logs by test
- Optional GitHub Actions summary and annotations integration

## Features

- Works with Jest in both local and CI workflows
- Generates markdown report files you can archive or publish
- Supports overview + detailed sections in one report
- Can show all tests or only failing tests
- Captures and displays failure messages in expandable blocks
- Captures and groups console logs by suite/test
- Prioritizes failed tests and includes jump anchors/links for quick navigation
- Writes to CI output files such as `GITHUB_STEP_SUMMARY`
- Uses file locking for safe CI writes when multiple runs append/prepend content
- Emits GitHub Actions failure annotations (file/line/column when detectable)

## Install

```bash
npm i jest-markdown-expand-reporter
```

or

```bash
yarn add jest-markdown-expand-reporter
```

## Quick Start

Add reporter setup in your Jest config:

```json
{
  "jest": {
    "setupFilesAfterEnv": ["jest-markdown-expand-reporter/dist/patchConsole.js"],
    "reporters": [
      [
        "jest-markdown-expand-reporter",
        {
          "filename": "test-report.md",
          "publicPath": "./test-reports",
          "displayAllTests": true,
          "consoleLogs": ["all"],
          "prioritizeFailures": true,
          "ciOutput": ["GITHUB_STEP_SUMMARY"],
          "enableAnnotations": true,
          "skipDisplayIfNoFailures": true
        }
      ]
    ]
  }
}
```

## Configuration

The options are as follows:

| Option | Type | Default | Description | Sample | Values |
| ------------ | --------- | --------------- | ---------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| filename | string | test-results.md | Name of the markdown output file | | |
| publicPath | string | ./ | Directory for the output file | | |
| displayAllTests | boolean | false | Show all tests, not just failures | [sample-outputs/displayAll.md](sample-outputs/displayAll.md) | |
| failureMessages | boolean | true | Show failure messages in the report | [sample-outputs/failureMessages.md](sample-outputs/failureMessages.md) | |
| consoleLogs | string[] | [] | Types of console logs to include | [sample-outputs/allOptions.md](sample-outputs/allOptions.md) | "all", "debug", "info", "error", "log", "warn" |
| prioritizeFailures | boolean | false | Display failed tests at the top with jump links | | |
| ciOutput | string[] | [] | Output for CI environments (written using file locks, see below) | | Environment variable names |
| skipDisplayIfNoFailures | boolean | true | If true, omits the test-by-test section when there are no failures | | |
| enableAnnotations | boolean | false | If true, displays GitHub Actions annotations for each failure (see below) | | |

Sample outputs:

- [sample-outputs/noOptions.md](sample-outputs/noOptions.md)
- [sample-outputs/displayAll.md](sample-outputs/displayAll.md)
- [sample-outputs/failureMessages.md](sample-outputs/failureMessages.md)
- [sample-outputs/allOptions.md](sample-outputs/allOptions.md)

### File Locking and CI Output

When writing to CI output files (such as those pointed to by environment variables like `GITHUB_STEP_SUMMARY`), this reporter uses file locks to ensure safe, atomic writes. The content is written in the following order:

- **Summary** (latest run)
- **Old Content** (if any)
- **Test-by-Test Details** (latest run)

This prevents race conditions and ensures that CI systems always see a consistent report.

### GitHub Annotations

If `enableAnnotations` is set to `true`, the reporter will emit [GitHub Actions workflow annotations](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message) for each failed test. These annotations will appear in the "Annotations" or "Summary" tab of your GitHub Actions run, making it easy to spot and navigate to failures directly from the Actions UI.

## Contribution

### Real-World Demo (dataloader)

This repository includes a real-world Jest project under [demo/dataloader-demo](demo/dataloader-demo) to demonstrate reporter behavior on an external codebase.

Run the demo end to end from the repo root:

```bash
yarn demo:dataloader:setup
yarn demo:dataloader:run
```

The generated markdown report is written to [demo/dataloader-demo/test-results.md](demo/dataloader-demo/test-results.md).


### Regenerate Sample Outputs

Use the repeatable command below to regenerate files in `sample-outputs` from real Jest runs for each supported reporter configuration:

```bash
yarn sample-outputs:update
```

This command runs a build first and then executes the generation script.

---

## Project Plan and Policies

The canonical project plan, requirements, and workflow agreements are always stored in the repo root as [PLAN.md](./PLAN.md). This file is updated whenever requirements, automation, or workflow rules change.

**Key policies:**

- CI runner policy (ubuntu-slim, no cost-based runner changes)
- Sample outputs must be generated from real Jest runs and updated on version bumps
- Build and test gates before commit/push
- Agent instructions in [AGENTS.md](./AGENTS.md) (canonical) and [CLAUDE.md](./CLAUDE.md)
- All plans and workflow agreements are documented in [PLAN.md](./PLAN.md)

See [PLAN.md](./PLAN.md) for the full, up-to-date plan.
