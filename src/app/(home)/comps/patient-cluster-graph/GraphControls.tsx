import React from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@/ui/Button/Button';

import { deckGlStore } from '@/stores/deckGlStore';

export const GraphControls = observer(() => {
  const { zoomIn, zoomOut, zoomReset, centerGraph } = deckGlStore;

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-2 max-w-40 absolute top-4 left-4">
      <Button type="button" size="sm" onClick={centerGraph}>
        Center
      </Button>
      <Button type="button" size="sm" onClick={zoomReset}>
        Reset
      </Button>
      <Button type="button" size="sm" onClick={zoomIn}>
        +
      </Button>
      <Button type="button" size="sm" onClick={zoomOut}>
        -
      </Button>
    </div>
  );
});
