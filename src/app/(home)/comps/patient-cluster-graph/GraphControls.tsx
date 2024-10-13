import React from 'react';
import type { ProvidedZoom } from '@visx/zoom/lib/types';

import { Button } from '@/ui/Button/Button';
import { Spinner } from '@/ui/Spinner/Spinner';
import { observer } from 'mobx-react-lite';
import { patientClusterStore } from '@/stores/patientClusterStore';

interface GraphControlsProps {
  zoom: ProvidedZoom<SVGSVGElement>;
}

export const GraphControls: React.FC<GraphControlsProps> = observer(
  ({ zoom }) => {
    const {
      ui: { isGraphLoading },
    } = patientClusterStore;

    return (
      <div className="flex gap-4">
        <Button
          type="button"
          onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
        >
          +
        </Button>
        <Button
          type="button"
          onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
        >
          -
        </Button>
        <Button type="button" onClick={zoom.center}>
          Center
        </Button>
        <Button type="button" onClick={zoom.reset}>
          Reset
        </Button>
        <Spinner isVisible={isGraphLoading} />
      </div>
    );
  },
);
