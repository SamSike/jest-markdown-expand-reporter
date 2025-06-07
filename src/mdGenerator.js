const ejs = require('ejs')

class MDGenerator {
  static async generate(runResults, date) {
    const packageName = process.env.npm_package_name

    const results = await ejs.renderFile(`${__dirname}/reportTemplate.ejs`, {
      ...runResults,
      date,
      packageName,
    })

    return results
  }
}

module.exports = MDGenerator
