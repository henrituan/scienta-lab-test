'use client';
import { useEffect } from 'react';

import { Patient } from '@/types/patient';
import { Cluster } from '@/types/cluster';

import usePatientClusterStore from '@/stores/patientClusterStore';

import { AgeFilter } from './filters/AgeFilter';
import { PatientClusterGraph } from './patient-cluster-graph/PatientClusterGraph';

export const Container = (props: {
  patients: Patient[];
  clusters: Cluster[];
}) => {
  const { patients, clusters } = props;

  const init = usePatientClusterStore((store) => store.init);
  const dispose = usePatientClusterStore((store) => store.dispose);
  const isLoaded = usePatientClusterStore((store) => store.isLoaded);

  useEffect(() => {
    init({ patients, clusters });
    return () => {
      if (isLoaded) dispose();
    };
  }, [init, patients, clusters, dispose, isLoaded]);

  return (
    <div className="grid items-center grid-rows-[1fr,5rem] h-full justify-items-center p-8 pb-20 gap-16">
      <PatientClusterGraph />
      <AgeFilter />
    </div>
  );
};
