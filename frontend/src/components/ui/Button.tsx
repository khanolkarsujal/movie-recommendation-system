/**
 * Button Component
 * 5 variants × 3 sizes × states
 */

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'brand' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary: 'bg-white text-[var(--text-on-light)] hover:bg-white/90',
  secondary: 'bg-[rgba(109,109,110,0.7)] text-white hover:bg-[rgba(109,109,110,0.8)]',
  ghost: 'bg-transparent text-white border border-[var(--border-strong)] hover:border-white/40',
  brand: 'bg-[var(--brand-purple)] text-white hover:opacity-90 shadow-[var(--shadow-button)]',
  danger: 'bg-[#ef4444] text-white hover:bg-[#dc2626]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'h-9 px-4 text-[13px]',
  md: 'h-11 px-6 text-[14px]',
  lg: 'h-[52px] px-8 text-[16px]',
};

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  children,
  className = '',
  ...props
}) => {
  return (
    <button
      disabled={disabled || loading}
      className={`
        rounded-[5px]
        font-semibold
        inline-flex items-center justify-center gap-2
        transition-all duration-200
        outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-purple)]
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-[0.98]'}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <svg
            className="animate-spin h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <span className="opacity-70">Loading...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
