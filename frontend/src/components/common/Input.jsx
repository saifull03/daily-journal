import React, { useId } from 'react';

export default function Input({
  label,
  error,
  helperText,
  leftIcon: LeftIcon,
  rightIcon: RightIcon,
  className = '',
  id,
  ...props
}) {
  const generatedId = useId();
  const inputId = id || props.name || generatedId;

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {LeftIcon && (
          <div className="absolute left-3 text-stone-400 pointer-events-none">
            <LeftIcon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          className={`w-full rounded-xl border bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 text-sm py-2 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-stone-500 focus:border-transparent ${
            LeftIcon ? 'pl-9' : 'pl-3.5'
          } ${RightIcon ? 'pr-9' : 'pr-3.5'} ${
            error
              ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-500'
              : 'border-stone-200 dark:border-stone-800'
          } ${className}`}
          {...props}
        />
        {RightIcon && (
          <div className="absolute right-3 text-stone-400">
            <RightIcon className="w-4 h-4" />
          </div>
        )}
      </div>
      {error && <p className="text-xs text-rose-500 dark:text-rose-400 font-medium">{error}</p>}
      {!error && helperText && (
        <p className="text-xs text-stone-500 dark:text-stone-400">{helperText}</p>
      )}
    </div>
  );
}
