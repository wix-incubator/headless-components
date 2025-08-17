/**
 * @fileoverview Sort Primitive Components
 *
 * This module provides unstyled, composable components for building sort controls.
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
 * sort functionality without being tied to any specific vertical.
 *
 * ## Usage
 *
 * ```tsx
 * import { Sort } from '@wix/headless-components/react';
 *
 * // Declarative API
 * function SortControls({ sortOptions, value, onChange }) {
 *   return (
 *     <Sort.Root
 *       value={value}
 *       onChange={onChange}
 *       sortOptions={sortOptions}
 *       as="select"
 *     />
 *   );
 * }
 *
 * // Programmatic API
 * function CustomSort({ value, onChange }) {
 *   return (
 *     <Sort.Root value={value} onChange={onChange}>
 *       <Sort.Option fieldName="price" order="asc" label="Price: Low to High" />
 *       <Sort.Option fieldName="price" order="desc" label="Price: High to Low" />
 *     </Sort.Root>
 *   );
 * }
 * ```
 *
 * @module Sort
 */

import React, { createContext, useContext } from "react";
import { Slot } from "@radix-ui/react-slot";
/**
 * Props for button-like components that support the asChild pattern
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Wix SDK sort array format - the only sort format we support
 */
export type SortValue = Array<{
  fieldName?: string;
  order?: string; // Wix SDK format (typically 'ASC'/'DESC')
}>;

/**
 * Sort option configuration
 */
export interface SortOption {
  /** Field name to sort by (optional if only setting order) */
  fieldName: string;
  /** Sort order (optional if only setting field) */
  order: 'ASC' | 'DESC';
  /** Display label */
  label: string;
}

/**
 * Internal sort option structure with handler for rendering
 */
interface SortOptionRenderable {
  /** Field name to sort by */
  fieldName: string;
  /** Sort order */
  order: 'ASC' | 'DESC';
  /** Display label */
  label: string;
  /** Function to select this option */
  onSelect: () => void;
}

/**
 * TestIds enum for Sort components
 */
enum TestIds {
  sortRoot = "sort-root",
  sortOption = "sort-option",
}

// ============================================================================
// CONTEXT
// ============================================================================

interface SortContextValue {
  currentSort: { fieldName: string; order: string };
  onChange: (value: SortValue) => void;
}

const SortContext = createContext<SortContextValue | null>(null);

function useSortContext(): SortContextValue {
  const context = useContext(SortContext);
  if (!context) {
    throw new Error("useSortContext must be used within a Sort.Root component");
  }
  return context;
}

// ============================================================================
// COMPONENTS
// ============================================================================

/**
 * Props for the Root component
 */
export interface SortRootProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /** Predefined sort options for declarative API */
  sortOptions?: Array<{
    label: string;
    fieldName: string;
    order: 'ASC' | 'DESC';
  }>;
  /** Current sort value - Wix SDK array format */
  value?: SortValue;
  /** Function called when sort changes - receives Wix SDK array format */
  onChange: (value: SortValue) => void;
  /** Render mode - 'select' uses Radix UI Select, 'list' provides render props (default: 'select') */
  as?: 'select' | 'list';
  /** Children components */
  children?: React.ReactNode;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
}

/**
 * Props for the Option component
 */
export interface SortOptionProps {
  /** Field name to sort by (optional if only setting order) */
  fieldName: string;
  /** Sort order (optional if only setting field) */
  order: 'ASC' | 'DESC';
  /** Display label */
  label: string;
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components */
  children?: React.ReactNode;
}

/**
 * Internal component for rendering native HTML select element
 */
interface SelectRendererProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  currentSort: { fieldName: string; order: string };
  options: SortOptionRenderable[];
  onChange: (fieldName: string, order: string) => void;
}

