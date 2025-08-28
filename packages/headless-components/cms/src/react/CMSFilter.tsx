import React from 'react';
import { useService } from '@wix/services-manager-react';
import { CMSServiceDefinition, type FilterCondition, type FilterMap, type FilterOperator } from '../services/cms-crud-service.js';

/**
 * Props for the CMSFilter component
 */
export interface CMSFilterProps {
  /** Render function that receives filter state and actions */
  children: (props: {
    /** Function to add a filter condition */
    addFilter: (fieldName: string, condition: FilterCondition) => Promise<void>;
    /** Function to remove a filter condition */
    removeFilter: (fieldName: string) => Promise<void>;
    /** Function to clear all filter conditions */
    clearFilters: () => Promise<void>;
    /** The current filter conditions */
    currentFilters: FilterMap;
    /** Helper function to create a filter condition */
    createFilterCondition: (operator: FilterOperator, value: any) => FilterCondition;
    /** Available filter operators */
    operators: FilterOperator[];
  }) => React.ReactNode;
}

/**
 * A component that provides filtering functionality for CMS data.
 * This component uses the render props pattern to expose filtering functionality.
 *
 * @component
 * @example
 * ```tsx
 * import { CMSFilter } from '@wix/cms/components';
 *
 * function FilterExample() {
 *   return (
 *     <CMSFilter>
 *       {({ addFilter, removeFilter, clearFilters, currentFilters, createFilterCondition, operators }) => (
 *         <div className="filter-controls">
 *           <div className="filter-form">
 *             <select id="field">
 *               <option value="">Select field</option>
 *               <option value="title">Title</option>
 *               <option value="category">Category</option>
 *               <option value="price">Price</option>
 *             </select>
 *
 *             <select id="operator">
 *               <option value="">Select operator</option>
 *               <option value="$eq">Equals</option>
 *               <option value="$gt">Greater Than</option>
 *               <option value="$lt">Less Than</option>
 *               <option value="$contains">Contains</option>
 *             </select>
 *
 *             <input type="text" id="value" placeholder="Value" />
 *
 *             <button onClick={() => {
 *               const field = document.getElementById('field').value;
 *               const operator = document.getElementById('operator').value;
 *               const value = document.getElementById('value').value;
 *
 *               if (field && operator && value) {
 *                 addFilter(field, createFilterCondition(operator, value));
 *               }
 *             }}>
 *               Add Filter
 *             </button>
 *           </div>
 *
 *           <div className="active-filters">
 *             {Object.entries(currentFilters).map(([field, condition]) => {
 *               const [operator, value] = Object.entries(condition)[0];
 *               return (
 *                 <div key={field} className="filter-tag">
 *                   {field} {operator.replace('$', '')} {value}
 *                   <button onClick={() => removeFilter(field)}>×</button>
 *                 </div>
 *               );
 *             })}
 *
 *             {Object.keys(currentFilters).length > 0 && (
 *               <button onClick={clearFilters}>Clear All Filters</button>
 *             )}
 *           </div>
 *         </div>
 *       )}
 *     </CMSFilter>
 *   );
 * }
 * ```
 */
export function CMSFilter(props: CMSFilterProps) {
  const {
    filterSignal,
    addFilter,
    removeFilter,
    clearFilters,
  } = useService(CMSServiceDefinition);

  /**
   * Helper function to create a filter condition
   * @param operator - The filter operator
   * @param value - The filter value
   * @returns A filter condition
   */
  const createFilterCondition = (operator: FilterOperator, value: any): FilterCondition => {
    return { [operator]: value };
  };

  /**
   * Available filter operators
   */
  const operators: FilterOperator[] = [
    '$eq',
    '$ne',
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$hasSome',
    '$contains',
    '$startsWith',
    '$endsWith',
  ];

  return props.children({
    addFilter,
    removeFilter,
    clearFilters,
    currentFilters: filterSignal.get(),
    createFilterCondition,
    operators,
  });
}

/**
 * Props for the CMSFilter.Field component
 */
export interface FieldProps {
  /** The field name to filter on */
  fieldName: string;
  /** Render function that receives field filter state and actions */
  children: (props: {
    /** Function to set the filter for this field */
    setFilterForField: (condition: FilterCondition) => Promise<void>;
    /** Function to remove the filter for this field */
    removeFilterForField: () => Promise<void>;
    /** Whether this field is currently being filtered */
    isFiltered: boolean;
    /** The current filter condition for this field (if filtered) */
    currentCondition: FilterCondition | null;
    /** Helper function to create a filter condition */
    createFilterCondition: (operator: FilterOperator, value: any) => FilterCondition;
    /** Available filter operators */
    operators: FilterOperator[];
  }) => React.ReactNode;
}

