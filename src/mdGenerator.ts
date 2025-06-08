import ejs from 'ejs';
import path from 'path';

class MDGenerator {
  static async generate(runResults: any, date: Date): Promise<string> {
    const packageName = process.env.npm_package_name;

    const templatePath = path.join(__dirname, 'reportTemplate.ejs');
    const results = await ejs.renderFile(templatePath, {
      ...runResults,
      date,
      packageName,
    });

    return results as string;
  }
}

export default MDGenerator;
