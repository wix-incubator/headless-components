/**
 * @fileoverview Filter Primitive Components
 *
 * This module provides unstyled, composable components for building filter controls.
 * These components follow the Radix UI primitive pattern, offering:
 *
 * - **Unstyled**: No default styling, only functional behavior
 * - **Composable**: Support for the `asChild` pattern for flexible DOM structure
 * - **Accessible**: Built-in keyboard navigation and ARIA attributes
 * - **Flexible**: Render props pattern for maximum customization
 *
 * ## Architecture
 *
 * These components are the **primitive layer** that provides platform-agnostic
 * filter functionality without being tied to any specific vertical.
 *
 * ## Usage
 *
 * ```tsx
 * import { Filter } from '@wix/headless-components/react';
 *
 * function FilterControls({ filter, onChange, onFilterChange, filterOptions }) {
 *   return (
 *     <Filter.Root value={filter} onChange={onChange} onFilterChange={onFilterChange} filterOptions={filterOptions}>
 *       <Filter.Filtered>
 *         <Filter.Action.Clear label="Clear Filters" />
 *       </Filter.Filtered>
 *       <Filter.FilterOptions>
 *         <Filter.FilterOptionRepeater>
 *           <Filter.FilterOption.Label />
 *           <Filter.FilterOption.SingleFilter />
 *           <Filter.FilterOption.MultiFilter />
 *           <Filter.FilterOption.RangeFilter />
 *         </Filter.FilterOptionRepeater>
 *       </Filter.FilterOptions>
 *     </Filter.Root>
 *   );
 * }
 * ```
 *
 * @module Filter
 */

import React, { createContext, useContext } from 'react';
import { Slot } from '@radix-ui/react-slot';
import * as Slider from '@radix-ui/react-slider';
import * as ToggleGroup from '@radix-ui/react-toggle-group';
/**
 * Props for button-like components that support the asChild pattern
 */
export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Filter operators that match Wix query.filter format
 */
export interface FilterOperators<T = any> {
  $eq?: T;
  $ne?: T;
  $gt?: T;
  $gte?: T;
  $lt?: T;
  $lte?: T;
  $in?: T[];
  $nin?: T[];
  $exists?: boolean;
  $regex?: string;
  $options?: string;

  // Array operators
  $size?: number;
  $elemMatch?: Record<string, any>;
  $all?: T[];

  // Wix-specific operators (used across all services)
  $hasSome?: T[];
  $hasAll?: T[];
  $startsWith?: string;
  $endsWith?: string;
  $contains?: string;
  $urlized?: string;
  $isEmpty?: boolean;
  $matchItems?: Array<Record<string, any>>;
}

/**
 * Valid filter value types
 */
export type FilterValue<T = any> =
  | T
  | FilterOperators<T>
  | Array<Record<string, any>>;

/**
 * Platform filter object interface - matches query.filter format
 */
export type Filter = {
  [fieldPath: string]: FilterValue;
} | null;

/**
 * Filter option configuration
 */
export interface FilterOption {
  /** Display label for the filter */
  label: string;
  /** Filter key/field name - used as fallback if fieldName is not specified */
  key: string;
  /**
   * Target field name(s) in the filter object:
   * - For single/multi: string (e.g., 'inventory.status')
   * - For range: string[] with [minField, maxField] (e.g., ['price.min', 'price.max'])
   * - If not specified, uses key as fieldName
   */
  fieldName?: string | string[];
  /**
   * Field type determines which operators to use for multi-select filters:
   * - 'array': uses $hasSome operator (for array fields like choices)
   * - 'singular': uses $in operator (for single fields with multiple values)
   * - If not specified, defaults to 'singular'
   */
  fieldType?: 'array' | 'singular';
  /** Current filter value */
  value?: any; // number[] (for range) | string[] (for multi) | string (for single)
  /** Function to format values for display */
  valueFormatter?: (value: string | number) => string;
  /** Valid values for this filter (for validation and shared field logic) */
  validValues?: Array<string | number>;
  /** Filter input type */
  type: 'single' | 'multi' | 'range';
  /** Display type for styling/rendering */
  displayType: 'color' | 'text' | 'range';
  /** Function to format background color for color filters */
  valueBgColorFormatter?: (value: string | number) => string | null;
}

