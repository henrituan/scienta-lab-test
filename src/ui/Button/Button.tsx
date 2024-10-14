import React, { ComponentPropsWithRef } from 'react';

export const Button: React.FC<ComponentPropsWithRef<'button'>> = ({
  children,
  ...props
}) => {
  return (
    <button
      {...props}
      className="bg-slate-100 rounded px-2 py-1 drop-shadow-lg text-sm text-slate-700"
    >
      {children}
    </button>
  );
};
