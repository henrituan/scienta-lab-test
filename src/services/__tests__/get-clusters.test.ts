import { vi, describe, it, expect } from 'vitest';

import { Cluster, ClusterRawData } from '@/types/cluster';

import { getClusters } from '../get-clusters';
import { loadCSV } from '../csv-loader';

const mockedCluster: ClusterRawData[] = [
  {
    cluster_id: '4',
    '%female': '21',
    avg_age: '74.73954504286607',
    symptoms:
      "('Antibiotics', 'Hair loss on other parts of the body', 'Small, raised bumps', 'Premature whitening or graying of hair', 'Minoxidil', 'Psoriasis', 'Swollen and stiff joints', 'Depigmentation (for widespread vitiligo)', 'Scalp sensitivity or itching', 'Dry, cracked skin that may bleed')",
  },
  {
    cluster_id: '5',
    '%female': '82',
    avg_age: '74.18689944450973',
    symptoms:
      "('Leaking, foul-smelling abscesses', 'JAK inhibitors', 'Platelet-rich plasma therapy', 'Vitamin D analogues', 'Atopic Dermatitis (Eczema)', 'Biologics (e.g., TNF-alpha inhibitors)', 'Patchy loss of skin color', 'Hormone therapy', 'Thickened, pitted  or ridged nails', 'Swollen and stiff joints')",
  },
  {
    cluster_id: '6',
    '%female': '57',
    avg_age: '42.34856316329995',
    symptoms:
      "('Skin grafting', 'Phototherapy', 'Small, raised bumps', 'Vitamin D analogues', 'Thickened, pitted or ridged nails', 'Raw, sensitive, swollen skin from scratching', 'Red, scaly patches on skin', 'Hair loss on other parts of the body', 'Topical corticosteroids', 'Atopic Dermatitis (Eczema)')",
  },
  {
    cluster_id: '7',
    '%female': '88',
    avg_age: '36.19179340285662',
    symptoms:
      "('Dupilumab (biologic)', 'Retinoids', 'Skin grafting', 'Topical calcineurin inhibitors', 'JAK inhibitors', 'Patchy loss of skin color', 'Scalp sensitivity or itching', 'Atopic Dermatitis (Eczema)', 'Premature whitening or graying of hair', 'Small, raised bumps')",
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

vi.mocked(loadCSV).mockResolvedValue(mockedCluster);

describe('get-clusters', async () => {
  const results = await getClusters();

  it('should return correct format', async () => {
    expect(results[0]).toEqual({
      clusterId: 4,
      avgAge: 74.73954504286607,
      femalePercent: 21,
      malePercent: 79,
      symptoms: [
        'Antibiotics',
        'Hair loss on other parts of the body',
        'Small, raised bumps',
        'Premature whitening or graying of hair',
        'Minoxidil',
        'Psoriasis',
        'Swollen and stiff joints',
        'Depigmentation (for widespread vitiligo)',
        'Scalp sensitivity or itching',
        'Dry, cracked skin that may bleed',
      ],
    } satisfies Cluster);
  });

  it('should match snapshot', async () => {
    expect(results).toMatchSnapshot();
  });
});
