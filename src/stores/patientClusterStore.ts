import { makeAutoObservable } from 'mobx';
import { quadtree, Quadtree, QuadtreeLeaf } from 'd3-quadtree';

import { Cluster } from '@/types/cluster';
import { Patient } from '@/types/patient';

import { xScale, yScale, getColorForCluster, getDomains } from '@/stores/util';
import { TransformMatrix } from '@visx/zoom/lib/types';

const WIDTH = 800;
const HEIGHT = 600;
const DOWNSAMPLE_RADIUS = 15;
const MAX_VISIBLE_POINTS = 1000;

type Point = {
  id: number;
  x: number;
  y: number;
  clusterId: number;
  color: string;
};

type PatientClusterStore = {
  data: {
    patients: Patient[];
    clusters: Cluster[];
  };
  ui: {
    isLoading: boolean;
    isLoaded: boolean;
  };
  graph: {
    visiblePoints: Point[];
    domain: { x: number[]; y: number[] };
    quadTree: Quadtree<Patient> | null;
    transformMatrix: TransformMatrix | null;
  };
  init: (initialData: { patients: Patient[]; clusters: Cluster[] }) => void;
  dispose: () => void;
  setTransformMatrix: (transformMatrix: TransformMatrix) => void;
};

function createPatientClusterStore() {
  const store: PatientClusterStore = {
    ui: {
      isLoading: true,
      isLoaded: false,
    },

    data: {
      patients: [],
      clusters: [],
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
    },

    init(initialData) {
      store.ui.isLoading = false;
      store.ui.isLoaded = true;
      store.data = initialData;

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
        .addAll(store.data.patients);
    },

    dispose() {
      store.ui.isLoaded = false;
      store.ui.isLoading = true;
      store.data.patients = [];
      store.data.clusters = [];
      store.graph.quadTree = null;
      store.graph.transformMatrix = null;
    },

    setTransformMatrix(transformMatrix) {
      store.graph.transformMatrix = transformMatrix;
    },
  };

  makeAutoObservable(store);
  return store;
}

export const patientClusterStore = createPatientClusterStore();