/**
 * TestIds enum for Filter components
 */
enum TestIds {
  filterRoot = 'filter-root',
  filterFiltered = 'filter-filtered',
  filterActionClear = 'filter-action-clear',
  filterOptions = 'filter-options',
  filterOptionRepeater = 'filter-option-repeater',
  filterOption = 'filter-option',
  filterOptionLabel = 'filter-option-label',
  filterOptionSingle = 'filter-option-single',
  filterOptionMulti = 'filter-option-multi',
  filterOptionRange = 'filter-option-range',
}

// ============================================================================
// CONTEXT
// ============================================================================

interface FilterContextValue {
  value: Filter;
  onChange: (value: Filter) => void;
  onFilterChange?: ({
    value,
    key,
  }: {
    value: FilterValue;
    key: string;
  }) => Filter;
  filterOptions: FilterOption[];
  hasFilters: boolean;
  clearFilters: () => void;
}

const FilterContext = createContext<FilterContextValue | null>(null);

function useFilterContext(): FilterContextValue {
  const context = useContext(FilterContext);
  if (!context) {
    throw new Error(
      'useFilterContext must be used within a Filter.Root component',
    );
  }
  return context;
}

interface FilterOptionContextValue {
  option: FilterOption;
  updateFilter: (value: FilterValue) => void;
}

const FilterOptionContext = createContext<FilterOptionContextValue | null>(
  null,
);

function useFilterOptionContext(): FilterOptionContextValue {
  const context = useContext(FilterOptionContext);
  if (!context) {
    throw new Error(
      'useFilterOptionContext must be used within a Filter.FilterOptionRepeater component',
    );
  }
  return context;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Check if any filters are currently active
 */
function hasActiveFilters(
  filter: Filter,
  filterOptions: FilterOption[],
): boolean {
  if (!filter) return false;

  return filterOptions.some((option) => {
    if (option.type === 'range') {
      const extractedValue = rangeFilterGetUIValue(filter, option);
      return (
        Array.isArray(extractedValue) &&
        extractedValue.length > 0 &&
        extractedValue.some((v) => v !== undefined && v !== null)
      );
    }

    if (option.type === 'multi') {
      const extractedValue = multiFilterGetUIValue(filter, option);
      return Array.isArray(extractedValue) && extractedValue.length > 0;
    }

    if (option.type === 'single') {
      const extractedValue = singleFilterGetUIValue(filter, option);
      return (
        extractedValue !== undefined &&
        extractedValue !== null &&
        extractedValue !== ''
      );
    }

    return false;
  });
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Props for the Root component
 */
export interface FilterRootProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Current complete filter value */
  value: Filter;
  /** Function called when the complete filter changes */
  onChange: (value: Filter) => void;
  /**
   * Function called when a single filter option changes.
   * Should merge the single change into the complete filter and return the updated filter.
   * Optional - if not provided, components will handle conversions automatically using fieldName and fieldType.
   */
  onFilterChange?: ({
    value,
    key,
  }: {
    value: FilterValue;
    key: string;
  }) => Filter;
  /** Available filter options */
  filterOptions: FilterOption[];
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
}

/**
 * Root component that provides filter context and manages filter state.
 *
 * @component
 * @example
 * ```tsx
 * <Filter.Root
 *   value={filter}
 *   onChange={setFilter}
 *   filterOptions={[
 *     {
 *       key: 'category',
 *       label: 'Category',
 *       type: 'single',
 *       displayType: 'text',
 *       fieldName: 'category.id'
 *     },
 *     {
 *       key: 'price',
 *       label: 'Price Range',
 *       type: 'range',
 *       displayType: 'range',
 *       fieldName: ['price.min', 'price.max']
 *     },
 *     {
 *       key: 'tags',
 *       label: 'Tags',
 *       type: 'multi',
 *       displayType: 'text',
 *       fieldName: 'tags',
 *       fieldType: 'array'
 *     }
 *   ]}
 * >
 *   <Filter.FilterOptions>
 *     <Filter.FilterOptionRepeater>
 *       <Filter.FilterOption.Label />
 *       <Filter.FilterOption.SingleFilter />
 *     </Filter.FilterOptionRepeater>
 *   </Filter.FilterOptions>
 * </Filter.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, FilterRootProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      onFilterChange,
      filterOptions,
      asChild,
      children,
      ...otherProps
    } = props;

    const hasFilters = hasActiveFilters(value, filterOptions);

    const clearFilters = () => {
      // Clear all filters except for category filter
      onChange({
        ...(value ? {
          'allCategoriesInfo.categories': value['allCategoriesInfo.categories'],
        } : {}),
      });
    };

    const contextValue: FilterContextValue = {
      value,
      onChange,
      onFilterChange,
      filterOptions,
      hasFilters,
      clearFilters,
    };

    // Default div rendering with proper asChild pattern
    const Comp = asChild ? Slot : 'div';

    return (
      <FilterContext.Provider value={contextValue}>
        <Comp
          ref={ref}
          data-testid={TestIds.filterRoot}
          data-has-filters={hasFilters}
          {...otherProps}
        >
          {typeof children === 'function' ? null : children}
        </Comp>
      </FilterContext.Provider>
    );
  },
);

/**
 * Props for the Filtered component
 */
export interface FilterFilteredProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Children to render when filters are active */
  children: React.ReactNode;
}

