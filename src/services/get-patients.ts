import { Patient, PatientRawData } from '@/types/patient';

import { loadCSV } from './csv-loader';

export const getPatients = async (): Promise<Patient[]> => {
  const records = await loadCSV<PatientRawData>('patients.csv');

  return records.map((record) => {
    const coordinates = record['coordinates']
      .replace('(', '')
      .replace(')', '')
      .split(',')
      .map(Number);

    return {
      patientId: parseInt(record['patient_id']),
      clusterId: parseInt(record['cluster_id']),
      coordinates: {
        x: coordinates[0],
        y: coordinates[1],
      },
    };
  });
};
