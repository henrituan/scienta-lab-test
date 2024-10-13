import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { Spinner } from '@/ui/Spinner/Spinner';

export const GraphInfo = observer(() => {
  const {
    ui: { isLoading, isGraphLoading },
    graph: { visiblePoints, totalPointsCount },
  } = patientClusterStore;

  if (isLoading) {
    return <Spinner isVisible={true} />;
  }

  return (
    <div className="flex items-center gap-4">
      <Spinner isVisible={isGraphLoading} />
      <div className="flex flex-col gap-4">
        <p className="">
          Showing {visiblePoints.length} out of {totalPointsCount} points.
          <br />
          The graph are downsampled for better performance. Zoom in to see more
          points in each cluster.
        </p>
      </div>
    </div>
  );
});
