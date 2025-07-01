# jest-markdown-expand-reporter

A markdown reporter for Jest tests with expandable sections containing per test console logs

## Configuration

The options are as follows:
| Option | Type | Default | Description | Sample | Values |
| ------------ | --------- | --------------- | ---------------------------------- | ------------------------------------------------------------- | -------------------------------------- |
| filename | string | test-results.md | Name of the markdown output file | | |
| publicPath | string | ./ | Directory for the output file | | |
| displayAll | boolean | false | Show all tests, not just failures | [sample-outputs/displayAll](sample-outputs/displayAll) | |
| failureMessages | boolean | true | Show failure messages in the report| [sample-outputs/failureMessages](sample-outputs/failureMessages) | |
| consoleLogs | string[] | [] | Types of console logs to include | [sample-outputs/allOptions](sample-outputs/allOptions) | "all", "debug", "info", "error", "log", "warn" |
| prioritizeFailures | boolean | false | Display failed tests at the top with jump links | | |
| ciOutput | string[] | []| Output for CI environments (written using file locks, see below) | | Environment Variables to be used as output|
| skipDisplayIfNoFailures | boolean | true | If true, omits the test-by-test section when there are no failures | | |
| enableAnnotations | boolean | false | If true, displays GitHub Actions annotations for each failure (see below) | | |

### File Locking and CI Output

When writing to CI output files (such as those pointed to by environment variables like `GITHUB_STEP_SUMMARY`), this reporter uses file locks to ensure safe, atomic writes. The content is written in the following order:

- **Summary** (latest run)
- **Old Content** (if any)
- **Test-by-Test Details** (latest run)

This prevents race conditions and ensures that CI systems always see a consistent report.

### GitHub Annotations

If `enableAnnotations` is set to `true`, the reporter will emit [GitHub Actions workflow annotations](https://docs.github.com/en/actions/using-workflows/workflow-commands-for-github-actions#setting-an-error-message) for each failed test. These annotations will appear in the "Annotations" or "Summary" tab of your GitHub Actions run, making it easy to spot and navigate to failures directly from the Actions UI.

To install this reporter, it should be as simple as:

```bash
npm i jest-markdown-expand-reporter
```

or

```bash
yarn add jest-markdown-expand-reporter
```

Update jest.config.js or package.json as follows:

```json
 "jest": {
  // To capture console logs in the output
  "setupFilesAfterEnv": ["jest-markdown-expand-reporter/dist/patchConsole.js"],
	"reporters": [
		[
			"jest-markdown-expand-reporter",
			{
				"filename": "test-report.md",
				"publicPath": "./test-reports",
				"displayAllTests": true,
				"consoleLogs": ["all"],
				"ciOutput": ["GITHUB_STEP_SUMMARY"],
				"enableAnnotations": true,
				"skipDisplayIfNoFailures": true
			},
		],
	],
 },
```

## Contribution

Reach out to me for contribution or to request updates :)
