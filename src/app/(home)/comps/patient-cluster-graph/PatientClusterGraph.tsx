import React, { useMemo } from 'react';
import { observer } from 'mobx-react-lite';

import { Group } from '@visx/group';
import { scaleLinear } from '@visx/scale';
import { Circle } from '@visx/shape';
import { Zoom } from '@visx/zoom';
import { localPoint } from '@visx/event';

import { Patient } from '@/types/patient';
import { patientClusterStore } from '@/stores/patientClusterStore';

import { getColorForCluster } from './util';

const WIDTH = 800;
const HEIGHT = 600;
const POINT_RADIUS = 2;
const MAX_POINTS = 1000;

export const PatientClusterGraph = observer(() => {
  const {
    graph: { displayedPatients },
  } = patientClusterStore;

  console.log({ displayedPatients });

  const xScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(...displayedPatients.map((d) => d.coordinates.x)),
          Math.max(...displayedPatients.map((d) => d.coordinates.x)),
        ],
        range: [0, WIDTH],
      }),
    [displayedPatients],
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        domain: [
          Math.min(...displayedPatients.map((d) => d.coordinates.y)),
          Math.max(...displayedPatients.map((d) => d.coordinates.y)),
        ],
        range: [HEIGHT, 0],
      }),
    [displayedPatients],
  );

  const handlePatientClick = (patient: Patient) => {
    console.log('Patient clicked:', patient);
  };

  return (
    <div className="flex flex-col space-y-4">
      <div className="flex">
        <Zoom
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
                  {displayedPatients.map((patient, i) => (
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
          )}
        </Zoom>

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
