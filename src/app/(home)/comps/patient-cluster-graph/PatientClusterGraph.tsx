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

const WIDTH = 800;
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

              {/* {showMiniMap && (
                  <g
                    clipPath="url(#zoom-clip)"
                    transform={`
                      scale(0.25)
                      translate(${width * 4 - width - 60}, ${height * 4 - height - 60})
                    `}
                  >
                    <rect width={width} height={height} fill="#1a1a1a" />
                    {phyllotaxis.map(({ x, y }, i) => (
                      <React.Fragment key={`dot-sm-${i}`}>
                        <circle
                          cx={x}
                          cy={y}
                          r={i > 500 ? sizeScale(1000 - i) : sizeScale(i)}
                          fill={interpolateRainbow(colorScale(i) ?? 0)}
                        />
                      </React.Fragment>
                    ))}
                    <rect
                      width={width}
                      height={height}
                      fill="white"
                      fillOpacity={0.2}
                      stroke="white"
                      strokeWidth={4}
                      transform={zoom.toStringInvert()}
                    />
                  </g>
                )} */}
            </svg>

            {/* <div className="mini-map">
                <button
                  type="button"
                  className="btn btn-lg"
                  onClick={() => setShowMiniMap(!showMiniMap)}
                >
                  {showMiniMap ? 'Hide' : 'Show'} Mini Map
                </button>
              </div> */}
          </div>
        );
      }}
    </Zoom>
  );
});
