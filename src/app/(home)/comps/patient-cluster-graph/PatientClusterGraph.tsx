import React, { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import debounce from 'lodash/debounce';

import { Group } from '@visx/group';
import { Circle } from '@visx/shape';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';
import type { TransformMatrix } from '@visx/zoom/lib/types';

import type { Patient } from '@/types/patient';

import { patientClusterStore } from '@/stores/patientClusterStore';

const WIDTH = 800;
const HEIGHT = 600;

export const PatientClusterGraph = observer(() => {
  const {
    graph: { visiblePoints },
    setTransformMatrix,
  } = patientClusterStore;

  const handlePatientClick = (patient: Patient) => {
    console.log('Patient clicked:', patient);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex">
        <Zoom<SVGSVGElement>
          width={WIDTH}
          height={HEIGHT}
          scaleXMin={1 / 2}
          scaleXMax={4}
          scaleYMin={1 / 2}
          scaleYMax={4}
        >
          {(zoom) => {
            useEffect(() => {
              const debouncedUpdate = debounce((matrix: TransformMatrix) => {
                setTransformMatrix(matrix);
              }, 500);
              debouncedUpdate(zoom.transformMatrix);
              return () => debouncedUpdate.cancel();
            }, [zoom.transformMatrix]);

            return (
              <div className="relative">
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

                  <Group transform={zoom.toString()}>
                    {visiblePoints.map(({ id, x, y, color }) => (
                      <Circle
                        key={id}
                        cx={x}
                        cy={y}
                        r={5 / zoom.transformMatrix.scaleX}
                        fill={color}
                        opacity={0.6}
                        // onClick={() => handlePatien tClick(patient)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Group>

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
                      const point = localPoint(event) || { x: 0, y: 0 };
                      zoom.scale({ scaleX: 1.1, scaleY: 1.1, point });
                    }}
                  />
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
                <div className="controls">
                  <button
                    type="button"
                    className="btn btn-zoom"
                    onClick={() => zoom.scale({ scaleX: 1.2, scaleY: 1.2 })}
                  >
                    +
                  </button>
                  <button
                    type="button"
                    className="btn btn-zoom btn-bottom"
                    onClick={() => zoom.scale({ scaleX: 0.8, scaleY: 0.8 })}
                  >
                    -
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    onClick={zoom.center}
                  >
                    Center
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    onClick={zoom.reset}
                  >
                    Reset
                  </button>
                  <button
                    type="button"
                    className="btn btn-lg"
                    onClick={zoom.clear}
                  >
                    Clear
                  </button>
                </div>

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
      </div>
    </div>
  );
});
