import type { Quadtree } from 'd3-quadtree';
import type { TransformMatrix } from '@visx/zoom/lib/types';

import type { Cluster, ClusterDetails } from '@/types/cluster';
import type { Patient } from '@/types/patient';

export type Point = {
  id: number;
  x: number;
  y: number;
  clusterId: number;
  color: string;
};

export type PatientClusterStore = {
  ui: {
    isLoading: boolean;
    isLoaded: boolean;
    isGraphLoading: boolean;
  };
  data: {
    clusters: Cluster[];
    selectedClusterId: number | null;
    selectedCluster: ClusterDetails | null;
    filteredClusters: Cluster[];
  };
  filters: {
    avgAge: number;
    maxAvgAge: number;
    femalePercent: number;
    symptoms: string[];
    allSymptoms: string[];
    maxVisiblePoints: number;
  };
  graph: {
    visiblePoints: Point[];
    domain: { x: number[]; y: number[] };
    quadTree: Quadtree<Patient> | null;
    transformMatrix: TransformMatrix | null;
    visiblePointsCount: number;
    totalPointsCount: number;
  };
  init: (initialData: { patients: Patient[]; clusters: Cluster[] }) => void;
  dispose: () => void;
  setTransformMatrix: (transformMatrix: TransformMatrix) => void;
  setIsGraphLoading: (isLoading: boolean) => void;
  setSelectClusterId: (clusterId: number | null) => void;
  setAvgAgeFilter: (avgAge: number) => void;
  setFemalePercentFilter: (femalePercent: number) => void;
  setSelectedSymptomsFilter: (symptoms: string[]) => void;
  setMaxVisiblePointsFilter: (maxVisiblePoints: number) => void;
};
