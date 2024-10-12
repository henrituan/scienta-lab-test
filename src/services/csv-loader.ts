import fs from 'fs';
import path from 'path';
import { parse } from 'csv-parse';

export const loadCSV = <T>(filename: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const filePath = path.join(process.cwd(), 'public/data', filename);
    const fileContent = fs.readFileSync(filePath, { encoding: 'utf-8' });

    parse(
      fileContent,
      {
        columns: true,
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) {
          reject(err);
        } else {
          resolve(records);
        }
      },
    );
  });
};
