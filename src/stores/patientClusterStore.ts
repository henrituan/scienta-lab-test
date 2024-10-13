import { makeAutoObservable } from 'mobx';
import { quadtree, Quadtree, QuadtreeLeaf } from 'd3-quadtree';
import type { TransformMatrix } from '@visx/zoom/lib/types';

import type { Cluster, ClusterDetails } from '@/types/cluster';
import type { Patient } from '@/types/patient';

import { xScale, yScale, getColorForCluster, getDomains } from '@/stores/util';

const WIDTH = 800;
const HEIGHT = 600;
const DOWNSAMPLE_RADIUS = 20;
const MAX_VISIBLE_POINTS = 1000;

export type Point = {
  id: number;
  x: number;
  y: number;
  clusterId: number;
  color: string;
};

type PatientClusterStore = {
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
  selectSymptomsFilter: (symptom: string) => void;
};

function createPatientClusterStore() {
  const store: PatientClusterStore = {
    ui: {
      isLoading: true,
      isLoaded: false,
      isGraphLoading: true,
    },

    filters: {
      avgAge: 100,
      femalePercent: 100,
      symptoms: [],

      get maxAvgAge() {
        const {
          data: { clusters },
        } = store;

        return Math.round(Math.max(...clusters.map((c) => c.avgAge)));
      },

      get allSymptoms() {
        const {
          data: { clusters },
        } = store;

        const symptoms = new Set<string>();
        clusters.forEach((c) => c.symptoms.forEach((s) => symptoms.add(s)));
        return Array.from(symptoms);
      },
    },

    data: {
      clusters: [],
      selectedClusterId: null,

      get selectedCluster() {
        const {
          data: { selectedClusterId, clusters },
          graph: { quadTree },
        } = store;

        if (selectedClusterId === null || !quadTree) return null;

        const cluster = clusters.find((c) => c.clusterId === selectedClusterId);
        if (!cluster) return null;

        const patientsCount = quadTree
          .data()
          .filter((p) => p.clusterId === selectedClusterId).length;
        const color = getColorForCluster(selectedClusterId);

        return { ...cluster, patientsCount, color };
      },

      get filteredClusters() {
        const { clusters } = store.data;
        const { avgAge, femalePercent, symptoms } = store.filters;

        return clusters.filter((c) => {
          if (c.avgAge > avgAge) return false;
          if (c.femalePercent > femalePercent) return false;
          if (
            symptoms.length > 0 &&
            !c.symptoms.some((s) => symptoms.includes(s))
          )
            return false;

          return true;
        });
      },
    },

    graph: {
      quadTree: null,
      transformMatrix: null,

      get domain() {
        const { quadTree } = store.graph;
        if (!quadTree) return { x: [0, 1], y: [0, 1] };

        const allPoints = quadTree.data().map((p) => p.coordinates);
        return getDomains(allPoints);
      },

      get visiblePoints() {
        const { quadTree, transformMatrix } = store.graph;
        if (!quadTree || !transformMatrix) return [];

        // Calculate the visible area in Zoom
        const { translateX, translateY, scaleX, scaleY } = transformMatrix;
        const visibleArea = {
          xMin: -translateX / scaleX,
          yMin: -translateY / scaleY,
          xMax: (WIDTH - translateX) / scaleX,
          yMax: (HEIGHT - translateY) / scaleY,
        };
        const visiblePoints: Point[] = [];
        const scaledRadius = DOWNSAMPLE_RADIUS / scaleX;

        // Visit each node in the quadtree and check if the point is in the visible area
        quadTree.visit((node, x1, y1, x2, y2) => {
          if (!('length' in node)) {
            let currentNode: QuadtreeLeaf<Patient> | null = node;
            do {
              const p = currentNode.data;
              const x = xScale({
                x: p.coordinates.x,
                domain: store.graph.domain.x,
                width: WIDTH,
              });
              const y = yScale({
                y: p.coordinates.y,
                domain: store.graph.domain.y,
                height: HEIGHT,
              });

              // if outside the visible area, skip
              if (
                x < visibleArea.xMin ||
                x > visibleArea.xMax ||
                y < visibleArea.yMin ||
                y > visibleArea.yMax
              ) {
                continue;
              }

              const point: Point = {
                id: p.patientId,
                clusterId: p.clusterId,
                x,
                y,
                color: getColorForCluster(p.clusterId),
              };

              // filter
              const { filteredClusters } = store.data;
              if (!filteredClusters.some((c) => c.clusterId === p.clusterId)) {
                continue;
              }

              // spatial downSample:
              // if it's not too close to any other point, skip
              if (
                visiblePoints.some(
                  (d) =>
                    Math.abs(d.x - x) < scaledRadius &&
                    Math.abs(d.y - y) < scaledRadius,
                )
              ) {
                continue;
              }

              visiblePoints.push(point);
            } while ((currentNode = currentNode.next ?? null));
          }

          return (
            x1 >= visibleArea.xMax ||
            y1 >= visibleArea.yMax ||
            x2 < visibleArea.xMin ||
            y2 < visibleArea.yMin
          );
        });

        // size downSample: only show MAX_VISIBLE_POINTS points
        if (visiblePoints.length > MAX_VISIBLE_POINTS) {
          const step = Math.ceil(visiblePoints.length / MAX_VISIBLE_POINTS);
          return visiblePoints.filter((_, index) => index % step === 0);
        }

        return visiblePoints;
      },

      get visiblePointsCount() {
        return store.graph.visiblePoints.length;
      },

      get totalPointsCount() {
        const {
          data: { filteredClusters },
          graph: { quadTree },
        } = store;

        if (!quadTree) return 0;

        return (
          quadTree
            .data()
            .filter((p) =>
              filteredClusters.some((c) => c.clusterId === p.clusterId),
            ).length ?? 0
        );
      },
    },

    init({ patients, clusters }) {
      store.data.clusters = clusters;

      store.graph.quadTree = quadtree<Patient>()
        .x((p) =>
          xScale({
            x: p.coordinates.x,
            domain: store.graph.domain.x,
            width: WIDTH,
          }),
        )
        .y((p) =>
          yScale({
            y: p.coordinates.y,
            domain: store.graph.domain.y,
            height: HEIGHT,
          }),
        )
        .addAll(patients);

      store.ui.isGraphLoading = false;
      store.ui.isLoading = false;
      store.ui.isLoaded = true;
      store.filters.avgAge = store.filters.maxAvgAge;
      store.filters.symptoms = store.filters.allSymptoms;
    },

    dispose() {
      store.ui.isLoaded = false;
      store.ui.isLoading = true;
      store.data.clusters = [];
      store.data.selectedClusterId = null;
      store.graph.quadTree = null;
      store.graph.transformMatrix = null;
    },

    setTransformMatrix(transformMatrix) {
      store.graph.transformMatrix = transformMatrix;
    },

    setIsGraphLoading(isLoading) {
      store.ui.isGraphLoading = isLoading;
    },

    setSelectClusterId(clusterId) {
      store.data.selectedClusterId = clusterId;
    },

    setAvgAgeFilter(avgAge) {
      store.filters.avgAge = avgAge;
    },

    setFemalePercentFilter(femalePercent) {
      store.filters.femalePercent = femalePercent;
    },

    selectSymptomsFilter(symptom) {
      const { symptoms } = store.filters;
      const index = symptoms.indexOf(symptom);
      if (index === -1) {
        store.filters.symptoms.push(symptom);
      } else {
        store.filters.symptoms.splice(index, 1);
      }
    },
  };

  makeAutoObservable(store);
  return store;
}

export const patientClusterStore = createPatientClusterStore();
