import React, { ComponentPropsWithRef } from 'react';
import { cx } from 'class-variance-authority';
interface SpinnerProps extends ComponentPropsWithRef<'div'> {
  isVisible: boolean;
}

export const Spinner: React.FC<SpinnerProps> = ({
  isVisible,
  className,
  ...props
}) => {
  return (
    <div
      {...props}
      className={cx(
        'w-10 h-10 border-4 border-solid border-gray-200 border-t-blue-500 rounded-full animate-spin',
        isVisible ? 'opacity-100' : 'opacity-0',
        className,
      )}
    ></div>
  );
};
