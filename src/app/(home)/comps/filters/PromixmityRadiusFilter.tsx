import { cx } from 'class-variance-authority';
import { useState } from 'react';
import debounce from 'lodash/debounce';
import { observer } from 'mobx-react-lite';

import {
  DEFAULT_PROXMITY_RADIUS,
  patientClusterStore,
} from '@/stores/patientClusterStore';

import { Slider } from '@/ui/Slider/Slider';

const MAX_PROXIMITY_RADIUS = 20;

export const ProximityRadiusFilter = observer(() => {
  const {
    ui: { isLoaded, isLoading },
    filters: { proximityRadius },
    setProximityRadiusFilter,
    setIsGraphLoading,
  } = patientClusterStore;

  const [sliderValue, setSliderValue] = useState(proximityRadius);

  const onChange = (value: number) => {
    const debouncedUpdate = debounce((proximityRadius: number) => {
      setProximityRadiusFilter(proximityRadius);
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
        max={MAX_PROXIMITY_RADIUS}
        value={sliderValue}
        isDisabled={!isLoaded || isLoading}
        onChange={onChange}
      />
      {isLoaded ? (
        <span
          className={cx(
            proximityRadius < DEFAULT_PROXMITY_RADIUS / 2 && 'text-red-500',
            proximityRadius >= DEFAULT_PROXMITY_RADIUS / 2 && 'text-green-500',
          )}
        >
          {proximityRadius}
        </span>
      ) : (
        <span>0</span>
      )}
    </div>
  );
});
