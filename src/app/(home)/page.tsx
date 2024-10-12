import { getPatients } from '@/services/get-patients';
import { getClusters } from '@/services/get-clusters';

import { Container } from './comps/container';

export default async function Home() {
  const [patients, clusters] = await Promise.all([
    getPatients(),
    getClusters(),
  ]);

  return (
    <div className="grid items-center grid-rows-[1fr,5rem] h-full justify-items-center p-8 pb-20 gap-16">
      <Container patients={patients} clusters={clusters} />
    </div>
  );
}
