import React from 'react';

import type { ProvidedZoom } from '@visx/zoom/lib/types';

import { Button } from '@/ui/Button/Button';

interface GraphControlsProps {
  zoom: ProvidedZoom<SVGSVGElement>;
}

export const GraphControls: React.FC<GraphControlsProps> = ({ zoom }) => {
  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 max-w-40 absolute top-4 left-4">
      <Button type="button" size="sm" onClick={zoom.center}>
        Center
      </Button>
      <Button type="button" size="sm" onClick={zoom.reset}>
        Reset
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
      >
        +
      </Button>
      <Button
        type="button"
        size="sm"
        onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
      >
        -
      </Button>
    </div>
  );
};
