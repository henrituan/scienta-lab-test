import React from 'react';

interface SliderProps {
  min: number;
  max: number;
  value: number;
  isDisabled?: boolean;
  onChange: (value: number) => void;
}

export const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  isDisabled = false,
  onChange,
}) => {
  return (
    <input
      className="cursor-pointer"
      type="range"
      min={min}
      max={max}
      value={value}
      disabled={isDisabled}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  );
};