/**
 * Container that conditionally renders its children when filters are active.
 *
 * @component
 * @example
 * ```tsx
 * <Filter.Filtered>
 *   <div className="bg-surface-card border-surface-primary p-4 rounded">
 *     <p className="text-content-secondary">Active filters:</p>
 *     <Filter.Action.Clear label="Clear All" />
 *   </div>
 * </Filter.Filtered>
 * ```
 */
export const Filtered = ({ children, ...otherProps }: FilterFilteredProps) => {
  const { hasFilters } = useFilterContext();

  if (!hasFilters) return null;

  return (
    <div
      data-testid={TestIds.filterFiltered}
      data-has-filters={hasFilters}
      {...otherProps}
    >
      {children}
    </div>
  );
};

/**
 * Props for the FilterOptions component
 */
export interface FilterOptionsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Children components */
  children: React.ReactNode;
}

/**
 * Container for filter option components.
 *
 * @component
 */
export const FilterOptions = ({
  children,
  ...otherProps
}: FilterOptionsProps) => {
  return (
    <div data-testid={TestIds.filterOptions} {...otherProps}>
      {children}
    </div>
  );
};

/**
 * Props for the FilterOptionRepeater component
 */
export interface FilterOptionRepeaterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** Template to repeat for each filter option */
  children: React.ReactNode;
}

/**
 * Repeater component that renders a template for each filter option.
 *
 * @component
 */
export const FilterOptionRepeater = ({
  children,
  ...otherProps
}: FilterOptionRepeaterProps) => {
  const {
    filterOptions,
    onFilterChange,
    onChange,
    value: filterValue,
  } = useFilterContext();

  return (
    <div data-testid={TestIds.filterOptionRepeater} {...otherProps}>
      {filterOptions.map((option) => {
        // Fallback updateFilter - individual filter components handle their own conversion
        const updateFilter = (value: FilterValue) => {
          if (onFilterChange) {
            const newFilter = onFilterChange({ value, key: option.key });
            onChange(newFilter);
          } else {
            // Fallback to direct assignment for simple cases
            const newFilter = {
              ...(filterValue || {}),
              [option.key]: value,
            };
            onChange(newFilter);
          }
        };

        return (
          <FilterOptionContext.Provider
            key={option.key}
            value={{ option, updateFilter }}
          >
            <div
              data-testid={TestIds.filterOption}
              data-filter-key={option.key}
            >
              {children}
            </div>
          </FilterOptionContext.Provider>
        );
      })}
    </div>
  );
};

