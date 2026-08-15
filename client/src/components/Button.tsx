import type { ButtonHTMLAttributes } from 'react';

const VARIANTS = {
  primary: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700',
  secondary: 'bg-green-700 text-white hover:bg-green-900 active:bg-green-900',
  outline: 'border border-green-700 text-green-700 hover:bg-green-100',
  ghost: 'text-ink hover:bg-green-100',
  danger: 'text-red-500 hover:bg-red-100',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-sm',
  lg: 'px-7 py-3.5 text-base',
};

type ButtonVariant = keyof typeof VARIANTS;
type ButtonSize = keyof typeof SIZES;

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center justify-center gap-2 rounded-sm font-semibold tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50';
  return (
    <button
      type={type}
      className={`${base} ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...props}
    />
  );
}
