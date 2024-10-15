import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import { patientClusterStore } from '@/stores/patientClusterStore';

import { Slider } from '@/ui/Slider/Slider';
import { cx } from 'class-variance-authority';

const DEFAULT_MAX_VISIBLE_POINTS = 1000;

export const MaxVisblePointsFilter = observer(() => {
  const {
    ui: { isLoading },
    filters: { maxVisiblePoints },
    setMaxVisiblePointsFilter,
    setIsGraphLoading,
  } = patientClusterStore;

  const [sliderValue, setSliderValue] = useState(maxVisiblePoints);

  const onChange = (value: number) => {
    const debouncedUpdate = debounce((maxVisiblePoints: number) => {
      setMaxVisiblePointsFilter(maxVisiblePoints);
      setIsGraphLoading(false);
    }, 500);

    setIsGraphLoading(true);
    setSliderValue(value);
    debouncedUpdate(value);
  };

  return (
    <div className="flex gap-4">
      <Slider
        min={0}
        max={2000}
        value={sliderValue}
        isDisabled={isLoading}
        onChange={onChange}
      />
      <span
        className={cx(
          maxVisiblePoints <= DEFAULT_MAX_VISIBLE_POINTS * 1.1 &&
            'text-green-500',
          maxVisiblePoints > DEFAULT_MAX_VISIBLE_POINTS * 1.1 && 'text-red-500',
        )}
      >
        {maxVisiblePoints}
      </span>
    </div>
  );
});
