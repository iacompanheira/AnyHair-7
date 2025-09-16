import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon?: React.ReactNode;
  endAdornment?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, id, icon, endAdornment, ...props }) => {
  return (
    <div className="relative">
      <label htmlFor={id} className="block text-base font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative rounded-md shadow-sm">
        {icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
             {icon}
          </div>
        )}
        <input
          id={id}
          className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-pink-500 focus:ring-pink-500 sm:text-base p-2 ${icon ? 'pl-10' : ''} ${endAdornment ? 'pr-10' : ''}`}
          {...props}
        />
        {endAdornment && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
             {endAdornment}
          </div>
        )}
      </div>
    </div>
  );
};