import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import debounce from 'lodash/debounce';

import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import type { TransformMatrix } from '@visx/zoom/lib/types';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { GraphControls } from './GraphControls';

const WIDTH = 1000;
const HEIGHT = 600;
const POINT_RADIUS = 10;

export const PatientClusterGraph = observer(() => {
  const {
    graph: { visiblePoints },
    setTransformMatrix,
    setIsGraphLoading,
    setSelectClusterId,
  } = patientClusterStore;

  return (
    <Zoom<SVGSVGElement>
      width={WIDTH}
      height={HEIGHT}
      scaleXMin={1 / 2}
      scaleXMax={10}
      scaleYMin={1 / 2}
      scaleYMax={10}
    >
      {(zoom) => {
        useEffect(() => {
          const debouncedUpdate = debounce((matrix: TransformMatrix) => {
            setTransformMatrix(matrix);
            setIsGraphLoading(false);
          }, 500);

          setIsGraphLoading(true);
          debouncedUpdate(zoom.transformMatrix);
          return () => debouncedUpdate.cancel();
        }, [zoom.transformMatrix]);

        return (
          <div className="relative flex flex-col gap-4 drop-shadow-lg">
            <GraphControls zoom={zoom} />
            <svg
              width={WIDTH}
              height={HEIGHT}
              style={{
                cursor: zoom.isDragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              ref={zoom.containerRef}
            >
              <rect width={WIDTH} height={HEIGHT} rx={14} fill={'white'} />
              <rect
                width={WIDTH}
                height={HEIGHT}
                rx={14}
                fill="transparent"
                onTouchStart={zoom.dragStart}
                onTouchMove={zoom.dragMove}
                onTouchEnd={zoom.dragEnd}
                onMouseDown={zoom.dragStart}
                onMouseMove={zoom.dragMove}
                onMouseUp={zoom.dragEnd}
                onMouseLeave={() => {
                  if (zoom.isDragging) zoom.dragEnd();
                }}
                onDoubleClick={(event) => {
                  event.stopPropagation();
                  const point = localPoint(event) || { x: 0, y: 0 };
                  zoom.scale({ scaleX: 1.2, scaleY: 1.2, point });
                }}
              />

              <Group transform={zoom.toString()}>
                {visiblePoints.map((point) => {
                  const { id, x, y, color, clusterId } = point;
                  return (
                    <Circle
                      key={id}
                      cx={x}
                      cy={y}
                      r={POINT_RADIUS / zoom.transformMatrix.scaleX}
                      fill={color}
                      opacity={0.6}
                      style={{ cursor: 'pointer' }}
                      onClick={(event) => {
                        event.stopPropagation();
                        setSelectClusterId(clusterId);
                      }}
                    />
                  );
                })}
              </Group>
            </svg>
          </div>
        );
      }}
    </Zoom>
  );
});
