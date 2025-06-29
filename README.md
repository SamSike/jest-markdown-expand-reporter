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
| ciOutput | string[] | []| Output for CI environments| | Environment Variables to be used as output|

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
				"ciOutput": ["GITHUB_STEP_SUMMARY"]
			},
		],
	],
 },
```

## Contribution

Reach out to me for contribution or to request updates :)
