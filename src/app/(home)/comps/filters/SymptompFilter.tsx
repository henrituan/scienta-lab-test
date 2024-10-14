import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { Checkbox } from '@/ui/Checkbox/Checkbox';

export const SymptomFilter = observer(() => {
  const {
    ui: { isLoading },
    filters: { symptoms, allSymptoms },
    selectSymptomsFilter,
  } = patientClusterStore;

  const onChange = (symptom: string) => {
    selectSymptomsFilter(symptom);
  };

  return (
    <div className="flex flex-wrap gap-2">
      {allSymptoms.map((symptom) => (
        <Checkbox
          key={symptom}
          label={symptom}
          isChecked={symptoms.includes(symptom)}
          isDisabled={isLoading}
          onChange={(e) => onChange(symptom)}
        />
      ))}
    </div>
  );
});
