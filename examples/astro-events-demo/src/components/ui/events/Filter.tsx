import { Filter as FilterPrimitive } from '@wix/headless-components/react';
import React from 'react';
import { cn } from '@/lib/utils';

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

/**
 * Single selection filter component.
 *
 * @component
 */
export const FilterOptionSingle = React.forwardRef<
  React.ElementRef<typeof FilterPrimitive.FilterOption.SingleFilter>,
  React.ComponentPropsWithoutRef<
    typeof FilterPrimitive.FilterOption.SingleFilter
  >
>(({ className, ...props }, ref) => {
  return (
    <FilterPrimitive.FilterOption.SingleFilter
      {...props}
      ref={ref}
      className={cn('font-paragraph text-foreground', className)}
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
        '[&_button]:px-3 [&_button]:py-1.5 [&_button]:border [&_button]:border-secondary [&_button]:rounded-full [&_button]:bg-background',
        '[&_button[data-state=on]]:bg-primary [&_button[data-state=on]]:text-primary-foreground [&_button[data-state=on]]:border-primary',
        className
      )}
    />
  );
});

FilterOptionMulti.displayName = 'FilterOptionMulti';
