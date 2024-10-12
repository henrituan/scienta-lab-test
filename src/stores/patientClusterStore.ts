import { create } from 'zustand';

import { Cluster } from '@/types/cluster';
import { Patient } from '@/types/patient';

type PatientClusterData = {
  isLoading: boolean;
  isLoaded: boolean;
  data: {
    patients: Patient[];
    clusters: Cluster[];
  };
  init: (initialData: { patients: Patient[]; clusters: Cluster[] }) => void;
  dispose: () => void;
};

const usePatientClusterStore = create<PatientClusterData>()((set) => ({
  isLoading: true,
  isLoaded: false,
  data: {
    patients: [],
    clusters: [],
  },
  init: (initialData) => {
    set({ isLoading: false, isLoaded: true, data: initialData });
  },
  dispose: () => {
    set({ isLoaded: false, data: { patients: [], clusters: [] } });
  },
}));

export default usePatientClusterStore;
