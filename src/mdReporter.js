const fs = require('fs')
const path = require('path')
const os = require('os')
const MDGenerator = require('./mdGenerator')

class MDReporter {
  filename
  publicPath
  detailed = [] // "failure-message", "debug", "error", "info", "log", "warn", "all"
  displayAllTests = false
  intermediateResults = false

  globalConfig
  reporterContext

  constructor(globalConfig, reporterOptions, reporterContext) {
    // Remove old log files
    const oldLogFiles = this.getExistingTempFiles()
    for (const file of oldLogFiles) {
      try {
        fs.unlinkSync(file)
      } catch {}
    }

    this.globalConfig = globalConfig
    const { filename, publicPath, detailed, displayAllTests, intermediateResults } =
      reporterOptions ?? {}
    this.filename = filename ?? 'test-results.md'
    this.publicPath = publicPath ?? './'
    this.detailed = detailed ?? []
    this.displayAllTests = displayAllTests ?? false
    this.intermediateResults = intermediateResults ?? false
    this.reporterContext = reporterContext

    this.startTime = new Date()
    this.successCount = 0
    this.failCount = 0
    this.skipCount = 0
    this.allTestResults = []
  }

  getOptions() {
    return {
      detailed: this.detailed,
      displayAllTests: this.displayAllTests,
    }
  }

  getExistingTempFiles() {
    const tmpDir = os.tmpdir()
    return fs
      .readdirSync(tmpDir)
      .filter((f) => f.startsWith('jest-markdown-expand-logs-') && f.endsWith('.json'))
      .map((f) => path.join(tmpDir, f))
  }

  /**
   * Called after each test suite (test file) completes.
   * Updates counters, accumulates all test results, and rewrites the markdown file
   * to reflect the current state after this suite.
   * This allows the markdown file to be updated incrementally as suites finish.
   */
  async onTestResult(test, testResult, aggregatedResult) {
    // If intermediate results are disabled, skip this step
    if (!this.intermediateResults) return

    // Track test counts
    for (const t of testResult.testResults) {
      if (t.status === 'passed') this.successCount++
      else if (t.status === 'failed') this.failCount++
      else if (t.status === 'pending' || t.status === 'skipped') this.skipCount++
      this.allTestResults.push({
        testFilePath: testResult.testFilePath,
        title: t.fullName,
        status: t.status,
        consoleLogs: t.consoleLogs || [],
        failureMessages: t.failureMessages || [],
        perfStats: testResult.perfStats || {},
        numFailingTests: testResult.numFailingTests || 0,
      })
    }

    // Track suite status
    if (testResult.numFailingTests > 0) {
      this.failedSuiteCount = (this.failedSuiteCount || 0) + 1
    } else if (testResult.numPassingTests === testResult.testResults.length) {
      this.passedSuiteCount = (this.passedSuiteCount || 0) + 1
    } else if (testResult.numPendingTests === testResult.testResults.length) {
      this.pendingSuiteCount = (this.pendingSuiteCount || 0) + 1
    }

    const aggregateRunResults = {
      numTotalTestSuites:
        (this.passedSuiteCount || 0) + (this.failedSuiteCount || 0) + (this.pendingSuiteCount || 0),
      numPassedTestSuites: this.passedSuiteCount || 0,
      numFailedTestSuites: this.failedSuiteCount || 0,
      numPendingTestSuites: this.pendingSuiteCount || 0,
      numPassedTests: this.successCount,
      numFailedTests: this.failCount,
      numPendingTests: this.skipCount,
      numTotalTests: this.allTestResults.length,
      testResults: aggregatedResult.testResults,
      allTestResults: this.allTestResults,
      ...this.getOptions(),
    }

    try {
      const report = await MDGenerator.generate(aggregateRunResults, this.startTime)
      if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath, { recursive: true })
      const filename = `${this.publicPath}/${this.filename}`
      fs.writeFileSync(filename, report)
    } catch (err) {
      console.error('Markdown report generation failed:', err)
      process.exitCode = 1
    }
  }

  /**
   * Called once after all test suites have finished.
   * Cleans up any old log files, merges logs from all workers,
   * attaches logs to test results, and generates the final markdown report
   * using the EJS template via MDGenerator.
   */
  async onRunComplete(textContexts, runResults) {
    // Re-scan for log files created during this run
    const newLogFiles = getExistingTempFiles()

    // Merge logs from all files
    const allLogs = {}
    for (const file of newLogFiles) {
      try {
        const logs = JSON.parse(fs.readFileSync(file, 'utf8'))
        Object.assign(allLogs, logs)
        fs.unlinkSync(file) // Clean up after reading
      } catch {}
    }

    // console.log(`All logs: ${JSON.stringify(allLogs, null, 2)}`)

    // Attach logs to test results
    for (const suite of runResults.testResults) {
      for (const test of suite.testResults) {
        if (allLogs[test.title]) {
          test.consoleLogs = allLogs[test.title]
          // console.log(`Attached logs for test: ${test.title}: ${test.consoleLogs.length} logs`)
        }
      }
    }

    const allResults = {
      ...runResults,
      ...this.getOptions(),
    }

    // console.log(`Merged logs: ${JSON.stringify(allResults, null, 2)}`)

    const report = await MDGenerator.generate(allResults, new Date())
    if (!fs.existsSync(this.publicPath)) fs.mkdirSync(this.publicPath)
    const filename = `${this.publicPath}/${this.filename}`
    if (fs.existsSync(filename)) fs.rmSync(filename)
    fs.writeFileSync(filename, report)
  }
}

module.exports = MDReporter
