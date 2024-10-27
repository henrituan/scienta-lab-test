import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import { deckGlStore } from '@/stores/deckGlStore';

import { Slider } from '@/ui/Slider/Slider';

export const AgeFilter = observer(() => {
  const {
    ui: { isLoading },
    filters: { avgAge, maxAvgAge },
    setAvgAgeFilter,
    setIsGraphLoading,
  } = deckGlStore;

  const [sliderValue, setSliderValue] = useState(avgAge);

  const onChange = (value: number) => {
    const debouncedUpdate = debounce((avgAge: number) => {
      setAvgAgeFilter(avgAge);
      setIsGraphLoading(false);
    }, 100);

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
