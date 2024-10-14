import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';
import { SymptomDialog } from './SymptomDialog';

export const SymptomFilter = observer(() => {
  const {
    ui: { isLoaded },
    filters: { symptoms },
    setSelectedSymptomsFilter,
  } = patientClusterStore;

  const onApply = (symptoms: string[]) => {
    setSelectedSymptomsFilter(symptoms);
  };

  if (!isLoaded) return null;

  return (
    <div className="flex items-center gap-2">
      <span>
        <span className="text-green-500">{symptoms.length}</span> selected
      </span>
      <SymptomDialog onApply={onApply} />
    </div>
  );
});
