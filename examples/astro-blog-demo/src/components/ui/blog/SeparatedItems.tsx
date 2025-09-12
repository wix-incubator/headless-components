import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const separatedItemsVariants = cva('flex items-center gap-2', {
  variants: {
    variant: {
      compact:
        'gap-2 [&>*:not(:first-child)]:before:mr-2 [&>*:not(:first-child)]:before:content-["•"]',
      detailed:
        'flex-wrap gap-3 [&>*:not(:first-child)]:before:mr-2 [&>*:not(:first-child)]:before:content-["•"]',
      minimal: 'gap-1',
    },
    layout: {
      horizontal: 'flex-row',
      vertical: 'flex-col gap-1',
    },
  },
  defaultVariants: {
    variant: 'compact',
    layout: 'horizontal',
  },
});

export interface SeparatedItemsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof separatedItemsVariants> {
  children: React.ReactNode;
}

export const SeparatedItems = React.forwardRef<
  HTMLDivElement,
  SeparatedItemsProps
>(({ className, variant, layout, children, ...props }, ref) => {
  return (
    <div
      className={cn(separatedItemsVariants({ variant, layout, className }))}
      ref={ref}
      {...props}
    >
      {children}
    </div>
  );
});

SeparatedItems.displayName = 'SeparatedItems';
