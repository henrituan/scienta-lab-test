import { Cluster, ClusterRawData } from '@/types/cluster';

import { loadCSV } from './csv-loader';

const getSymptoms = (rawStr: string): string[] => {
  // Remove outer parentheses
  const content = rawStr.slice(1, -1);

  // Match 1 item between quotes
  const regex = /'([^']*)'(?:,\s*|\s*$)/g;
  const items = [];
  let match;

  while ((match = regex.exec(content)) !== null) {
    items.push(match[1]);
  }

  return items;
};

export const getClusters = async (): Promise<Cluster[]> => {
  const records = await loadCSV<ClusterRawData>('Clusters.csv');

  return records.map((record) => {
    const femalePercent = parseFloat(record['%female']);

    return {
      clusterId: parseInt(record['cluster_id']),
      avgAge: parseFloat(record['avg_age']),
      femalePercent,
      malePercent: 100 - femalePercent,
      symptoms: getSymptoms(record['symptoms']),
    };
  });
};
