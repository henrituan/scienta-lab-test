import React from 'react';
import { observer } from 'mobx-react-lite';

import type { ClusterDetails } from '@/types/cluster';

import { patientClusterStore } from '@/stores/patientClusterStore';

const Empty = () => {
  return (
    <p className="flex flex-col justify-center h-full">
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
    <div className="flex flex-col pt-28 justify-center gap-2">
      <div className="flex gap-2 mb-2 items-center">
        <span
          className="h-6 w-6 rounded-full drop-shadow-lg"
          style={{ backgroundColor: color }}
        ></span>
        <h1 className="text-xl font-bold">Cluster {clusterId}</h1>
      </div>
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
  } = patientClusterStore;

  return (
    <div className="bg-slate-50 drop-shadow-lg h-[100vh] p-4 text-black">
      {selectedCluster ? <Content cluster={selectedCluster} /> : <Empty />}
    </div>
  );
});
