import { makeAutoObservable } from 'mobx';
import { Cluster } from '@/types/cluster';
import { Patient } from '@/types/patient';

import { getColorForCluster } from '@/stores/util';

type Point = { id: number; x: number; y: number; color: string };

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
    points: Point[];
    domain: { x: number[]; y: number[] };
  };
  init: (initialData: { patients: Patient[]; clusters: Cluster[] }) => void;
  dispose: () => void;
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
      get points() {
        return store.data.patients.slice(0, 100).map((patient) => ({
          id: patient.patientId,
          x: patient.coordinates.x,
          y: patient.coordinates.y,
          color: getColorForCluster(patient.clusterId),
        }));
      },

      get domain() {
        const points = store.graph.points;
        const xValues = points.map((point) => point.x);
        const yValues = points.map((point) => point.y);

        return {
          x: [Math.min(...xValues), Math.max(...xValues)],
          y: [Math.min(...yValues), Math.max(...yValues)],
        };
      },
    },

    init(initialData: { patients: Patient[]; clusters: Cluster[] }) {
      store.ui.isLoading = false;
      store.ui.isLoaded = true;
      store.data = initialData;
    },
    dispose() {
      store.ui.isLoaded = false;
      store.data = { patients: [], clusters: [] };
    },
  };

  makeAutoObservable(store);
  return store;
}

export const patientClusterStore = createPatientClusterStore();