// ============================================================================
// ACTION COMPONENTS
// ============================================================================

/**
 * Props for the Clear component
 */
export interface FilterActionClearProps extends ButtonProps {
  /** Label text for the clear button */
  label: string;
  /** Children for custom rendering */
  children?: React.ReactNode;
}

/**
 * Button to clear all active filters.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <Filter.Action.Clear
 *   label="Clear Filters"
 *   className="btn-secondary text-sm px-3 py-1"
 * />
 *
 * // Custom rendering with asChild
 * <Filter.Action.Clear label="Reset All" asChild>
 *   {({ onClick, disabled }) => (
 *     <button
 *       onClick={onClick}
 *       disabled={disabled}
 *       className="text-status-danger hover:text-status-danger-hover underline disabled:text-content-muted disabled:no-underline"
 *     >
 *       ✕ Reset All Filters
 *     </button>
 *   )}
 * </Filter.Action.Clear>
 * ```
 */
export const Clear = React.forwardRef<
  HTMLButtonElement,
  FilterActionClearProps
>((props, ref) => {
  const { label, asChild, children, ...otherProps } = props;
  const { hasFilters, clearFilters } = useFilterContext();

  // Use the same pattern as MediaGallery components
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      onClick={clearFilters}
      disabled={!hasFilters}
      data-testid={TestIds.filterActionClear}
      {...otherProps}
    >
      {children || label}
    </Comp>
  );
});

// ============================================================================
// FILTER OPTION COMPONENTS
// ============================================================================

/**
 * Props for the FilterOptionLabel component
 */
export interface FilterOptionLabelProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}

/**
 * Label component for filter options.
 *
 * @component
 */
export const FilterOptionLabel = React.forwardRef<
  HTMLDivElement,
  FilterOptionLabelProps
>((props, ref) => {
  const { asChild, children, ...otherProps } = props;
  const { option } = useFilterOptionContext();

  // Use the same pattern as MediaGallery components
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp ref={ref} data-testid={TestIds.filterOptionLabel} {...otherProps}>
      {children || option.label}
    </Comp>
  );
});

/**
 * Props for single filter components
 */
export interface SingleFilterProps extends React.HTMLAttributes<HTMLElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}

/**
 * Single selection filter component.
 *
 * @component
 */
export const SingleFilter = React.forwardRef<HTMLElement, SingleFilterProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const { option } = useFilterOptionContext();
    const { value: filterValue, onChange } = useFilterContext();

    if (option.type !== 'single') return null;

    // Single-specific updateFilter function that handles its own conversion
    const updateFilter = React.useCallback(
      (uiValue: string) => {
        const newFilter = singleFilterUiValueToFilter(
          uiValue,
          option,
          filterValue || {},
        );
        onChange(newFilter);
      },
      [option, filterValue, onChange],
    );

    // Extract single value from search filter format
    let currentValue = '';

    if (filterValue) {
      currentValue = singleFilterGetUIValue(filterValue, option);
    }

    // Default rendering - Radix ToggleGroup for better UX
    if (!asChild && !children) {
      return (
        <ToggleGroup.Root
          type="single"
          value={currentValue}
          onValueChange={(value) => updateFilter(value || '')}
          data-testid={TestIds.filterOptionSingle}
          data-filter-type="single"
          data-display-type={option.displayType}
          className={otherProps.className}
        >
          {option.validValues?.map((value) => (
            <ToggleGroup.Item key={value} value={String(value)}>
              {option.valueFormatter ? option.valueFormatter(value) : value}
            </ToggleGroup.Item>
          ))}
        </ToggleGroup.Root>
      );
    }

    // Custom rendering with asChild/children - fallback to select
    if (asChild) {
      return (
        <Slot
          ref={ref}
          data-testid={TestIds.filterOptionSingle}
          data-filter-type="single"
          data-display-type={option.displayType}
          {...otherProps}
        >
          {children}
        </Slot>
      );
    }

    return (
      <select
        ref={ref as React.Ref<HTMLSelectElement>}
        value={currentValue}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          updateFilter(e.target.value)
        }
        data-testid={TestIds.filterOptionSingle}
        data-filter-type="single"
        data-display-type={option.displayType}
        className={otherProps.className}
      >
        {children || (
          <>
            <option value="">Select {option.label}</option>
            {option.validValues?.map((value) => (
              <option key={value} value={value}>
                {option.valueFormatter ? option.valueFormatter(value) : value}
              </option>
            ))}
          </>
        )}
      </select>
    );
  },
);

