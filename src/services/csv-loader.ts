import { parse } from 'csv-parse';

import { paitentsCsv } from './data/patients.csv';
import { clustersCsv } from './data/clusters.csv';

export const loadCSV = <T>(filename: string): Promise<T[]> => {
  return new Promise((resolve, reject) => {
    const fileContent = filename === 'patients.csv' ? paitentsCsv : clustersCsv;

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
