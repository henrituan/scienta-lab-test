import { makeAutoObservable } from 'mobx';
import { Cluster } from '@/types/cluster';
import { Patient } from '@/types/patient';

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
    displayedPatients: Patient[];
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
      get displayedPatients() {
        return store.data.patients.slice(0, 100);
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