/**
 * Props for multi filter components
 */
export interface MultiFilterProps extends React.HTMLAttributes<HTMLElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;

}

/**
 * Multi-selection filter component.
 *
 * @component
 */
export const MultiFilter = React.forwardRef<HTMLElement, MultiFilterProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const { option } = useFilterOptionContext();
    const { value: filterValue, onChange } = useFilterContext();

    if (option.type !== 'multi') return null;

    // Multi-specific updateFilter function that handles its own conversion
    const updateFilter = React.useCallback(
      (uiValue: string[]) => {
        const newFilter = multiFilterUiValueToFilter(
          uiValue,
          option,
          filterValue || {},
        );
        onChange(newFilter);
      },
      [option, filterValue, onChange],
    );

    // Extract array value from search filter format
    let currentValue: string[] = [];

    if (filterValue) {
      currentValue = multiFilterGetUIValue(filterValue, option);
    }

    // Use the same pattern as MediaGallery components
    const Comp = asChild ? Slot : 'div';

    // Default rendering - Radix ToggleGroup for better UX
    if (!asChild && !children) {
      return (
        <ToggleGroup.Root
          type="multiple"
          value={currentValue}
          onValueChange={updateFilter}
          data-testid={TestIds.filterOptionMulti}
          data-filter-type="multi"
          data-display-type={option.displayType}
          className={otherProps.className}
        >
          {option.validValues?.map((value) => {
            const formattedValue = option.valueFormatter
              ? option.valueFormatter(value)
              : String(value);
            return (
              <ToggleGroup.Item
                key={value}
                value={String(value)}
                data-color={
                  option.displayType === 'color'
                    ? formattedValue.toLowerCase()
                    : undefined
                }
                style={{
                  backgroundColor: option.valueBgColorFormatter
                    ? option.valueBgColorFormatter(value)!
                    : undefined,
                }}
                aria-label={formattedValue}
              >
                {formattedValue}
              </ToggleGroup.Item>
            );
          })}
        </ToggleGroup.Root>
      );
    }

    // Custom rendering with asChild/children
    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        data-testid={TestIds.filterOptionMulti}
        data-filter-type="multi"
        data-display-type={option.displayType}
        {...otherProps}
      >
        {children || (
          <>
            {option.validValues?.map((value) => (
              <label key={value}>
                <input
                  type="checkbox"
                  checked={currentValue.includes(String(value))}
                  onChange={(e) => {
                    const stringValue = String(value);
                    const newValue = e.target.checked
                      ? [...currentValue, stringValue]
                      : currentValue.filter((v: string) => v !== stringValue);
                    updateFilter(newValue);
                  }}
                />
                {option.valueFormatter ? option.valueFormatter(value) : value}
              </label>
            ))}
          </>
        )}
      </Comp>
    );
  },
);

/**
 * Props for range filter components
 */
export interface RangeFilterProps extends React.HTMLAttributes<HTMLElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children for custom rendering */
  children?: React.ReactNode;
}

