'use client';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Patient } from '@/types/patient';
import { Cluster } from '@/types/cluster';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { PatientClusterGraph } from './patient-cluster-graph/PatientClusterGraph';
import { GraphInfo } from './grap-info/GraphInfo';
import { ClusterSidebar } from './cluster-sidebar/ClusterSidebar';
import { Filters } from './filters/Filters';

export const Container = observer(
  (props: { patients: Patient[]; clusters: Cluster[] }) => {
    const { patients, clusters } = props;

    const {
      ui: { isLoaded, isLoading },
      init,
      dispose,
    } = patientClusterStore;

    useEffect(() => {
      init({ patients, clusters });
      return () => {
        if (isLoaded) dispose();
      };
    }, [init, patients, clusters, dispose, isLoaded]);

    if (!isLoading && !isLoaded) return 'Dataset not found';

    return (
      <div className="grid grid-cols-[1fr,20rem] gap-8">
        <div className="grid grid-rows-[1rem,5rem,1fr,5rem] py-8 h-full justify-center items-start gap-4">
          <p className="text-2xl font-bold text-center">
            Patient cluster visualization
          </p>
          <GraphInfo />
          <PatientClusterGraph />
          <Filters />
        </div>
        <ClusterSidebar />
      </div>
    );
  },
);
