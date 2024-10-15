import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { Slider } from '@/ui/Slider/Slider';

export const AgeFilter = observer(() => {
  const {
    ui: { isLoading },
    filters: { avgAge, maxAvgAge },
    setAvgAgeFilter,
    setIsGraphLoading,
  } = patientClusterStore;

  const [sliderValue, setSliderValue] = useState(avgAge);

  const onChange = (value: number) => {
    const debouncedUpdate = debounce((avgAge: number) => {
      setAvgAgeFilter(avgAge);
      setIsGraphLoading(false);
    }, 500);

    setIsGraphLoading(true);
    setSliderValue(value);
    debouncedUpdate(value);
  };

  return (
    <div className="flex gap-4 items-center">
      <Slider
        min={0}
        max={maxAvgAge}
        value={sliderValue}
        isDisabled={isLoading}
        onChange={onChange}
      />
      <span>{avgAge}</span>
    </div>
  );
});
