import { type InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

/** Controlled text input with optional label and validation error message */
const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={id} className="text-sm font-medium text-text-primary">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={id}
          {...props}
          className={`
            w-full px-3 py-2.5 rounded-lg border text-sm
            bg-white text-text-primary placeholder:text-text-secondary
            transition-colors duration-150 outline-none
            ${error
              ? 'border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-100'
              : 'border-border focus:border-primary focus:ring-2 focus:ring-primary-light'
            }
            ${className}
          `}
        />
        {error && <p className="text-xs text-rose-500">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
