const fs = require("fs");
const path = require("path");
const { runCLI } = require("jest");

describe("MdReporter integration", () => {
	const reportPath = path.join(
		process.cwd(),
		"test-reports",
		"test-report.md"
	);

	beforeEach(() => {
		if (fs.existsSync(reportPath)) {
			fs.unlinkSync(reportPath);
		}
	});

	it("should generate a markdown report with correct content for pass, fail, and skip", async () => {
		const result = await runCLI(
			{
				runInBand: true,
				testMatch: ["**/src/__tests__/sample.test.js"],
				reporters: [
					"default",
					[
						"./src/mdReporter.js",
						{
							filename: "test-report.md",
							publicPath: "./test-reports",
						},
					],
				],
			},
			[process.cwd()]
		);

		expect(result.results.success).toBe(false); // There is a failing test
		expect(fs.existsSync(reportPath)).toBe(true);

		const content = fs.readFileSync(reportPath, "utf8");
		expect(content).toContain(
			"# jest-markdown-expandable-reporter Test Results"
		);
		expect(content).toMatch(/Suites \(\d+\)\|Tests \(\d+\)/); // Table header
		expect(content).toContain("should pass");
		expect(content).toContain("should fail");
		expect(content).toContain("should skip");
		expect(content).toContain("Sample");
		expect(content).toMatch(/badge.*Passed-\d+-green/); // Passed badge
		expect(content).toMatch(/badge.*Failed-\d+-(red|lightgrey)/); // Failed badge
		expect(content).toMatch(/badge.*Pending-\d+-lightgrey/); // Skipped badge
		expect(content).toMatch(/<table>/); // Table tag
	});
});
