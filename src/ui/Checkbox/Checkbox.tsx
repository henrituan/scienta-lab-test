import React from 'react';

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  isDisabled?: boolean;
  onChange: (checked: boolean) => void;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  label,
  isDisabled = false,
  onChange,
}) => {
  return (
    <label className="flex items-center gap-2 cursor-pointer">
      <input
        type="checkbox"
        checked={isChecked}
        disabled={isDisabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="text-sm">{label}</span>
    </label>
  );
};
