import clsx from 'clsx';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'neutral' | 'accent';
  className?: string;
}

const variantStyles = {
  primary: 'bg-primary/15 text-primary border border-primary/30',
  neutral: 'bg-white/10 text-slate-100 border border-white/10',
  accent: 'bg-accent/15 text-accent border border-accent/30'
};

const Badge = ({ children, variant = 'neutral', className }: BadgeProps) => (
  <span
    className={clsx(
      'inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide',
      variantStyles[variant],
      className
    )}
  >
    {children}
  </span>
);

export default Badge;

