import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const emptyStateVariants = cva(
  'bg-surface-card border-surface-subtle rounded-xl border px-6 py-12 text-center shadow-sm',
  {
    variants: {
      size: {
        sm: 'py-8',
        md: 'py-12',
        lg: 'py-16',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  showIcon?: boolean;
}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  (
    { className, size, title, subtitle, icon, showIcon = true, ...props },
    ref,
  ) => {
    const defaultIcon = (
      <div className="text-content-muted mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full">
        <svg
          className="h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
          />
        </svg>
      </div>
    );

    return (
      <div
        className={cn(emptyStateVariants({ size, className }))}
        ref={ref}
        {...props}
      >
        {showIcon && (icon || defaultIcon)}

        <h3 className="text-content-primary mb-4 text-2xl font-semibold">
          {title}
        </h3>

        {subtitle && <p className="text-content-muted">{subtitle}</p>}
      </div>
    );
  },
);

EmptyState.displayName = 'EmptyState';
