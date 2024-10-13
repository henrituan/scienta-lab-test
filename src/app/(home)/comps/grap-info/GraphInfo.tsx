import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

export const GraphInfo = observer(() => {
  const {
    graph: { visiblePoints, totalPointsCount },
  } = patientClusterStore;

  return (
    <div className="flex flex-col gap-4">
      <p className="">
        Showing {visiblePoints.length} out of {totalPointsCount} points.
        <br />
        The graph are downsampled for better performance. Zoom in to see more
        points in each cluster.
      </p>
    </div>
  );
});
