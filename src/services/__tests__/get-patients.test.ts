import { vi, describe, it, expect } from 'vitest';

import { Patient, PatientRawData } from '@/types/patient';

import { getPatients } from '../get-patients';
import { loadCSV } from '../csv-loader';

const mockedPatient: PatientRawData[] = [
  {
    patient_id: '60',
    coordinates: '(-7.165522128346392, 6.777079232384578)',
    cluster_id: '13',
  },
  {
    patient_id: '61',
    coordinates: '(-9.385521730688493, 5.825364355168432)',
    cluster_id: '8',
  },
  {
    patient_id: '62',
    coordinates: '(-10.339938290911057, 3.342519830062648)',
    cluster_id: '17',
  },
  {
    patient_id: '63',
    coordinates: '(-5.911541191020675, 8.786440172113451)',
    cluster_id: '13',
  },
];

const mocks = vi.hoisted(() => {
  return {
    loadCSV: vi.fn(),
  };
});

vi.mock('../csv-loader', () => {
  return {
    loadCSV: mocks.loadCSV,
  };
});

vi.mocked(loadCSV).mockResolvedValue(mockedPatient);

describe('get-patient', async () => {
  const results = await getPatients();

  it('should return correct format', async () => {
    expect(results[0]).toEqual({
      patientId: 60,
      clusterId: 13,
      coordinates: {
        x: -7.165522128346392,
        y: 6.777079232384578,
      },
    } satisfies Patient);
  });

  it('should match snapshot', async () => {
    expect(results).toMatchSnapshot();
  });
});
