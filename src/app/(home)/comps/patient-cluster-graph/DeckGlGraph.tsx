import React from 'react';
import { observer } from 'mobx-react-lite';
import DeckGL from '@deck.gl/react';
import { MapViewState } from 'deck.gl';

import { Spinner } from '@/ui/Spinner/Spinner';

import { deckGlStore } from '@/stores/deckGlStore';

export const DeckGlGraph = observer(() => {
  const {
    ui: { isGraphLoading },
    graph: { scatterPlotLayer, viewState },
    setViewState,
    setIsGraphLoading,
  } = deckGlStore;

  const updateViewState = (newViewState: MapViewState) => {
    setViewState(newViewState);
    setIsGraphLoading(false);
  };

  return (
    <div className="relative w-[1000px] h-[600px] shadow-lg bg-slate-50 rounded">
      <Spinner isVisible={isGraphLoading} className="absolute top-4 right-4" />
      <DeckGL
        controller={{
          dragPan: true,
          dragRotate: true,
          scrollZoom: true,
          doubleClickZoom: false,
          touchZoom: true,
          touchRotate: true,
          keyboard: true,
        }}
        viewState={viewState}
        layers={[scatterPlotLayer]}
        onViewStateChange={({ viewState: newViewState }) => {
          if ('zoom' in newViewState) {
            updateViewState(newViewState);
          }
        }}
      ></DeckGL>
    </div>
  );
});
