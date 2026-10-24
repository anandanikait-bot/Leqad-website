import React from 'react';
import { Link, type LinkProps } from 'react-router-dom';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'rust' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const classes = buttonClasses(variant, size, className);

  return (
    <button
      className={classes}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};

function buttonClasses(variant: NonNullable<ButtonProps['variant']>, size: NonNullable<ButtonProps['size']>, className: string) {
  const baseClasses =
    'inline-flex items-center justify-center font-medium transition-colors duration-150 rounded-md focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[#0E2943] focus-visible:ring-offset-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantClasses = {
    primary:
      'bg-[#0E2943] text-white hover:bg-[#163859] active:bg-[#0A1F33] shadow-xs',
    rust:
      'bg-[#793327] text-white hover:bg-[#62281F] active:bg-[#54221A] shadow-xs',
    secondary:
      'bg-white text-[#0E2943] border border-[#D9DDD9] hover:bg-[#FAF8F4] hover:border-[#55616B]/40 active:bg-[#F5EFE7] shadow-2xs',
    outline:
      'bg-transparent text-[#0E2943] border border-[#0E2943]/20 hover:bg-[#0E2943]/5 active:bg-[#0E2943]/10',
    ghost:
      'bg-transparent text-[#55616B] hover:text-[#0E2943] hover:bg-[#0E2943]/5 active:bg-[#0E2943]/10',
  };

  return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;
}

interface ButtonLinkProps extends Omit<LinkProps, 'children'> {
  variant?: ButtonProps['variant'];
  size?: ButtonProps['size'];
  children: React.ReactNode;
  icon?: React.ReactNode;
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, icon, ...props }: ButtonLinkProps) {
  return <Link className={buttonClasses(variant, size, className)} {...props}><span>{children}</span>{icon && <span className="shrink-0" aria-hidden="true">{icon}</span>}</Link>;
}
