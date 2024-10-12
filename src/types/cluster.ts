export type ClusterRawData = {
  cluster_id: string;
  '%female': string;
  avg_age: string;
  symptoms: string;
};

export type Cluster = {
  clusterId: number;
  avgAge: number;
  femalePercent: number;
  malePercent: number;
  symptoms: string[];
};
