import React from 'react';

interface SpinnerProps {
  isVisible: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({ isVisible }) => {
  return (
    <div
      className={`w-10 h-10 border-4 border-solid border-gray-200 border-t-blue-500 rounded-full animate-spin ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
    ></div>
  );
};
