import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

export const GraphInfo = observer(() => {
  const {
    ui: { isLoading, isGraphLoading },
    graph: { visiblePoints, totalPointsCount },
  } = patientClusterStore;

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-col gap-4">
        <p>
          Showing{' '}
          <span className="text-green-500">
            {isGraphLoading || isLoading ? '...' : visiblePoints.length} points
          </span>{' '}
          out of {isLoading ? '...' : totalPointsCount}.
          <br />
          Numbers of points are reduced for better performance. Zoom in to see
          more points in each cluster.
        </p>
      </div>
    </div>
  );
});
