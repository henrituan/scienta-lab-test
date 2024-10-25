import { makeAutoObservable } from 'mobx';
import { quadtree, QuadtreeLeaf } from 'd3-quadtree';

import type { Patient } from '@/types/patient';
import type { Point, DeckGlStore } from '@/stores/deckGlStore.type';

import { getColorForCluster, getClusterColorRGB } from '@/stores/util';
import { MapViewState, ScatterplotLayer, WebMercatorViewport } from 'deck.gl';

export const WIDTH = 1000;
export const HEIGHT = 600;
export const DEFAULT_MAX_VISIBLE_POINTS = 5000;
export const DEFAULT_PROXMITY_RADIUS = 2;

const INITIAL_VIEW_STATE: MapViewState = {
  longitude: 0,
  latitude: 0,
  zoom: 4,
  pitch: 0,
  bearing: 0,
};

const getLayer = (points: Point[], scale: number) => {
  return new ScatterplotLayer<Point>({
    id: 'scatter-plot',
    data: points,
    pickable: true,
    opacity: 0.8,
    stroked: false,
    filled: true,
    radiusScale: 6,
    radiusMinPixels: 3,
    radiusMaxPixels: 20,
    lineWidthMinPixels: 1,
    getPosition: (p) => [p.x, p.y],
    // getRadius: () => 8 / scale,
    getRadius: () => 8,
    getFillColor: (p) => getClusterColorRGB(p.clusterId),
    updateTriggers: {
      getFillColor: ['clusterId'],
      getPosition: ['x', 'y'],
    },
  });
};

function createDeckGlStore() {
  const store: DeckGlStore = {
    ui: {
      isLoading: true,
      isLoaded: false,
      isGraphLoading: true,
    },

    filters: {
      avgAge: 100,
      femalePercent: 100,
      maxVisiblePoints: DEFAULT_MAX_VISIBLE_POINTS,
      proximityRadius: DEFAULT_PROXMITY_RADIUS,
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
          if (!c.symptoms.every((s) => symptoms.includes(s))) return false;

          return true;
        });
      },
    },

    graph: {
      quadTree: null,
      viewState: INITIAL_VIEW_STATE,

      get viewPort() {
        const { viewState } = store.graph;

        const viewPost = new WebMercatorViewport(viewState);
        const [minX, minY, maxX, maxY] = viewPost.getBounds();
        return { minX, minY, maxX, maxY, scale: viewPost.scale };
      },

      get visiblePoints() {
        const { quadTree, viewPort } = store.graph;
        if (!quadTree) return [];
        if (!viewPort) return [];

        const visiblePoints: Point[] = [];
        const scaledRadius = store.filters.proximityRadius / viewPort.scale;

        // Visit each node in the quadtree and check if the point is in the visible area
        quadTree.visit((node, x1, y1, x2, y2) => {
          if (!('length' in node)) {
            let currentNode: QuadtreeLeaf<Patient> | null = node;
            do {
              const p = currentNode.data;
              const { x, y } = p.coordinates;

              // todo: debug viewport x y

              // if outside the visible area, skip
              // if (
              //   x < viewPort.minX ||
              //   x > viewPort.maxX ||
              //   y < viewPort.minY ||
              //   y > viewPort.maxY
              // ) {
              //   continue;
              // }

              const point: Point = {
                id: p.patientId,
                clusterId: p.clusterId,
                x,
                y,
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
            x1 >= viewPort.maxX ||
            y1 >= viewPort.maxY ||
            x2 < viewPort.minX ||
            y2 < viewPort.minY
          );
        });

        // size downSample: only show MAX_VISIBLE_POINTS points
        const { maxVisiblePoints } = store.filters;
        if (visiblePoints.length > maxVisiblePoints) {
          const step = Math.ceil(visiblePoints.length / maxVisiblePoints);
          return visiblePoints.filter((_, index) => index % step === 0);
        }

        return visiblePoints;
      },

      // todo: https://deck.gl/docs/developer-guide/performance#handle-incremental-data-loading
      get scatterPlotLayer() {
        const { visiblePoints } = store.graph;
        // console.log('visiblePoints', visiblePoints.length);
        if (!visiblePoints.length) return null;

        return getLayer(visiblePoints, store.graph.viewPort.scale);
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
        .x((p) => p.coordinates.x)
        .y((p) => p.coordinates.y)
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
    },

    setViewState(viewState) {
      store.graph.viewState = viewState;
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

    setSelectedSymptomsFilter(symptoms) {
      store.filters.symptoms = symptoms;
    },

    setMaxVisiblePointsFilter(maxVisiblePoints) {
      store.filters.maxVisiblePoints = maxVisiblePoints;
    },

    setProximityRadiusFilter(proximityRadius) {
      store.filters.proximityRadius = proximityRadius;
    },
  };

  makeAutoObservable(store);
  return store;
}

export const deckGlStore = createDeckGlStore();
