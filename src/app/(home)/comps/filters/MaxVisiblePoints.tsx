import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import {
  DEFAULT_MAX_VISIBLE_POINTS,
  patientClusterStore,
} from '@/stores/patientClusterStore';

import { Slider } from '@/ui/Slider/Slider';
import { cx } from 'class-variance-authority';

export const MaxVisblePointsFilter = observer(() => {
  const {
    ui: { isLoaded, isLoading },
    filters: { maxVisiblePoints },
    graph: { totalPointsCount },
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
        max={totalPointsCount}
        value={sliderValue}
        isDisabled={!isLoaded || isLoading}
        onChange={onChange}
      />
      {isLoaded ? (
        <span
          className={cx(
            maxVisiblePoints <= DEFAULT_MAX_VISIBLE_POINTS * 2 &&
              'text-green-500',
            maxVisiblePoints > DEFAULT_MAX_VISIBLE_POINTS * 2 &&
              maxVisiblePoints <= totalPointsCount / 2 &&
              'text-yellow-500',
            maxVisiblePoints > totalPointsCount / 2 && 'text-red-500',
          )}
        >
          {maxVisiblePoints}
        </span>
      ) : (
        <span>0</span>
      )}
    </div>
  );
});
