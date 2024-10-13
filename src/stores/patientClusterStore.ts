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
};

function createPatientClusterStore() {
  const store: PatientClusterStore = {
    ui: {
      isLoading: true,
      isLoaded: false,
      isGraphLoading: true,
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

              if (
                x >= visibleArea.xMin &&
                x <= visibleArea.xMax &&
                y >= visibleArea.yMin &&
                y <= visibleArea.yMax
              ) {
                const point: Point = {
                  id: p.patientId,
                  clusterId: p.clusterId,
                  x,
                  y,
                  color: getColorForCluster(p.clusterId),
                };

                // spatial downSample:
                // only add the point to visiblePoints if it's not too close to any other point
                if (
                  !visiblePoints.some(
                    (d) =>
                      Math.abs(d.x - x) < scaledRadius &&
                      Math.abs(d.y - y) < scaledRadius,
                  )
                ) {
                  visiblePoints.push(point);
                }
              }
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
        return store.graph.quadTree?.data().length ?? 0;
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
  };

  makeAutoObservable(store);
  return store;
}

export const patientClusterStore = createPatientClusterStore();
