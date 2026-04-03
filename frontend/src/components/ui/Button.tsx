import { type ReactNode, type ButtonHTMLAttributes } from 'react';
import Spinner from './Spinner';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  isLoading?: boolean;
  children: ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:   'bg-primary text-white hover:bg-primary-hover',
  secondary: 'bg-primary-light text-primary hover:bg-blue-100',
  danger:    'bg-rose-50 text-rose-600 hover:bg-rose-100',
  ghost:     'bg-transparent text-text-secondary hover:bg-slate-100',
};

/** Reusable button with variants and built-in loading state */
const Button = ({
  variant = 'primary',
  isLoading = false,
  children,
  disabled,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      {...props}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-2
        px-4 py-2 rounded-lg text-sm font-medium
        transition-colors duration-150
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variantStyles[variant]}
        ${className}
      `}
    >
      {isLoading && <Spinner size="sm" color="currentColor" />}
      {children}
    </button>
  );
};

export default Button;