const SelectRenderer = React.forwardRef<HTMLSelectElement, SelectRendererProps>(
  (props, ref) => {
    const { currentSort, options, onChange, ...otherProps } = props;
    const currentValue = `${currentSort.fieldName}-${currentSort.order}`;

    return (
      <select
        ref={ref}
        value={currentValue}
        onChange={(e) => {
          const [fieldName, order] = e.target.value.split('-');
          onChange(fieldName || '', order || 'ASC');
        }}
        {...otherProps}
      >
        {options.map((option, index) => (
          <option
            key={`${option.fieldName}-${option.order}-${index}`}
            value={`${option.fieldName}-${option.order}`}
          >
            {option.label}
          </option>
        ))}
      </select>
    );
  }
);

SelectRenderer.displayName = "Sort.SelectRenderer";

/**
 * Root component that provides sort context and can render as select or custom controls.
 * Supports both declarative (sortOptions prop) and programmatic (children) APIs.
 *
 * @component
 * @example
 * ```tsx
 * // Declarative API with native select
 * <Sort.Root
 *   value={sort}
 *   onChange={setSort}
 *   sortOptions={[
 *     { fieldName: 'price', label: 'Price: Low to High', order: 'ASC' },
 *     { fieldName: 'price', label: 'Price: High to Low', order: 'DESC' },
 *   ]}
 *   as="select"
 *   className="w-full"
 * />
 *
 * // Custom component replacing the entire Sort root
 * <Sort.Root
 *   value={sort}
 *   onChange={setSort}
 *   sortOptions={sortOptions}
 *   asChild
 * >
 *   <CustomSortComponent />
 * </Sort.Root>
 *
 * // List mode with custom buttons
 * <Sort.Root value={sort} onChange={setSort} as="list">
 *   <Sort.Option fieldName="price" order="ASC" label="Price ↑" />
 *   <Sort.Option fieldName="price" order="DESC" label="Price ↓" />
 * </Sort.Root>
 *
 * // Custom list container with asChild
 * <Sort.Root value={sort} onChange={setSort} as="list" asChild>
 *   <div className="custom-sort-container">
 *     <Sort.Option fieldName="price" order="ASC" label="Price ↑" />
 *     <Sort.Option fieldName="price" order="DESC" label="Price ↓" />
 *   </div>
 * </Sort.Root>
 * ```
 */
// Helper function to get current sort from array or default to first option
const getCurrentSort = (sortArray: SortValue | undefined, fallbackOptions: Array<{ fieldName: string; order: 'ASC' | 'DESC'; label?: string }>): { fieldName: string; order: string } => {
  const currentSort = sortArray?.find(sort => sort) || fallbackOptions[0];

  return {
    fieldName: currentSort?.fieldName || 'name',
    order: currentSort?.order || 'ASC'
  };
};

export const Root = React.forwardRef<HTMLElement, SortRootProps>(
  (props, ref) => {
    const {
      value,
      onChange,
      sortOptions = [],
      as = 'select',
      asChild,
      children,
      ...otherProps
    } = props;

    // Get current sort from sortOptions directly
    const currentSort = getCurrentSort(value, sortOptions);

    // Handle change events - create Wix SDK array format
    const handleChange = (fieldName: string, order: string) => {
      onChange([{ fieldName, order }]);
    };

    // Use EITHER sortOptions prop OR extract from children - not both
    let completeOptions: SortOptionRenderable[] = [];

    if (sortOptions.length > 0) {
      // Use sortOptions prop (declarative API)
      completeOptions = sortOptions.map(option => {
        return {
          fieldName: option.fieldName,
          label: option.label,
          order: option.order,
          onSelect: () => handleChange(option.fieldName, option.order),
        };
      });
    } else if (children) {
      // Extract options from children (programmatic API)
      React.Children.forEach(children, (child) => {
        if (React.isValidElement(child)) {
          // Check if it's the primitive Option or a styled wrapper containing it
          const isOption = child.type === Option ||
            (child.type && typeof child.type === 'function' && child.props?.fieldName !== undefined);

          if (isOption) {
            const { fieldName, order, label } = child.props;
            if (fieldName && label) {
              completeOptions.push({
                fieldName,
                order,
                label,
                onSelect: () => handleChange(fieldName, order),
              });
            }
          }
        }
      });
    }

    const contextValue: SortContextValue = {
      currentSort,
      onChange,
    };

    // Determine the component to render
    let Comp: React.ElementType;
    let compProps: any;
    const commonProps = {
      'data-testid': TestIds.sortRoot,
      currentSort,
      options: completeOptions,
      onChange: handleChange,
    };

    if (asChild) {
      Comp = Slot;
      compProps = {
        ref,
        ...commonProps,
        ...otherProps,
      };
    } else if (as === 'select') {
      Comp = SelectRenderer;
      compProps = {
        ref: ref as React.Ref<HTMLSelectElement>,
        ...commonProps,
        ...otherProps,
      };
    } else {
      Comp = 'ul';
      compProps = {
        ref: ref as React.Ref<HTMLUListElement>,
        ...commonProps,
        ...otherProps,
      };
    }

    return (
      <SortContext.Provider value={contextValue}>
        <Comp {...compProps}>
          {children}
        </Comp>
      </SortContext.Provider>
    );
  }
);

