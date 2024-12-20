import { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@/ui/Button/Button';
import { SymptomDialog } from './SymptomDialog';

import { deckGlStore } from '@/stores/deckGlStore';

export const SymptomFilter = observer(() => {
  const {
    ui: { isLoaded, isGraphLoading },
    filters: { symptoms },
    setIsGraphLoading,
    setSelectedSymptomsFilter,
  } = deckGlStore;

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onApply = (symptoms: string[]) => {
    setIsDialogOpen(false);
    setIsGraphLoading(true);

    const delayed = setTimeout(() => {
      setSelectedSymptomsFilter(symptoms);
      setIsGraphLoading(false);
    }, 200);
    return () => clearTimeout(delayed);
  };

  if (!isLoaded) return null;

  return (
    <>
      <div className="flex items-center gap-2">
        <span>
          <span className="text-green-500">{symptoms.length}</span> Symptoms
          selected
        </span>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsDialogOpen(true)}
          disabled={isGraphLoading}
        >
          Edit
        </Button>
      </div>
      <SymptomDialog isOpen={isDialogOpen} onApply={onApply} />
    </>
  );
});
