import usePatientClusterStore from '@/stores/patientClusterStore';

export const PatientClusterGraph = () => {
  const clusters = usePatientClusterStore((store) => store.data.clusters);

  console.log({ clusters });

  return (
    <div className="grid items-center justify-items-center">
      <main className="">PatientClusterGraph</main>
    </div>
  );
};
