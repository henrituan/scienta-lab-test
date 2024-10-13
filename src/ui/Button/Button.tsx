import React, { ComponentPropsWithRef } from 'react';

export const Button: React.FC<ComponentPropsWithRef<'button'>> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className="bg-white rounded px-2 py-1 shadow text-sm text-black"
    >
      {children}
    </button>
  );
};
