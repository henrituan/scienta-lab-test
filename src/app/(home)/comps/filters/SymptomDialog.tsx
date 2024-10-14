import React, { useState } from 'react';
import { observer } from 'mobx-react-lite';

import { Button } from '@/ui/Button/Button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/Dialog/Dialog';
import { Checkbox } from '@/ui/Checkbox/Checkbox';

import { patientClusterStore } from '@/stores/patientClusterStore';

interface SymptomDialogProps {
  onApply: (symptoms: string[]) => void;
}

export const SymptomDialog: React.FC<SymptomDialogProps> = observer(
  ({ onApply }) => {
    const {
      ui: { isLoaded, isGraphLoading },
      filters: { symptoms, allSymptoms },
    } = patientClusterStore;

    const [selectedSymptoms, setSelectedSymptoms] = useState(symptoms);

    const onCheckBoxChange = (symptom: string) => {
      const index = selectedSymptoms.indexOf(symptom);
      setSelectedSymptoms((prev) => {
        if (index === -1) {
          return [...prev, symptom];
        }
        return prev.filter((s) => s !== symptom);
      });
    };

    if (!isLoaded) return null;

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm" variant="outline">
            Edit
          </Button>
        </DialogTrigger>

        <DialogContent className="max-w-[60vw]">
          <DialogHeader>
            <DialogTitle>Select symptoms</DialogTitle>
          </DialogHeader>
          <DialogDescription>
            Select symptoms to filter clusters
          </DialogDescription>

          <div className="grid grid-cols-2 gap-2 items-start  max-h-[70vh] overflow-auto">
            {allSymptoms.map((symptom) => (
              <Checkbox
                key={symptom}
                label={symptom}
                isChecked={selectedSymptoms.includes(symptom)}
                isDisabled={isGraphLoading}
                onChange={() => onCheckBoxChange(symptom)}
              />
            ))}
          </div>

          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" onClick={() => onApply(selectedSymptoms)}>
                Apply
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  },
);
