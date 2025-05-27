const fs = require("fs");
const MDGenerator = require("./mdGenerator");

class MDReporter {
	filename;
	publicPath;

	constructor(_, options) {
		const { filename, publicPath } = options ?? {};

		this.filename = filename ?? "test-results.md";
		this.publicPath = publicPath ?? "./";
	}

	async onRunComplete(_, runResults) {
		const report = await MDGenerator.generate(runResults, new Date());

		if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath);
		const filename = `${this.publicPath}/${this.filename}`;

		if (fs.existsSync(filename)) fs.rmSync(filename);
		fs.writeFileSync(filename, report);
	}
}

module.exports = MDReporter;
