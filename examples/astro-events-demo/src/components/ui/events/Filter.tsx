import { Filter as FilterPrimitive } from '@wix/headless-components/react';
import React from 'react';
import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

/**
 * Root component for filter display and interaction.
 * Provides context for all filter related components.
 *
 * @component
 * @example
 * ```tsx
 * <Filter
 *   value={filter}
 *   onChange={onChange}
 *   onFilterChange={onFilterChange}
 *   filterOptions={filterOptions}
 * >
 *   <FilterOptions>
 *     <FilterOptionRepeater>
 *       <FilterOptionSingle />
 *       <FilterOptionMulti />
 *     </FilterOptionRepeater>
 *   </FilterOptions>
 * </Filter>
 * ```
 */
export const Filter = FilterPrimitive.Root;

/**
 * Container for filter options.
 * Groups all available filters.
 *
 * @component
 */
export const FilterOptions = React.forwardRef<
  React.ElementRef<typeof FilterPrimitive.FilterOptions>,
  React.ComponentPropsWithoutRef<typeof FilterPrimitive.FilterOptions>
>(({ className, ...props }) => {
  return <FilterPrimitive.FilterOptions {...props} className={cn(className)} />;
});

FilterOptions.displayName = 'FilterOptions';

/**
 * Repeater for individual filter options.
 * Renders each filter option in the list.
 *
 * @component
 */
export const FilterOptionRepeater = FilterPrimitive.FilterOptionRepeater;

const filterOptionSingleVariants = cva('font-paragraph text-foreground', {
  variants: {
    variant: {
      tabs: 'flex [&_button]:px-2 [&_button]:border-b-4 [&_button]:border-transparent [&_button[data-state=on]]:border-primary [&_button]:-mb-px [&_button[data-state=on]]:relative [&_button]:font-light [&_button]:bg-transparent hover:[&_button]:text-primary/80',
    },
  },
});

export interface FilterOptionSingleProps
  extends React.ComponentPropsWithoutRef<
      typeof FilterPrimitive.FilterOption.SingleFilter
    >,
    VariantProps<typeof filterOptionSingleVariants> {}

/**
 * Single selection filter component with style variants.
 *
 * @component
 * @example
 * ```tsx
 * // Default styling (inherits base styles)
 * <FilterOptionSingle />
 *
 * // Tab-like styling with border indicators
 * <FilterOptionSingle variant="tabs" />
 * ```
 */
export const FilterOptionSingle = React.forwardRef<
  React.ElementRef<typeof FilterPrimitive.FilterOption.SingleFilter>,
  FilterOptionSingleProps
>(({ className, variant, ...props }, ref) => {
  return (
    <FilterPrimitive.FilterOption.SingleFilter
      {...props}
      ref={ref}
      className={cn(filterOptionSingleVariants({ variant }), className)}
    />
  );
});

FilterOptionSingle.displayName = 'FilterOptionSingle';

/**
 * Multiple selection filter component.
 *
 * @component
 */
export const FilterOptionMulti = React.forwardRef<
  React.ElementRef<typeof FilterPrimitive.FilterOption.MultiFilter>,
  React.ComponentPropsWithoutRef<
    typeof FilterPrimitive.FilterOption.MultiFilter
  >
>(({ className, ...props }, ref) => {
  return (
    <FilterPrimitive.FilterOption.MultiFilter
      {...props}
      ref={ref}
      className={cn(
        'text-sm font-paragraph text-foreground',
        '[&_button]:px-3 [&_button]:py-1.5 [&_button]:border [&_button]:border-foreground/10 [&_button]:rounded-full [&_button]:bg-background',
        '[&_button[data-state=on]]:bg-primary [&_button[data-state=on]]:text-primary-foreground [&_button[data-state=on]]:border-primary',
        className
      )}
    />
  );
});

FilterOptionMulti.displayName = 'FilterOptionMulti';
