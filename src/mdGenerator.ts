let ejs: typeof import('ejs') | null = null;
let path: typeof import('path') | null = null;

try {
  ejs = require('ejs');
} catch {}
try {
  path = require('path');
} catch {}

class MDGenerator {
  static async generate(runResults: any, date: Date): Promise<string> {
    if (!ejs || !path) return '';
    const packageName = process.env.npm_package_name;
    try {
      const templatePath = path.join(__dirname, 'reportTemplate.ejs');
      const results = await ejs.renderFile(templatePath, {
        ...runResults,
        date,
        packageName,
      });
      return results as string;
    } catch {
      // Fail silently and gracefully
      return '';
    }
  }
}

export default MDGenerator;
