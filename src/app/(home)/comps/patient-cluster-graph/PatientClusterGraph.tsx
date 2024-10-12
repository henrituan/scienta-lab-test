import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';

import { Patient } from '@/types/patient';
import { patientClusterStore } from '@/stores/patientClusterStore';

const WIDTH = 800;
const HEIGHT = 600;
const POINT_RADIUS = 2;
const MAX_POINTS = 1000;

export const PatientClusterGraph = observer(() => {
  const {
    graph: { points, domain },
  } = patientClusterStore;

  console.log({ points });

  const xScale = scaleLinear({ domain: domain.x, range: [0, WIDTH] });
  const yScale = scaleLinear({ domain: domain.y, range: [HEIGHT, 0] });

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
          {(zoom) => (
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
                  {points.map(({ id, x, y, color }) => (
                    <Circle
                      key={id}
                      cx={xScale(x)}
                      cy={yScale(y)}
                      r={5}
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
          )}
        </Zoom>

        {/* <Zoom
          width={WIDTH}
          height={HEIGHT}
          scaleXMin={1 / 2}
          scaleXMax={4}
          scaleYMin={1 / 2}
          scaleYMax={4}
        >
          {(zoom) => {
             const { scaleX, scaleY, translateX, translateY } = zoom.transformMatrix;

             const xDomain = zoom.isDragging ? zoom.lastDomain?.x : zoom.domain?.x;
             const yDomain = zoom.isDragging ? zoom.lastDomain?.y : zoom.domain?.y;
             const visiblePoints = getVisiblePoints(xDomain, yDomain);
            //  const downsampledPoints = spatialDownsample(visiblePoints, scale);

            return (
              <div className="relative">
                <svg
                  width={WIDTH}
                  height={HEIGHT}
                  style={{ cursor: zoom.isDragging ? 'grabbing' : 'grab' }}
                >
                  <rect
                    width={WIDTH}
                    height={HEIGHT}
                    fill="#f0f0f0"
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
                  <Group transform={zoom.toString()}>
                    {points.map((patient, i) => (
                      <Circle
                        key={`patient-${i}`}
                        cx={xScale(patient.coordinates.x)}
                        cy={yScale(patient.coordinates.y)}
                        r={5}
                        fill={getColorForCluster(patient.clusterId)}
                        opacity={0.6}
                        onClick={() => handlePatientClick(patient)}
                        style={{ cursor: 'pointer' }}
                      />
                    ))}
                  </Group>
                </svg>
                <div className="absolute top-0 left-0 p-2">
                  <button
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                    onClick={() => zoom.reset()}
                  >
                    Reset Zoom
                  </button>
                </div>
              </div>
            );
          }}
        </Zoom> */}

        {/* <div className="w-1/3 p-4">
        {selectedCluster ? (
          <Card>
            <CardHeader>Cluster {selectedCluster.clusterId} Details</CardHeader>
            <CardContent>
              <p>Female Percentage: {selectedCluster.female_percentage}%</p>
              <p>Average Age: {selectedCluster.ave_age.toFixed(2)}</p>
              <p>Symptoms:</p>
              <ul className="list-disc pl-5">
                {selectedCluster.symptoms.map((symptom, index) => (
                  <li key={index}>{symptom}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ) : (
          <p>Click on a point to see cluster details</p>
        )}
      </div> */}
      </div>
    </div>
  );
});