function rangeFilterGetUIValue(
  value: FilterValue,
  option: FilterOption,
): number[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  let min: number | undefined;
  let max: number | undefined;

  if (Array.isArray(option.fieldName) && option.fieldName.length >= 2) {
    // Two separate fields for min and max
    const [minFieldName, maxFieldName] = option.fieldName as [string, string];
    const minField = value[minFieldName];
    const maxField = value[maxFieldName];

    // Extract min value (typically stored as $gte)
    if (minField && typeof minField === 'object' && '$gte' in minField) {
      min = Number(minField.$gte);
    } else if (typeof minField === 'number') {
      min = minField;
    }

    // Extract max value (typically stored as $lte)
    if (maxField && typeof maxField === 'object' && '$lte' in maxField) {
      max = Number(maxField.$lte);
    } else if (typeof maxField === 'number') {
      max = maxField;
    }
  } else if (typeof option.fieldName === 'string') {
    // Single field with both $gte and $lte
    const fieldName = option.fieldName;
    const field = value[fieldName];

    if (field && typeof field === 'object') {
      if ('$gte' in field) {
        min = Number(field.$gte);
      }
      if ('$lte' in field) {
        max = Number(field.$lte);
      }
    } else if (typeof field === 'number') {
      min = max = field;
    }
  }

  const result: number[] = [];
  if (min !== undefined) result.push(min);
  if (max !== undefined) result.push(max);

  return result;
}

function rangeFilterUiValueToFilter(
  uiValue: number[],
  option: FilterOption,
  currentFilter: FilterValue,
): any {
  const newFilter = { ...currentFilter };

  if (!option.fieldName) {
    // If no fieldName provided, can't convert
    return newFilter;
  }

  if (Array.isArray(uiValue) && uiValue.length >= 2) {
    const [min, max] = uiValue;

    if (Array.isArray(option.fieldName) && option.fieldName.length >= 2) {
      // Two separate fields for min and max
      const [minFieldName, maxFieldName] = option.fieldName as [string, string];

      // Set min value with $gte operator
      if (min !== undefined && min !== null) {
        newFilter[minFieldName] = { $gte: min };
      } else {
        delete newFilter[minFieldName];
      }

      // Set max value with $lte operator
      if (max !== undefined && max !== null) {
        newFilter[maxFieldName] = { $lte: max };
      } else {
        delete newFilter[maxFieldName];
      }
    } else if (typeof option.fieldName === 'string') {
      // Single field with both $gte and $lte
      const fieldName = option.fieldName;
      const rangeFilter: any = {};

      if (min !== undefined && min !== null) {
        rangeFilter.$gte = min;
      }

      if (max !== undefined && max !== null) {
        rangeFilter.$lte = max;
      }

      if (Object.keys(rangeFilter).length > 0) {
        newFilter[fieldName] = rangeFilter;
      } else {
        delete newFilter[fieldName];
      }
    }
  } else {
    // Clear range filter if no valid range
    if (Array.isArray(option.fieldName) && option.fieldName.length >= 2) {
      const [minFieldName, maxFieldName] = option.fieldName as [string, string];
      delete newFilter[minFieldName];
      delete newFilter[maxFieldName];
    } else if (typeof option.fieldName === 'string') {
      delete newFilter[option.fieldName];
    }
  }

  return newFilter;
}

function singleFilterGetUIValue(
  value: FilterValue,
  option: FilterOption,
): string {
  if (!value || typeof value !== 'object') {
    return '';
  }

  const fieldName =
    typeof option.fieldName === 'string' ? option.fieldName : option.key;
  const field = value[fieldName];

  if (field !== undefined && field !== null) {
    return String(field);
  }

  return '';
}

function singleFilterUiValueToFilter(
  uiValue: string,
  option: FilterOption,
  currentFilter: FilterValue,
): any {
  const newFilter = { ...currentFilter };
  const fieldName =
    typeof option.fieldName === 'string' ? option.fieldName : option.key;

  if (uiValue && uiValue.trim() !== '') {
    newFilter[fieldName] = uiValue;
  } else {
    delete newFilter[fieldName];
  }

  return newFilter;
}