/**
 * Props for the Option component
 */
export interface SortOptionProps extends ButtonProps {
  /** Field name to sort by (optional if only setting order) */
  fieldName: string;
  /** Sort order (optional if only setting field) */
  order: 'ASC' | 'DESC';
  /** Display label */
  label: string;
  /** Children components */
  children?: React.ReactNode;
}

/**
 * Option component that represents a single sort option.
 * Can be used to set field name, order, or both.
 *
 * @component
 * @example
 * ```tsx
 * // Set both field and order
 * <Sort.Option fieldName="price" order="asc" label="Price: Low to High" />
 *
 * // Set only field (keeps current order)
 * <Sort.Option fieldName="name" label="Sort by Name" />
 *
 * // Set only order (keeps current field)
 * <Sort.Option order="desc" label="Descending" />
 *
 * // Custom rendering with asChild
 * <Sort.Option fieldName="price" order="asc" label="Price" asChild>
 *   {({ isSelected, onSelect, label }) => (
 *     <button
 *       onClick={onSelect}
 *       className={isSelected ? 'bg-blue-500 text-white' : 'bg-gray-200'}
 *     >
 *       {label}
 *     </button>
 *   )}
 * </Sort.Option>
 * ```
 */
export const Option = React.forwardRef<HTMLElement, SortOptionProps>(
  (props, ref) => {
    const { fieldName, order, label, asChild, children, ...otherProps } = props;
    const { currentSort, onChange } = useSortContext();

    const handleSelect = () => {
      const targetFieldName = fieldName || currentSort.fieldName;
      const targetOrder = order || currentSort.order;
      onChange([{ fieldName: targetFieldName, order: targetOrder }]);
    };

    const isSelected = (!fieldName || currentSort.fieldName === fieldName) &&
      (!order || currentSort.order === order);

    // When used in list mode (ul parent), render as li > button
    // When used with asChild, use Slot

    if (asChild) {
      return (
        <Slot
          ref={ref}
          onClick={handleSelect}
          data-testid={TestIds.sortOption}
          data-selected={isSelected}
          data-field-name={fieldName}
          data-order={order}
          {...otherProps}
        >
          {children}
        </Slot>
      );
    }

    // Default: render as list item with button inside
    return (
      <li ref={ref as React.Ref<HTMLLIElement>}>
        <button
          onClick={handleSelect}
          data-testid={TestIds.sortOption}
          data-selected={isSelected}
          data-field-name={fieldName}
          data-order={order}
          {...otherProps}
        >
          {children || label}
        </button>
      </li>
    );
  }
);

// ============================================================================
// EXPORTS WITH NAMESPACING
// ============================================================================

// Set display names for debugging
Root.displayName = "Sort.Root";
Option.displayName = "Sort.Option";
