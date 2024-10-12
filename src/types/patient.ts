export type PatientRawData = {
  patient_id: string;
  cluster_id: string;
  coordinates: string;
};

export type Patient = {
  patientId: number;
  clusterId: number;
  coordinates: {
    x: number;
    y: number;
  };
};
