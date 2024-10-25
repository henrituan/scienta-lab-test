'use client';
import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Patient } from '@/types/patient';
import { Cluster } from '@/types/cluster';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { PatientClusterGraph } from './patient-cluster-graph/PatientClusterGraph';
// import { GraphInfo } from './grap-info/GraphInfo';
import { ClusterSidebar } from './cluster-sidebar/ClusterSidebar';
import { Filters } from './filters/Filters';
import { ClusterLegends } from './cluster-legends/ClusterLegends';
import { DeckGlGraph } from './patient-cluster-graph/DeckGlGraph';
import { deckGlStore } from '@/stores/deckGlStore';

export const Container = observer(
  (props: { patients: Patient[]; clusters: Cluster[] }) => {
    const { patients, clusters } = props;

    // const {
    //   ui: { isLoaded, isLoading },
    //   init,
    //   dispose,
    // } = patientClusterStore;
    const {
      ui: { isLoaded, isLoading },
      init,
      dispose,
    } = deckGlStore;

    useEffect(() => {
      init({ patients, clusters });
      return () => {
        if (isLoaded) dispose();
      };
    }, [init, patients, clusters, dispose, isLoaded]);

    if (!isLoading && !isLoaded) return 'Dataset not found';

    return (
      <div className="flex flex-col py-8 px-8 h-full items-start gap-4 overflow-auto">
        <p className="text-2xl font-bold text-center">
          Patient cluster visualization
        </p>
        <Filters />
        <div className="grid  grid-cols-[1000px_minmax(0,25rem)] w-full gap-8 justify-center">
          {/* <PatientClusterGraph /> */}

          <DeckGlGraph />
          <ClusterSidebar />
        </div>
        <ClusterLegends />
      </div>
    );
  },
);
