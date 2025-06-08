import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

class MDGenerator {
  static async generate(runResults: any, date: Date): Promise<string> {
    const packageName = process.env.npm_package_name;
    try {
      const templatePath = path.join(__dirname, 'reportTemplate.ejs');
      const results = await ejs.renderFile(templatePath, {
        ...runResults,
        date,
        packageName,
      });
      return results as string;
    } catch (error) {
      process.stderr.write(`Error generating markdown report: ${error}\n`);
      throw error;
    }
  }
}

export default MDGenerator;
