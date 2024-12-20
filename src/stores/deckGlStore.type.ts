import type { Quadtree } from 'd3-quadtree';
import { MapViewState, ScatterplotLayer } from 'deck.gl';

import type { Cluster, ClusterDetails } from '@/types/cluster';
import type { Patient } from '@/types/patient';

export type Point = {
  id: number;
  x: number;
  y: number;
  clusterId: number;
};

export type DeckGlStore = {
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
    proximityRadius: number;
  };
  graph: {
    scatterPlotLayer: ScatterplotLayer<Point> | null;
    viewState: MapViewState;
    viewPort: {
      minX: number;
      minY: number;
      maxX: number;
      maxY: number;
      scale: number;
    };
    quadTree: Quadtree<Patient> | null;
    visiblePoints: Point[];
    visiblePointsCount: number;
    totalPointsCount: number;
  };
  init: (initialData: { patients: Patient[]; clusters: Cluster[] }) => void;
  dispose: () => void;
  // graph controls
  zoomIn: () => void;
  zoomOut: () => void;
  zoomReset: () => void;
  centerGraph: () => void;
  // setters
  setViewState: (viewState: MapViewState) => void;
  setIsGraphLoading: (isLoading: boolean) => void;
  setSelectClusterId: (clusterId: number | null) => void;
  setAvgAgeFilter: (avgAge: number) => void;
  setFemalePercentFilter: (femalePercent: number) => void;
  setSelectedSymptomsFilter: (symptoms: string[]) => void;
  setMaxVisiblePointsFilter: (maxVisiblePoints: number) => void;
  setProximityRadiusFilter: (proximityRadius: number) => void;
};
