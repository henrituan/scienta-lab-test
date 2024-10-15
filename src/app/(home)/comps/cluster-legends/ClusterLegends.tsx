import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';
import { getColorForCluster } from '@/stores/util';

export const ClusterLegends = observer(() => {
  const {
    ui: { isLoaded },
    data: { clusters },
    graph: { quadTree },
    setSelectClusterId,
  } = patientClusterStore;

  const getPatientsCount = (clusterId: number) => {
    return (
      quadTree?.data().filter((p) => p.clusterId === clusterId).length ?? 0
    );
  };

  if (!isLoaded) return null;

  return (
    <div className="flex flex-wrap items-center gap-4">
      {clusters.map(({ clusterId }) => (
        <div
          key={clusterId}
          className="flex gap-2 cursor-pointer"
          onClick={() => setSelectClusterId(clusterId)}
        >
          <span
            className="h-4 w-4 rounded-full drop-shadow-lg"
            style={{ backgroundColor: getColorForCluster(clusterId) }}
          ></span>
          <span className="text-sm">
            {getPatientsCount(clusterId)} patients
          </span>
        </div>
      ))}
    </div>
  );
});
