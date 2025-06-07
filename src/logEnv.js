const fs = require('fs')
const path = require('path')
const os = require('os')

let NodeEnvironment
try {
  NodeEnvironment = require('jest-environment-node').TestEnvironment
  if (!NodeEnvironment) throw new Error()
} catch {
  NodeEnvironment = require('jest-environment-node')
}

class LogEnv extends NodeEnvironment {
  constructor(config, context) {
    super(config, context)
    this._testLogs = {}
    this._currentTest = null
    this._origConsole = {}
    this._logFile = path.join(os.tmpdir(), `jest-logs-${process.pid}.json`)
  }

  async handleTestEvent(event) {
    if (event.name === 'test_start') {
      const testFile = event.test.parent?.file || ''
      const parentName = event.test.parent?.name || ''
      const testKey = `${testFile}::${parentName}::${event.test.name}`
      this._currentTest = testKey
      this._testLogs[this._currentTest] = []
    }
    if (event.name === 'test_done') {
      this._currentTest = null
      fs.writeFileSync(this._logFile, JSON.stringify(this._testLogs, null, 2))
    }
    if (event.name === 'setup') {
      const self = this
      ;['log', 'error', 'warn', 'info'].forEach((method) => {
        self._origConsole[method] = console[method]
        console[method] = function (...args) {
          if (self._currentTest) {
            self._testLogs[self._currentTest].push(`[${method}] ${args.join(' ')}`)
          }
          self._origConsole[method].apply(console, args)
        }
      })
    }
    if (event.name === 'teardown') {
      fs.writeFileSync(this._logFile, JSON.stringify(this._testLogs, null, 2))
      try {
        fs.unlinkSync(this._logFile)
      } catch {}
      ;['log', 'error', 'warn', 'info'].forEach((method) => {
        console[method] = this._origConsole[method]
      })
    }
  }
}

module.exports = LogEnv
