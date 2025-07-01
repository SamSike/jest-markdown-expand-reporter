import * as fs from 'fs';
import * as lockfile from 'proper-lockfile';

export async function safePrependAppend(
  filename: string,
  prepend: string = '',
  append: string = '',
  options?: fs.WriteFileOptions,
) {
  let release: (() => Promise<void>) | undefined;
  try {
    // Acquire a lock on the file (creates file if it doesn't exist)
    release = await lockfile.lock(filename, { retries: 3 });

    let oldContent = fs.existsSync(filename) ? fs.readFileSync(filename, 'utf8') : '';

    fs.writeFileSync(filename, prepend + oldContent + append, options);
  } finally {
    if (release) await release();
  }
}