function extractArrayFromOperators(
  field: any,
  preferredOperator: string,
): string[] {
  if (!field || typeof field !== 'object') return [];

  const operators = [preferredOperator, '$in', '$hasSome'].filter(Boolean);
  for (const op of operators) {
    if (op in field && Array.isArray(field[op])) {
      return field[op].map(String);
    }
  }
  return [];
}

function multiFilterGetUIValue(
  value: FilterValue,
  option: FilterOption,
): string[] {
  if (!value || typeof value !== 'object') {
    return [];
  }

  const fieldName =
    typeof option.fieldName === 'string' ? option.fieldName : option.key;
  const field = value[fieldName];

  // Special handling for shared fields (like product options)
  if (
    fieldName === 'options.choicesSettings.choices.choiceId' &&
    option.validValues
  ) {
    // This is a shared field that needs filtering by validValues
    if (
      field &&
      typeof field === 'object' &&
      '$hasSome' in field &&
      Array.isArray(field.$hasSome)
    ) {
      const allSelectedChoices = field.$hasSome.map(String);
      // Filter to only include choices that belong to this specific option
      const choicesForThisOption = Array.isArray(option.validValues)
        ? option.validValues.map(String)
        : [];
      return allSelectedChoices.filter((choiceId: string) =>
        choicesForThisOption.includes(choiceId),
      );
    }
    return [];
  }

  // Standard logic for non-shared fields
  if (Array.isArray(field)) {
    return field.map(String);
  } else if (field && typeof field === 'object') {
    // Handle operators based on fieldType preference
    const preferredOperator = option.fieldType === 'array' ? '$hasSome' : '$in';
    const result = extractArrayFromOperators(field, preferredOperator);
    if (result.length > 0) return result;
  } else if (field !== undefined && field !== null) {
    return [String(field)];
  }

  return [];
}

function multiFilterUiValueToFilter(
  uiValue: string[],
  option: FilterOption,
  currentFilter: FilterValue,
): any {
  const newFilter = { ...currentFilter };
  const fieldName =
    typeof option.fieldName === 'string' ? option.fieldName : option.key;

  // Special handling for shared fields (like product options)
  if (
    fieldName === 'options.choicesSettings.choices.choiceId' &&
    option.validValues
  ) {
    // This is a shared field that needs merging logic
    const existingField = newFilter[fieldName];
    let existingChoices: string[] = [];

    // Extract existing choices
    if (
      existingField &&
      typeof existingField === 'object' &&
      '$hasSome' in existingField
    ) {
      existingChoices = Array.isArray(existingField.$hasSome)
        ? [...existingField.$hasSome]
        : [];
    }

    // Remove choices for this specific option (based on validValues)
    const choicesForThisOption = Array.isArray(option.validValues)
      ? option.validValues.map(String)
      : [];
    existingChoices = existingChoices.filter(
      (choiceId: string) => !choicesForThisOption.includes(choiceId),
    );

    // Add new choices for this option
    if (Array.isArray(uiValue) && uiValue.length > 0) {
      existingChoices.push(...uiValue);
    }

    // Update the filter
    if (existingChoices.length > 0) {
      newFilter[fieldName] = { $hasSome: existingChoices };
    } else {
      delete newFilter[fieldName];
    }
  } else {
    // Standard logic for non-shared fields
    if (Array.isArray(uiValue) && uiValue.length > 0) {
      // Use operator based on fieldType
      if (option.fieldType === 'array') {
        newFilter[fieldName] = { $hasSome: uiValue };
      } else {
        // Default to $in for 'singular' or undefined fieldType
        newFilter[fieldName] = { $in: uiValue };
      }
    } else {
      delete newFilter[fieldName];
    }
  }

  return newFilter;
}

/**
 * Range filter component for numeric ranges.
 *
 * Features smooth slider interaction by using local state during dragging
 * and only committing changes when the user releases the handle.
 *
 * @component
 */
