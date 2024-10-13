'use client';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Patient } from '@/types/patient';
import { Cluster } from '@/types/cluster';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { AgeFilter } from './filters/AgeFilter';
import { PatientClusterGraph } from './patient-cluster-graph/PatientClusterGraph';
import { GraphInfo } from './grap-info/GraphInfo';

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
      <div className="grid items-center grid-rows-[.5rem,5rem,1fr,5rem] h-full justify-items-center p-8 pb-20 gap-8">
        <h1 className="text-xl font-bold">Patient cluster visualization</h1>
        <GraphInfo />
        <PatientClusterGraph />
        <AgeFilter />
      </div>
    );
  },
);
