import { getPatients } from '@/services/get-patients';
import { getClusters } from '@/services/get-clusters';

import { Container } from './comps/Container';

export default async function Home() {
  const [patients, clusters] = await Promise.all([
    getPatients(),
    getClusters(),
  ]);

  return <Container patients={patients} clusters={clusters} />;
}
