import React, { useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { Loader2 } from 'lucide-react';

import { webGlStore } from '@/stores/webGlStore';

export const WebGlGraph = observer(() => {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    ui: { isLoaded, isGraphLoading },
    loadPixiApp,
  } = webGlStore;

  useEffect(() => {
    if (isLoaded && !containerRef.current) return;
    loadPixiApp(containerRef);
  });

  return (
    <div className="relative flex flex-col gap-2 drop-shadow-lg">
      {isGraphLoading && (
        <div className="absolute top-4 right-4">
          <Loader2 className="animate-spin" />
        </div>
      )}
      <div
        ref={containerRef}
        className="rounded-lg overflow-hidden h-[600px] w-[1000px]"
        style={{ cursor: 'grab' }}
      />
    </div>
  );
});