export const RangeFilter = React.forwardRef<HTMLElement, RangeFilterProps>(
  (props, ref) => {
    const { asChild, children, ...otherProps } = props;
    const { option } = useFilterOptionContext();
    const { value: filterValue, onChange } = useFilterContext();

    if (option.type !== 'range') return null;

    const numericValidValues = (option.validValues as number[]) || [];

    // Range-specific updateFilter function that handles its own conversion
    const updateFilter = React.useCallback(
      (uiValue: number[]) => {
        const newFilter = rangeFilterUiValueToFilter(
          uiValue,
          option,
          filterValue || {},
        );
        onChange(newFilter);
      },
      [option, filterValue, onChange],
    );

    // Extract range value from search filter format
    let currentValue: number[] = [];

    if (filterValue) {
      currentValue = rangeFilterGetUIValue(filterValue, option);
    }

    // Ensure we have a valid range
    if (currentValue.length === 0) {
      currentValue = [
        numericValidValues[0] || 0,
        numericValidValues[numericValidValues.length - 1] || 100,
      ];
    }

    // Use the same pattern as MediaGallery components
    const Comp = asChild ? Slot : 'div';

    // Default rendering - Radix Slider for better UX
    const minBound = numericValidValues[0] || 0;
    const maxBound = numericValidValues[numericValidValues.length - 1] || 100;
    const minValue = currentValue[0] || minBound;
    const maxValue = currentValue[1] || maxBound;

    // Local state for smooth slider interaction
    const [localValue, setLocalValue] = React.useState([minValue, maxValue]);

    // Update local state when external value changes
    React.useEffect(() => {
      setLocalValue([minValue, maxValue]);
    }, [minValue, maxValue]);

    if (!asChild && !children) {
      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          data-testid={TestIds.filterOptionRange}
          data-filter-type="range"
          data-display-type={option.displayType}
          className={otherProps.className}
        >
          <Slider.Root
            value={localValue}
            onValueChange={setLocalValue}
            onValueCommit={updateFilter}
            min={minBound}
            max={maxBound}
            step={1}
          >
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb />
            <Slider.Thumb />
          </Slider.Root>
          <div>
            <span data-range-value="min">
              {option.valueFormatter
                ? option.valueFormatter(localValue[0] ?? minBound)
                : (localValue[0] ?? minBound)}
            </span>
            <span data-range-value="max">
              {option.valueFormatter
                ? option.valueFormatter(localValue[1] ?? maxBound)
                : (localValue[1] ?? maxBound)}
            </span>
          </div>
        </div>
      );
    }

    // Custom rendering with asChild/children - fallback to inputs
    return (
      <Comp
        ref={ref as React.Ref<HTMLDivElement>}
        data-testid={TestIds.filterOptionRange}
        data-filter-type="range"
        data-display-type={option.displayType}
        {...otherProps}
      >
        {children || (
          <>
            <input
              type="number"
              value={minValue}
              onChange={(e) => updateFilter([Number(e.target.value), maxValue])}
              placeholder="Min"
            />
            <span>to</span>
            <input
              type="number"
              value={maxValue}
              onChange={(e) => updateFilter([minValue, Number(e.target.value)])}
              placeholder="Max"
            />
          </>
        )}
      </Comp>
    );
  },
);

// ============================================================================
// EXPORTS WITH NAMESPACING
// ============================================================================

/**
 * Action components namespace
 */
export const Action = {
  Clear,
};

/**
 * FilterOption components namespace
 */
export const FilterOption = {
  Label: FilterOptionLabel,
  SingleFilter,
  MultiFilter,
  RangeFilter,
};

// Set display names for debugging
Root.displayName = 'Filter.Root';
Filtered.displayName = 'Filter.Filtered';
FilterOptions.displayName = 'Filter.FilterOptions';
FilterOptionRepeater.displayName = 'Filter.FilterOptionRepeater';
Clear.displayName = 'Filter.Action.Clear';
FilterOptionLabel.displayName = 'Filter.FilterOption.Label';
SingleFilter.displayName = 'Filter.FilterOption.SingleFilter';
MultiFilter.displayName = 'Filter.FilterOption.MultiFilter';
RangeFilter.displayName = 'Filter.FilterOption.RangeFilter';
