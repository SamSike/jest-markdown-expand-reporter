# jest-markdown-expand-reporter

This package outputs test results to a visually appealing markdown file.

## Configuration

The options are as follows:

| Option          | Type    | Default         | Description                         | Sample                                                            |
| --------------- | ------- | --------------- | ----------------------------------- | ----------------------------------------------------------------- |
| filename        | string  | test-results.md | Name of the markdown output file    |                                                                   |
| publicPath      | string  | ./              | Directory for the output file       |                                                                   |
| displayAll      | boolean | false           | Show all tests, not just failures   | ![sample-outputs/displayAll](sample-outputs/displayAll)           |
| failureMessages | boolean | true            | Show failure messages in the report | ![sample-outputs/failureMessages](sample-outputs/failureMessages) |
| consoleLogs     | array   | []              | Types of console logs to include    | ![sample-outputs/allOptions](sample-outputs/allOptions)           |

To install this reporter, it should be as simple as:

```bash
npm i jest-markdown-expand-reporter
```

Update jest.config.js or package.json as follows:
(To capture console logs in the output)

```json
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
			},
		],
	],
 },
```

## Contribution

Reach out to me for contribution or to request updates :)
