import React from 'react';
import { useService } from '@wix/services-manager-react';
import { CMSServiceDefinition, type SortItem, type SortOrder } from '../services/cms-crud-service.js';

/**
 * Props for the CmsCrudSort component
 */
export interface CmsCrudSortProps {
  /** Render function that receives sort state and actions */
  children: (props: {
    /** Function to set the sort criteria */
    setSort: (sortItems: SortItem[]) => Promise<void>;
    /** The current sort criteria */
    currentSort: SortItem[];
    /** Helper function to create a sort item */
    createSortItem: (fieldName: string, order: SortOrder) => SortItem;
    /** Helper function to toggle sort order */
    toggleSortOrder: (order: SortOrder) => SortOrder;
  }) => React.ReactNode;
}

/**
 * A component that provides sorting functionality for CMS data.
 * This component uses the render props pattern to expose sorting functionality.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCrudSort } from '@wix/cms/components';
 *
 * function SortExample() {
 *   return (
 *     <CmsCrudSort>
 *       {({ setSort, currentSort, createSortItem, toggleSortOrder }) => {
 *         const primarySort = currentSort[0] || { fieldName: '', order: 'ASC' };
 *
 *         return (
 *           <div className="sort-controls">
 *             <select
 *               value={primarySort.fieldName}
 *               onChange={(e) => {
 *                 const field = e.target.value;
 *                 if (field) {
 *                   setSort([createSortItem(field, 'ASC')]);
 *                 }
 *               }}
 *             >
 *               <option value="">Select field to sort</option>
 *               <option value="title">Title</option>
 *               <option value="createdDate">Created Date</option>
 *               <option value="price">Price</option>
 *             </select>
 *
 *             {primarySort.fieldName && (
 *               <button
 *                 onClick={() => {
 *                   setSort([
 *                     createSortItem(
 *                       primarySort.fieldName,
 *                       toggleSortOrder(primarySort.order)
 *                     )
 *                   ]);
 *                 }}
 *               >
 *                 {primarySort.order === 'ASC' ? '↑' : '↓'}
 *               </button>
 *             )}
 *           </div>
 *         );
 *       }}
 *     </CmsCrudSort>
 *   );
 * }
 * ```
 */
export function CmsCrudSort(props: CmsCrudSortProps) {
  const {
    sortSignal,
    setSort,
  } = useService(CMSServiceDefinition);

  /**
   * Helper function to create a sort item
   * @param fieldName - The field name to sort by
   * @param order - The sort order (ASC or DESC)
   * @returns A sort item
   */
  const createSortItem = (fieldName: string, order: SortOrder): SortItem => {
    return { fieldName, order };
  };

  /**
   * Helper function to toggle sort order
   * @param order - The current sort order
   * @returns The toggled sort order
   */
  const toggleSortOrder = (order: SortOrder): SortOrder => {
    return order === 'ASC' ? 'DESC' : 'ASC';
  };

  return props.children({
    setSort,
    currentSort: sortSignal.get(),
    createSortItem,
    toggleSortOrder,
  });
}

/**
 * Props for the CmsCrudSort.Field component
 */
export interface FieldProps {
  /** The field name to sort by */
  fieldName: string;
  /** Render function that receives field sort state and actions */
  children: (props: {
    /** Function to set the sort for this field */
    setSortForField: (order: SortOrder) => Promise<void>;
    /** Whether this field is currently being sorted */
    isSorted: boolean;
    /** The current sort order for this field (if sorted) */
    currentOrder: SortOrder | null;
    /** Function to toggle sort order for this field */
    toggleSort: () => Promise<void>;
  }) => React.ReactNode;
}

/**
 * A component for sorting a specific field.
 * This component provides sorting functionality for a specific field.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudSort.Field fieldName="title">
 *   {({ isSorted, currentOrder, toggleSort }) => (
 *     <button onClick={toggleSort}>
 *       Title {isSorted ? (currentOrder === 'ASC' ? '↑' : '↓') : ''}
 *     </button>
 *   )}
 * </CmsCrudSort.Field>
 * ```
 */
