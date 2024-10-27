import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import { deckGlStore } from '@/stores/deckGlStore';

import { Slider } from '@/ui/Slider/Slider';

export const FemalePercentFilter = observer(() => {
  const {
    ui: { isLoading },
    filters: { femalePercent },
    setFemalePercentFilter,
    setIsGraphLoading,
  } = deckGlStore;

  const [sliderValue, setSliderValue] = useState(femalePercent);

  const onChange = (value: number) => {
    const debouncedUpdate = debounce((femalePercent: number) => {
      setFemalePercentFilter(femalePercent);
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
        max={100}
        value={sliderValue}
        isDisabled={isLoading}
        onChange={onChange}
      />
      <span>{femalePercent}</span>
    </div>
  );
});
