import React from 'react';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import { CmsCollectionSort as CmsCollectionSortPrimitive } from './core/CmsCollectionSort.js';
import {
  type CmsCollectionServiceConfig,
  type WixDataItem,
  type SortValue as CmsSortValue,
} from '../services/cms-collection-service.js';

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionSorting = 'cms-collection-sorting',
}

/**
 * Props for CmsCollection.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
    items?: WixDataItem[];
  };
}

/**
 * Root component that provides the CMS Collection service context to its children.
 * This component sets up the necessary services for rendering and managing collection data.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionPage() {
 *   return (
 *     <CmsCollection.Root collection={{ id: 'MyCollection' }}>
 *       <CmsCollection.Items>
 *         {({ items, isLoading, error }) => (
 *           <div>
 *             {error && <div>Error: {error}</div>}
 *             {isLoading && <div>Loading...</div>}
 *             {items.map(item => <div key={item._id}>{item.title}</div>)}
 *           </div>
 *         )}
 *       </CmsCollection.Items>
 *     </CmsCollection.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, collection } = props;

    const collectionServiceConfig: CmsCollectionServiceConfig = {
      collectionId: collection.id,
      collection: collection.items,
    };

    const attributes = {
      'data-testid': TestIds.cmsCollectionRoot,
      'data-collection-id': collection.id,
    };

    return (
      <CoreCmsCollection.Root collectionServiceConfig={collectionServiceConfig}>
        <div {...attributes} ref={ref}>
          {children}
        </div>
      </CoreCmsCollection.Root>
    );
  },
);

/**
 * Props for CmsCollection.Items headless component
 */
export interface ItemsProps {
  /** Render prop function that receives collection items data */
  children: (props: ItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for CmsCollection.Items component
 */
export interface ItemsRenderProps {
  /** Array of collection items */
  items: WixDataItem[];
  /** Whether the collection is currently loading */
  isLoading: boolean;
  /** Error message if loading failed, null otherwise */
  error: string | null;
}

/**
 * Headless component for collection items display with loading and error states
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionItemsView() {
 *   return (
 *     <CmsCollection.Items>
 *       {({ items, isLoading, error }) => (
 *         <div>
 *           {error && <div>Error: {error}</div>}
 *           {isLoading && <div>Loading...</div>}
 *           {!isLoading && !error && items.length === 0 && <div>No items found</div>}
 *           {items.map(item => (
 *             <div key={item._id}>{item.title}</div>
 *           ))}
 *         </div>
 *       )}
 *     </CmsCollection.Items>
 *   );
 * }
 * ```
 */
export function Items(props: ItemsProps) {
  return <CoreCmsCollection.Items>{props.children}</CoreCmsCollection.Items>;
}

/**
 * Props for CmsCollection.Sort component
 */
export interface SortProps {
  /**
   * Render function that provides sort state and controls when using asChild pattern.
   * Only called when asChild is true and children is provided.
   */
  children?: React.ForwardRefRenderFunction<
    HTMLElement,
    {
      sortingOptions: Array<SortPrimitive.SortOption>;
      onChange: (value: CmsSortValue) => void;
      value: CmsSortValue;
    }
  >;

  /** When true, the component uses the asChild pattern */
  asChild?: boolean;

  /** Function to format the value for display (mandatory when rendering as select) */
  valueFormatter?: (props: { sortBy: string; sortDirection: string }) => string;

  /** Render mode - 'select' or 'list' */
  as?: 'select' | 'list';

  /** CSS class name */
  className?: string;
}

/**
 * Sort component for CMS collections that provides sorting functionality.
 * Plain wrapper for Sort.Root primitive.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <CmsCollection.Sort
 *   as="select"
 *   valueFormatter={({sortBy, sortDirection}) => `Sort by ${sortBy} (${sortDirection === 'asc' ? 'A-Z' : 'Z-A'})`}
 * />
 *
 * // As list of clickable options
 * <CmsCollection.Sort className="w-full">
 *   <CmsCollection.SortOption fieldName="title" label="Title" />
 *   <CmsCollection.SortOption fieldName="_createdDate" label="Date Created" />
 * </CmsCollection.Sort>
 *
 * // Custom implementation using asChild pattern
 * <CmsCollection.Sort asChild>
 *   {React.forwardRef(({value, onChange, sortingOptions, ...props}, ref) => (
 *     <select defaultValue={`${value[0]?.fieldName}_${value[0]?.order}`} ref={ref} {...props} onChange={(e) => {
 *       const [by, direction] = e.target.value.split('_');
 *       onChange([{fieldName: by, order: direction}]);
 *     }}>
 *       <option value="_createdDate_DESC">Newest First</option>
 *       <option value="title_ASC">Title (A-Z)</option>
 *     </select>
 *   ))}
 * </CmsCollection.Sort>
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>(
  (props, ref) => {
    const {
      children,
      asChild,
      valueFormatter,
      as = 'select',
      ...otherProps
    } = props;

    return (
      <CmsCollectionSortPrimitive>
        {({ currentSort, sortOptions, setSort }) => {
          // Get current sort for data attributes
          const currentSortValue = currentSort?.[0];
          const sortBy = currentSortValue?.fieldName || '';
          const sortDirection = currentSortValue?.order || '';

          const attributes = {
            'data-testid': TestIds.cmsCollectionSorting,
            'data-sorted-by': sortBy,
            'data-sort-direction': sortDirection.toLowerCase(),
            'data-filtered': false, // TODO: Connect to filter state when implemented
            ...otherProps,
          };

          if (asChild && children) {
            return children(
              {
                sortingOptions: sortOptions,
                onChange: setSort,
                value: currentSort,
              },
              ref,
            );
          }

          return (
            <SortPrimitive.Root
              ref={ref}
              value={currentSort}
              onChange={setSort}
              sortOptions={sortOptions}
              as={as}
              {...attributes}
            />
          );
        }}
      </CmsCollectionSortPrimitive>
    );
  },
);

/**
 * Props for CmsCollection.SortOption component
 */
export interface CmsSortOptionProps extends SortPrimitive.SortOptionProps {
  /** CMS-specific field names */
  fieldName: 'title' | '_createdDate' | '_updatedDate' | 'slug'; // should this be generic?
}

/**
 * SortOption component for CMS collections.
 * Plain wrapper for Sort.Option primitive with CMS-specific field names.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCollection.SortOption fieldName="title" label="Title" />
 * <CmsCollection.SortOption fieldName="_createdDate" label="Date Created" />
 * <CmsCollection.SortOption order="ASC" asChild>
 *   <button>Ascending</button>
 * </CmsCollection.SortOption>
 * ```
 */
export const SortOption = React.forwardRef<HTMLElement, CmsSortOptionProps>(
  (props, ref) => {
    return <SortPrimitive.Option ref={ref} {...props} />;
  },
);

