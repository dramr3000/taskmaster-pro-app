
import React from 'react';

interface SpinnerProps {
  size?: 'xs' | 'sm' | 'md' | 'lg';
  color?: string; // Tailwind color class e.g., 'text-blue-500'
}

const Spinner: React.FC<SpinnerProps> = ({ size = 'md', color = 'text-sky-600' }) => {
  let sizeClasses = 'w-8 h-8';
  if (size === 'xs') sizeClasses = 'w-4 h-4';
  if (size === 'sm') sizeClasses = 'w-6 h-6';
  if (size === 'lg') sizeClasses = 'w-12 h-12';

  return (
    <div className="flex justify-center items-center">
      <div
        className={`animate-spin rounded-full border-t-2 border-b-2 border-transparent ${sizeClasses} ${color}`}
        style={{ borderTopColor: 'currentColor', borderBottomColor: 'currentColor', borderLeftColor: 'transparent', borderRightColor: 'transparent' }} 
      ></div>
    </div>
  );
};

export default Spinner;