/**
 * A component for filtering a specific field.
 * This component provides filtering functionality for a specific field.
 *
 * @component
 * @example
 * ```tsx
 * <CMSFilter.Field fieldName="title">
 *   {({ setFilterForField, removeFilterForField, isFiltered, currentCondition, createFilterCondition }) => (
 *     <div className="field-filter">
 *       <select
 *         value={isFiltered ? Object.keys(currentCondition)[0] : ''}
 *         onChange={(e) => {
 *           const operator = e.target.value;
 *           if (operator) {
 *             const value = prompt('Enter filter value:');
 *             if (value) {
 *               setFilterForField(createFilterCondition(operator, value));
 *             }
 *           }
 *         }}
 *       >
 *         <option value="">Filter Title</option>
 *         <option value="$eq">Equals</option>
 *         <option value="$contains">Contains</option>
 *         <option value="$startsWith">Starts With</option>
 *       </select>
 *
 *       {isFiltered && (
 *         <button onClick={removeFilterForField}>Clear</button>
 *       )}
 *     </div>
 *   )}
 * </CMSFilter.Field>
 * ```
 */
export function Field(props: FieldProps) {
  const {
    filterSignal,
    addFilter,
    removeFilter,
  } = useService(CMSServiceDefinition);

  const currentFilters = filterSignal.get();
  const currentCondition = currentFilters[props.fieldName] || null;
  const isFiltered = !!currentCondition;

  /**
   * Sets the filter for this field
   * @param condition - The filter condition to set
   */
  const setFilterForField = async (condition: FilterCondition): Promise<void> => {
    await addFilter(props.fieldName, condition);
  };

  /**
   * Removes the filter for this field
   */
  const removeFilterForField = async (): Promise<void> => {
    await removeFilter(props.fieldName);
  };

  /**
   * Helper function to create a filter condition
   * @param operator - The filter operator
   * @param value - The filter value
   * @returns A filter condition
   */
  const createFilterCondition = (operator: FilterOperator, value: any): FilterCondition => {
    return { [operator]: value };
  };

  /**
   * Available filter operators
   */
  const operators: FilterOperator[] = [
    '$eq',
    '$ne',
    '$gt',
    '$gte',
    '$lt',
    '$lte',
    '$hasSome',
    '$contains',
    '$startsWith',
    '$endsWith',
  ];

  return props.children({
    setFilterForField,
    removeFilterForField,
    isFiltered,
    currentCondition,
    createFilterCondition,
    operators,
  });
}

/**
 * Props for the CMSFilter.Condition component
 */
export interface ConditionProps {
  /** The field name to filter on */
  fieldName: string;
  /** The filter operator */
  operator: FilterOperator;
  /** The filter value */
  value: any;
  /** Render function that receives condition state and actions */
  children: (props: {
    /** Function to apply this filter condition */
    applyCondition: () => Promise<void>;
    /** Function to remove this filter condition */
    removeCondition: () => Promise<void>;
    /** Whether this condition is currently applied */
    isApplied: boolean;
  }) => React.ReactNode;
}

/**
 * A component for a specific filter condition.
 * This component provides functionality for a specific filter condition.
 *
 * @component
 * @example
 * ```tsx
 * <CMSFilter.Condition fieldName="price" operator="$gt" value={100}>
 *   {({ applyCondition, removeCondition, isApplied }) => (
 *     <button
 *       onClick={isApplied ? removeCondition : applyCondition}
 *       className={isApplied ? 'active' : ''}
 *     >
 *       Price > $100
 *     </button>
 *   )}
 * </CMSFilter.Condition>
 * ```
 */
export function Condition(props: ConditionProps) {
  const {
    filterSignal,
    addFilter,
    removeFilter,
  } = useService(CMSServiceDefinition);

  const currentFilters = filterSignal.get();
  const currentCondition = currentFilters[props.fieldName] || null;

  // Check if this specific condition is applied
  const isApplied = !!currentCondition &&
    Object.keys(currentCondition).includes(props.operator) &&
    currentCondition[props.operator] === props.value;

  /**
   * Applies this filter condition
   */
  const applyCondition = async (): Promise<void> => {
    await addFilter(props.fieldName, { [props.operator]: props.value });
  };

  /**
   * Removes this filter condition
   */
  const removeCondition = async (): Promise<void> => {
    await removeFilter(props.fieldName);
  };

  return props.children({
    applyCondition,
    removeCondition,
    isApplied,
  });
}
