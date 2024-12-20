import React from 'react';
import { observer } from 'mobx-react-lite';

import type { ClusterDetails } from '@/types/cluster';

import { deckGlStore } from '@/stores/deckGlStore';

const Empty = () => {
  return (
    <p className="flex flex-col justify-center text-center h-full">
      Select a point to view cluster's details
    </p>
  );
};

const Content: React.FC<{ cluster: ClusterDetails }> = ({ cluster }) => {
  const {
    clusterId,
    symptoms,
    avgAge,
    patientsCount,
    femalePercent,
    malePercent,
    color,
  } = cluster;

  return (
    <div className="flex flex-col pt-4 justify-center gap-2">
      <p className="flex gap-2 mb-2 items-center">
        <span
          className="h-6 w-6 rounded-full drop-shadow-lg"
          style={{ backgroundColor: color }}
        ></span>
        <span className="text-xl font-bold">Cluster {clusterId}</span>
      </p>
      <p>
        Patients count: <span className="text-teal-500">{patientsCount}</span>
      </p>
      <p>
        Average age:{' '}
        <span className="text-teal-500">{Math.round(avgAge).toFixed(2)}</span>
      </p>
      <p>
        Female percent: <span className="text-teal-500">{femalePercent}%</span>
      </p>
      <p>
        Male percent: <span className="text-teal-500">{malePercent}%</span>
      </p>
      {symptoms.length > 0 ? (
        <div>
          Symptoms:
          <ul className="list-inside list-disc mt-2">
            {symptoms.map((s, i) => (
              <li key={i} className="list-item list-disc text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
};

export const ClusterSidebar = observer(() => {
  const {
    data: { selectedCluster },
  } = deckGlStore;

  return (
    <div className="flex flex-col justify-end">
      <div className=" h-[600px] bg-slate-50 drop-shadow-lg p-4 text-black rounded-lg">
        {selectedCluster ? <Content cluster={selectedCluster} /> : <Empty />}
      </div>
    </div>
  );
});
