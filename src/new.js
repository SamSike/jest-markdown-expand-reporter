const fs = require('fs')
const path = require('path')
const MDGenerator = require('./mdGenerator')

class MDReporter {
  constructor(globalConfig, reporterOptions) {
    this.globalConfig = globalConfig
    this.options = reporterOptions || {}
    this.filename = this.options.filename || 'test-results.md'
    this.publicPath = this.options.publicPath || './'
    this.detailed = this.options.detailed || []
    this.displayAllTests = this.options.displayAllTests || false
  }

  getOptions() {
    return {
      detailed: this.detailed,
      displayAllTests: this.displayAllTests,
    }
  }

  async onTestResult(test, testResult) {
    // No-op: we aggregate everything in onRunComplete for thread safety
    console.log('test.console', test.console)
  }

  async onRunComplete(contexts, runResults) {
    // Collect per-test console logs using Jest's built-in support
    for (const suite of runResults.testResults) {
      for (const test of suite.testResults) {
        // Attach the console logs array if present
        if (test.console && test.console.length > 0) {
          test.consoleLogs = test.console.map((entry) => `[${entry.type}] ${entry.message}`)
          console.log(`Collected console logs for test: ${test.fullName}: ${test.consoleLogs}`)
        } else {
          test.consoleLogs = []
        }
      }
    }

    // Prepare data for the EJS template
    const data = {
      packageName: this.globalConfig.rootDir ? path.basename(this.globalConfig.rootDir) : 'Project',
      date: new Date(),
      testResults: runResults.testResults,
      ...this.getOptions(),
    }

    // Generate the markdown report using gen.ejs
    try {
      const report = await MDGenerator.generate(data, data.date)
      if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath, { recursive: true })
      const filename = path.join(this.publicPath, this.filename)
      fs.writeFileSync(filename, report)
      // Optionally, output to console
      console.log(`Markdown report generated at: ${filename}`)
    } catch (err) {
      console.error('Markdown report generation failed:', err)
      process.exitCode = 1
    }
  }
}

module.exports = MDReporter
