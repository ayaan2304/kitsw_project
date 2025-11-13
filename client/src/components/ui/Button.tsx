import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import clsx from 'clsx';

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'soft';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  loading?: boolean;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-gradient-to-tr from-primary to-secondary text-white shadow-soft-lg hover:opacity-95 focus-visible:ring-primary/50',
  secondary:
    'bg-slate-900/70 text-slate-100 border border-white/10 hover:border-primary/60 focus-visible:ring-secondary/40',
  ghost:
    'bg-transparent text-slate-200 hover:bg-white/5 focus-visible:ring-white/10 border border-transparent',
  soft:
    'bg-white/10 text-white hover:bg-white/15 border border-white/10 focus-visible:ring-secondary/40'
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-sm',
  lg: 'px-5 py-2.5 text-base'
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', icon, loading, disabled, className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={clsx(
          'inline-flex items-center justify-center gap-2 rounded-full font-semibold tracking-wide transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950',
          variantClasses[variant],
          sizeClasses[size],
          loading && 'cursor-progress opacity-80',
          disabled && 'pointer-events-none opacity-50',
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <span className="inline-flex h-4 w-4 animate-spin rounded-full border-2 border-white/20 border-t-white" />
        )}
        {icon}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;