export function Field(props: FieldProps) {
  const {
    sortSignal,
    setSort,
  } = useService(CMSServiceDefinition);

  const currentSort = sortSignal.get();
  const sortItem = currentSort.find(item => item.fieldName === props.fieldName);
  const isSorted = !!sortItem;
  const currentOrder = sortItem?.order || null;

  /**
   * Sets the sort for this field
   * @param order - The sort order to set
   */
  const setSortForField = async (order: SortOrder): Promise<void> => {
    await setSort([{ fieldName: props.fieldName, order }]);
  };

  /**
   * Toggles the sort for this field
   */
  const toggleSort = async (): Promise<void> => {
    if (isSorted) {
      // Toggle the sort order
      await setSortForField(currentOrder === 'ASC' ? 'DESC' : 'ASC');
    } else {
      // Set ascending sort by default
      await setSortForField('ASC');
    }
  };

  return props.children({
    setSortForField,
    isSorted,
    currentOrder,
    toggleSort,
  });
}

/**
 * Props for the CmsCrudSort.MultiField component
 */
export interface MultiFieldProps {
  /** Render function that receives multi-field sort state and actions */
  children: (props: {
    /** Function to add a sort field */
    addSortField: (fieldName: string, order: SortOrder) => Promise<void>;
    /** Function to remove a sort field */
    removeSortField: (fieldName: string) => Promise<void>;
    /** Function to clear all sort fields */
    clearSort: () => Promise<void>;
    /** The current sort criteria */
    currentSort: SortItem[];
  }) => React.ReactNode;
}

/**
 * A component for multi-field sorting.
 * This component provides functionality for sorting by multiple fields.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCrudSort.MultiField>
 *   {({ addSortField, removeSortField, clearSort, currentSort }) => (
 *     <div className="multi-sort">
 *       <div className="sort-fields">
 *         {currentSort.map((sortItem, index) => (
 *           <div key={sortItem.fieldName} className="sort-field">
 *             <span>{sortItem.fieldName} ({sortItem.order})</span>
 *             <button onClick={() => removeSortField(sortItem.fieldName)}>
 *               Remove
 *             </button>
 *           </div>
 *         ))}
 *       </div>
 *
 *       <div className="add-sort">
 *         <select
 *           id="field"
 *           onChange={(e) => {
 *             const field = e.target.value;
 *             if (field) {
 *               addSortField(field, 'ASC');
 *               e.target.value = '';
 *             }
 *           }}
 *         >
 *           <option value="">Add sort field</option>
 *           <option value="title">Title</option>
 *           <option value="createdDate">Created Date</option>
 *           <option value="price">Price</option>
 *         </select>
 *       </div>
 *
 *       {currentSort.length > 0 && (
 *         <button onClick={clearSort}>Clear Sort</button>
 *       )}
 *     </div>
 *   )}
 * </CmsCrudSort.MultiField>
 * ```
 */
export function MultiField(props: MultiFieldProps) {
  const {
    sortSignal,
    setSort,
  } = useService(CMSServiceDefinition);

  /**
   * Adds a sort field
   * @param fieldName - The field name to sort by
   * @param order - The sort order
   */
  const addSortField = async (fieldName: string, order: SortOrder): Promise<void> => {
    const currentSort = sortSignal.get();

    // Remove the field if it already exists
    const filteredSort = currentSort.filter(item => item.fieldName !== fieldName);

    // Add the new sort item
    await setSort([...filteredSort, { fieldName, order }]);
  };

  /**
   * Removes a sort field
   * @param fieldName - The field name to remove
   */
  const removeSortField = async (fieldName: string): Promise<void> => {
    const currentSort = sortSignal.get();
    const filteredSort = currentSort.filter(item => item.fieldName !== fieldName);
    await setSort(filteredSort);
  };

  /**
   * Clears all sort fields
   */
  const clearSort = async (): Promise<void> => {
    await setSort([]);
  };

  return props.children({
    addSortField,
    removeSortField,
    clearSort,
    currentSort: sortSignal.get(),
  });
}
