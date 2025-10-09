import React from 'react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import {
  WixDataQueryResult,
  type CmsCollectionServiceConfig,
  type WixDataItem,
  type CmsQueryOptions,
} from '../services/cms-collection-service.js';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import type { DisplayType } from './core/CmsCollection.js';
import * as CmsItem from './CmsItem.js';
import {
  Sort as SortPrimitive,
  type SortValue,
  type SortOption,
} from '@wix/headless-components/react';
import { CmsCollectionSort as CmsCollectionSortPrimitive } from './core/CmsCollectionSort.js';

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionNext = 'cms-collection-next',
  cmsCollectionPrev = 'cms-collection-prev',
  cmsCollectionItemsTotals = 'cms-collection-items-totals',
  cmsCollectionItemsDisplayed = 'cms-collection-items-displayed',
  cmsCollectionCreateItem = 'cms-collection-create-item',
  cmsCollectionItems = 'cms-collection-items',
  cmsCollectionItem = 'cms-collection-item',
  cmsCollectionSort = 'cms-collection-sort',
}

/**
 * Props for CmsCollection.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
    queryResult?: WixDataQueryResult;
    queryOptions?: CmsQueryOptions;
    initialSort?: SortValue;
    /** List of field IDs for single reference fields to include */
    singleRefFieldIds?: string[];
    /** List of field IDs for multi reference fields to include */
    multiRefFieldIds?: string[];
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
 *
 *       <CmsCollection.NextAction>Next Page</CmsCollection.NextAction>
 *       <CmsCollection.PrevAction>Previous Page</CmsCollection.PrevAction>
 *     </CmsCollection.Root>
 *   );
 * }
 *
 * // With reference fields included
 * function CollectionWithReferences() {
 *   return (
 *     <CmsCollection.Root
 *       collection={{
 *         id: 'MyCollection',
 *         singleRefFieldIds: ['author', 'category'],
 *         multiRefFieldIds: ['tags', 'relatedItems']
 *       }}
 *     >
 *       <CmsCollection.Items>
 *         <CmsCollection.ItemRepeater>
 *           <CmsItem.Field fieldId="title" />
 *           <CmsItem.Field fieldId="author" />
 *         </CmsCollection.ItemRepeater>
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
      queryResult: collection?.queryResult,
      queryOptions: collection?.queryOptions,
      initialSort: collection?.initialSort,
      singleRefFieldIds: collection?.singleRefFieldIds,
      multiRefFieldIds: collection?.multiRefFieldIds,
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
 * Props for CmsCollection.Items component
 */
export interface ItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  asChild?: boolean;
  className?: string;
  infiniteScroll?: boolean;
}

/**
 * Main container for the collection items display with support for empty states and infinite scroll.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage with empty state
 * <CmsCollection.Items
 *   emptyState={<div>No items found</div>}
 *   className="space-y-4"
 * >
 *   <CmsCollection.ItemRepeater>
 *     <CmsItem.Field fieldId="title" className="font-semibold mb-2" />
 *     <CmsItem.Field fieldId="description" className="text-gray-600" />
 *   </CmsCollection.ItemRepeater>
 * </CmsCollection.Items>
 *
 * // With infinite scroll enabled
 * <CmsCollection.Items
 *   infiniteScroll
 *   emptyState={<div>No data available</div>}
 *   className="space-y-4"
 * >
 *   <CmsCollection.ItemRepeater>
 *     <CmsItem.Field fieldId="title" />
 *     <CmsItem.Field fieldId="description" />
 *   </CmsCollection.ItemRepeater>
 * </CmsCollection.Items>
 *
 * // Using asChild pattern
 * <CmsCollection.Items asChild emptyState={<div>No data available</div>}>
 *   <section className="grid grid-cols-3 gap-4">
 *     <CmsCollection.ItemRepeater>
 *       <CmsItem.Field fieldId="title" />
 *       <CmsItem.Field fieldId="description" />
 *     </CmsCollection.ItemRepeater>
 *   </section>
 * </CmsCollection.Items>
 * ```
 */
export const Items = React.forwardRef<HTMLElement, ItemsProps>((props, ref) => {
  const {
    children,
    emptyState,
    asChild,
    className,
    infiniteScroll,
    ...otherProps
  } = props;
  const sentinelRef = React.useRef<HTMLDivElement>(null);

  return (
    <CoreCmsCollection.Items>
      {({ items, isLoading, error, loadNext, hasNext }) => {
        // Set up infinite scroll when enabled
        React.useEffect(() => {
          if (
            !infiniteScroll ||
            !sentinelRef.current ||
            !hasNext ||
            isLoading
          ) {
            return;
          }

          const sentinel = sentinelRef.current;

          const observer = new IntersectionObserver(
            (entries) => {
              const entry = entries[0];
              if (entry && entry.isIntersecting && hasNext && !isLoading) {
                loadNext();
              }
            },
            {
              // Trigger when the sentinel is 100px away from entering the viewport
              rootMargin: '100px',
              threshold: 0,
            },
          );

          observer.observe(sentinel);

          return () => {
            observer.disconnect();
          };
        }, [infiniteScroll, hasNext, isLoading, loadNext]);

        // Don't render anything during loading or error states
        if (isLoading && items.length === 0) {
          return null;
        }

        if (error && items.length === 0) {
          return null;
        }

        // Show empty state when no items
        if (items.length === 0 && !isLoading) {
          return emptyState || null;
        }

        const dataAttributes = {
          'data-testid': TestIds.cmsCollectionItems,
          'data-empty': items.length === 0,
          'data-infinite-scroll': infiniteScroll,
        };

        return (
          <>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              {...dataAttributes}
              customElement={children}
              {...otherProps}
            >
              {children}
            </AsChildSlot>

            {/* Infinite scroll sentinel - only render when infinite scroll is enabled and there are more items */}
            {infiniteScroll && hasNext && (
              <div
                ref={sentinelRef}
                style={{
                  height: '1px',
                  width: '100%',
                  opacity: 0,
                  pointerEvents: 'none',
                }}
                aria-hidden="true"
              />
            )}
          </>
        );
      }}
    </CoreCmsCollection.Items>
  );
});

/**
 * Props for CmsCollection.ItemRepeater component
 */
export interface ItemRepeaterProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

/**
 * Repeats for each collection item in the list, providing individual item context.
 *
 * @component
 * @example
 * ```tsx
 * <CmsCollection.ItemRepeater className="item-card">
 *   <CmsItem.Field fieldId="title" />
 *   <CmsItem.Field fieldId="image" />
 *   <CmsItem.Field fieldId="description" />
 * </CmsCollection.ItemRepeater>
 * ```
 */
export function ItemRepeater(props: ItemRepeaterProps) {
  const { children, asChild, className, ...otherProps } = props;

  return (
    <CoreCmsCollection.ItemRepeater>
      {({ items, collectionId, isLoading, error }) => {
        // Don't render during loading or error states
        if (isLoading || error || items.length === 0) {
          return null;
        }

        return (
          <>
            {items.map((item) => (
              <CmsItem.Root
                key={item._id}
                item={{
                  collectionId,
                  id: item._id,
                  item: item,
                }}
              >
                <AsChildSlot
                  asChild={asChild}
                  className={className}
                  data-testid={TestIds.cmsCollectionItem}
                  data-collection-item-id={item._id}
                  customElement={children}
                  {...otherProps}
                >
                  {children}
                </AsChildSlot>
              </CmsItem.Root>
            ))}
          </>
        );
      }}
    </CoreCmsCollection.ItemRepeater>
  );
}

/**
 * Props for CmsCollection.Loading component
 */
export interface LoadingProps {
  /** Content to display during loading (can be a render function or ReactNode) */
  children: ((props: LoadingRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Loading component
 */
export interface LoadingRenderProps {}

/**
 * Component that renders content during loading state.
 * Only displays its children when the collection is currently loading.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionLoading() {
 *   return (
 *     <CmsCollection.Loading>
 *       {() => (
 *         <div className="loading-spinner">
 *           <div>Loading collection...</div>
 *           <div className="spinner"></div>
 *         </div>
 *       )}
 *     </CmsCollection.Loading>
 *   );
 * }
 * ```
 */
export function Loading(props: LoadingProps): React.ReactNode {
  return (
    <CoreCmsCollection.Loading>{props.children}</CoreCmsCollection.Loading>
  );
}

/**
 * Props for CmsCollection.Error component
 */
export interface ErrorProps {
  /** Content to display during error state (can be a render function or ReactNode) */
  children: ((props: ErrorRenderProps) => React.ReactNode) | React.ReactNode;
}

/**
 * Render props for Error component
 */
export interface ErrorRenderProps {
  /** Error message */
  error: string | null;
}

/**
 * Component that renders content when there's an error loading collection.
 * Only displays its children when an error has occurred.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * function CollectionError() {
 *   return (
 *     <CmsCollection.Error>
 *       {({ error }) => (
 *         <div className="error-state">
 *           <h3>Error loading collection</h3>
 *           <p>{error}</p>
 *           <button onClick={() => window.location.reload()}>
 *             Try Again
 *           </button>
 *         </div>
 *       )}
 *     </CmsCollection.Error>
 *   );
 * }
 * ```
 */
export function Error(props: ErrorProps): React.ReactNode {
  return <CoreCmsCollection.Error>{props.children}</CoreCmsCollection.Error>;
}

/**
 * Props for CmsCollection.NextAction component
 */
export interface NextActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or button content when not */
  children?:
    | AsChildChildren<{
        loadNext: () => void;
        hasNext: boolean;
        isLoading: boolean;
      }>
    | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays a button to load the next page of items. Not rendered if no items are left to load.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * // Default usage
 * function NextButton() {
 *   return (
 *     <CmsCollection.NextAction className="btn-primary">
 *       Next Page
 *     </CmsCollection.NextAction>
 *   );
 * }
 *
 * // Custom implementation using asChild pattern
 * function CustomNextButton() {
 *   return (
 *     <CmsCollection.NextAction asChild>
 *       {({ loadNext, hasNext, isLoading }) => (
 *         <button
 *           onClick={loadNext}
 *           disabled={isLoading || !hasNext}
 *           className="custom-next-btn"
 *         >
 *           {isLoading ? 'Loading...' : 'Next Page'}
 *           <ChevronRight className="h-4 w-4" />
 *         </button>
 *       )}
 *     </CmsCollection.NextAction>
 *   );
 * }
 * ```
 */
export const NextAction = React.forwardRef<HTMLButtonElement, NextActionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreCmsCollection.NextAction>
        {({ loadNext, hasNext, isLoading }) => {
          // Don't render if no next page available
          if (!hasNext) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              onClick={() => loadNext()}
              disabled={isLoading}
              data-testid={TestIds.cmsCollectionNext}
              data-loading={isLoading}
              customElement={children}
              customElementProps={{
                loadNext,
                hasNext,
                isLoading,
              }}
              content="Next"
              {...otherProps}
            >
              <button disabled={isLoading}>Next</button>
            </AsChildSlot>
          );
        }}
      </CoreCmsCollection.NextAction>
    );
  },
);

/**
 * Props for CmsCollection.PrevAction component
 */
export interface PrevActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or button content when not */
  children?:
    | AsChildChildren<{
        loadPrev: () => void;
        hasPrev: boolean;
        isLoading: boolean;
      }>
    | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays a button to load the previous page of items. Not rendered if no previous page is available.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * // Default usage
 * function PrevButton() {
 *   return (
 *     <CmsCollection.PrevAction className="btn-primary">
 *       Previous Page
 *     </CmsCollection.PrevAction>
 *   );
 * }
 *
 * // Custom implementation using asChild pattern
 * function CustomPrevButton() {
 *   return (
 *     <CmsCollection.PrevAction asChild>
 *       {({ loadPrev, hasPrev, isLoading }) => (
 *         <button
 *           onClick={loadPrev}
 *           disabled={isLoading || !hasPrev}
 *           className="custom-prev-btn"
 *         >
 *           <ChevronLeft className="h-4 w-4" />
 *           {isLoading ? 'Loading...' : 'Previous Page'}
 *         </button>
 *       )}
 *     </CmsCollection.PrevAction>
 *   );
 * }
 * ```
 */
export const PrevAction = React.forwardRef<HTMLButtonElement, PrevActionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreCmsCollection.PrevAction>
        {({ loadPrev, hasPrev, isLoading }) => {
          // Don't render if no previous page available
          if (!hasPrev) {
            return null;
          }

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              onClick={() => loadPrev()}
              disabled={isLoading}
              data-testid={TestIds.cmsCollectionPrev}
              data-loading={isLoading}
              customElement={children}
              customElementProps={{
                loadPrev,
                hasPrev,
                isLoading,
              }}
              content="Previous"
              {...otherProps}
            >
              <button disabled={isLoading}>Previous</button>
            </AsChildSlot>
          );
        }}
      </CoreCmsCollection.PrevAction>
    );
  },
);

/**
 * Props for CmsCollection.Totals.Count component
 */
export interface TotalsCountProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or content when not */
  children?:
    | AsChildChildren<{
        total: number;
      }>
    | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the total number of items in the collection.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * // Default usage
 * function TotalCount() {
 *   return (
 *     <span>Total: <CmsCollection.Totals.Count /></span>
 *   );
 * }
 *
 * // Custom implementation using asChild pattern
 * function CustomTotalCount() {
 *   return (
 *     <CmsCollection.Totals.Count asChild>
 *       {({ total }) => (
 *         <strong className="text-lg font-bold">
 *           {total} items total
 *         </strong>
 *       )}
 *     </CmsCollection.Totals.Count>
 *   );
 * }
 * ```
 */
const Count = React.forwardRef<HTMLElement, TotalsCountProps>((props, ref) => {
  const { children, asChild, className, ...otherProps } = props;

  return (
    <CoreCmsCollection.TotalsCount>
      {({ total }) => {
        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.cmsCollectionItemsTotals}
            data-total={total}
            customElement={children}
            customElementProps={{
              total,
            }}
            content={total}
            {...otherProps}
          >
            <span>{total}</span>
          </AsChildSlot>
        );
      }}
    </CoreCmsCollection.TotalsCount>
  );
});

/**
 * Props for CmsCollection.Totals.Displayed component
 */
export interface TotalsDisplayedProps {
  /** Type of display count to show */
  displayType?: DisplayType;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or content when not */
  children?:
    | AsChildChildren<{
        displayed: number;
      }>
    | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays various count metrics based on the displayType prop.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * // Default usage
 * function DisplayedCount() {
 *   return (
 *     <div>
 *       <span>Displayed: <CmsCollection.Totals.Displayed displayType="displayed"/></span>
 *       <span>Items on page: <CmsCollection.Totals.Displayed displayType="currentPageAmount"/></span>
 *       <span>Current page: <CmsCollection.Totals.Displayed displayType="currentPageNum"/></span>
 *       <span>Total pages: <CmsCollection.Totals.Displayed displayType="totalPages"/></span>
 *     </div>
 *   );
 * }
 *
 * // Custom implementation using asChild pattern
 * function CustomDisplayedCount() {
 *   return (
 *     <CmsCollection.Totals.Displayed displayType="displayed" asChild>
 *       {({ displayed }) => (
 *         <div className="count-badge">
 *           <span className="count-number">{displayed}</span>
 *           <span className="count-label">items shown</span>
 *         </div>
 *       )}
 *     </CmsCollection.Totals.Displayed>
 *   );
 * }
 * ```
 */
const Displayed = React.forwardRef<HTMLElement, TotalsDisplayedProps>(
  (props, ref) => {
    const { children, asChild, className, displayType, ...otherProps } = props;

    return (
      <CoreCmsCollection.TotalsDisplayed displayType={displayType}>
        {({ displayed }) => {
          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              data-testid={TestIds.cmsCollectionItemsDisplayed}
              data-displayed={displayed}
              data-display-type={displayType || 'displayed'}
              customElement={children}
              customElementProps={{
                displayed,
              }}
              content={displayed}
              {...otherProps}
            >
              <span>{displayed}</span>
            </AsChildSlot>
          );
        }}
      </CoreCmsCollection.TotalsDisplayed>
    );
  },
);

/**
 * Container for totals-related components
 */
export const Totals = {
  Count,
  Displayed,
};

/**
 * Props for CmsCollection.CreateItemAction component
 */
export interface CreateItemActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Button label for default rendering */
  label?: string;
  /** Custom render function when using asChild or button content when not */
  children?:
    | AsChildChildren<{
        disabled: boolean;
        isLoading: boolean;
        onClick: () => void;
      }>
    | React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Loading state text to display when creating item */
  loadingState?: string | React.ReactNode;
  /** Data to use when creating the item. If not provided, creates an empty item. */
  itemData?: Partial<WixDataItem>;
}

/**
 * Displays a button to create a new item in the collection. Integrates with the collection service to handle item creation with loading states.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 *
 * // Default usage
 * function CreateButton() {
 *   return (
 *     <CmsCollection.CreateItemAction
 *       label="Add Item"
 *       className="btn-primary"
 *       loadingState="Creating..."
 *       itemData={{ title: "New Item", status: "draft" }}
 *     />
 *   );
 * }
 *
 * // Custom implementation using asChild pattern
 * function CustomCreateButton() {
 *   return (
 *     <CmsCollection.CreateItemAction
 *       asChild
 *       itemData={{ title: "New Article", status: "draft" }}
 *     >
 *       {({ disabled, isLoading, onClick }) => (
 *         <button
 *           disabled={disabled}
 *           onClick={onClick}
 *           className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
 *         >
 *           <PlusIcon className="w-4 h-4" />
 *           {isLoading ? 'Creating...' : 'Add New Article'}
 *         </button>
 *       )}
 *     </CmsCollection.CreateItemAction>
 *   );
 * }
 *
 * // Simple content override
 * function SimpleCreateButton() {
 *   return (
 *     <CmsCollection.CreateItemAction
 *       label="New Post"
 *       loadingState="Publishing..."
 *       itemData={{ category: "blog", status: "published" }}
 *     >
 *       📝 Create Post
 *     </CmsCollection.CreateItemAction>
 *   );
 * }
 * ```
 */
export const CreateItemAction = React.forwardRef<
  HTMLButtonElement,
  CreateItemActionProps
>((props, ref) => {
  const {
    asChild,
    children,
    className,
    label = 'Create Item',
    loadingState = 'Creating...',
    itemData = {},
    ...otherProps
  } = props;

  return (
    <CoreCmsCollection.CreateItemAction>
      {({ createItem, isLoading }) => {
        const disabled = isLoading;
        // const onClick = async () => {
        //   try {
        //     await createItem(itemData);
        //   } catch (error) {
        //     // Error handling is managed by the service
        //     console.error('Failed to create item:', error);
        //   }
        // };

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            onClick={() => createItem(itemData)}
            disabled={disabled}
            data-testid={TestIds.cmsCollectionCreateItem}
            data-loading={isLoading}
            customElement={children}
            customElementProps={{
              disabled,
              isLoading,
              onClick: () => createItem(itemData),
            }}
            content={isLoading ? loadingState : label}
            {...otherProps}
          >
            <button disabled={disabled}>
              {isLoading ? loadingState : label}
            </button>
          </AsChildSlot>
        );
      }}
    </CoreCmsCollection.CreateItemAction>
  );
});

/**
 * Props for CmsCollection.Sort component
 */
export interface SortProps {
  /** Predefined sort options for declarative API */
  sortOptions?: Array<SortOption>;
  /** Render mode - 'select' uses native select, 'list' provides list (default: 'select') */
  as?: 'select' | 'list';
  /** When true, the component will not render its own element but forward its props to its child */
  asChild?: boolean;
  /** Children components or render function */
  children?: React.ReactNode;
  /** CSS classes to apply */
  className?: string;
}

/**
 * Sort component that provides sorting controls for the collection items.
 * Wraps the Sort primitive with CMS collection state management.
 *
 * @component
 * @example
 * ```tsx
 * // Native select with predefined options
 * <CmsCollection.Sort
 *   as="select"
 *   sortOptions={[
 *     { fieldName: 'title', order: 'ASC', label: 'Title (A-Z)' },
 *     { fieldName: 'created', order: 'DESC', label: 'Newest First' },
 *   ]}
 *   className="w-full"
 * />
 *
 * // List with custom options
 * <CmsCollection.Sort as="list" className="flex gap-2">
 *   <CmsCollection.SortOption fieldName="title" order="ASC" label="Title (A-Z)" />
 *   <CmsCollection.SortOption fieldName="created" order="DESC" label="Newest" />
 * </CmsCollection.Sort>
 *
 * // Custom implementation with asChild
 * <CmsCollection.Sort asChild sortOptions={sortOptions}>
 *   <MyCustomSortComponent />
 * </CmsCollection.Sort>
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>((props, ref) => {
  const {
    sortOptions,
    as = 'select',
    asChild,
    children,
    className,
    ...otherProps
  } = props;

  return (
    <CmsCollectionSortPrimitive>
      {({ currentSort, setSort }) => {
        const currentSortItem = currentSort?.[0];

        return (
          <SortPrimitive.Root
            ref={ref}
            value={currentSort}
            onChange={setSort}
            sortOptions={sortOptions}
            as={as}
            asChild={asChild}
            className={className}
            data-testid={TestIds.cmsCollectionSort}
            data-sorted-by={currentSortItem?.fieldName}
            data-sort-direction={currentSortItem?.order}
            {...otherProps}
          >
            {children}
          </SortPrimitive.Root>
        );
      }}
    </CmsCollectionSortPrimitive>
  );
});

/**
 * SortOption component for individual sort options.
 * Direct export of the Sort primitive's Option component - no CMS-specific customization needed
 * since CMS collections have dynamic schemas.
 *
 * @component
 * @example
 * ```tsx
 * // Set both field and order
 * <CmsCollection.SortOption
 *   fieldName="title"
 *   order="ASC"
 *   label="Title (A-Z)"
 * />
 *
 * // Any custom field name from your collection
 * <CmsCollection.SortOption
 *   fieldName="customField"
 *   order="DESC"
 *   label="Custom Field"
 * />
 *
 * // With asChild pattern
 * <CmsCollection.SortOption
 *   fieldName="created"
 *   order="DESC"
 *   label="Newest"
 *   asChild
 * >
 *   <button className="sort-btn">Newest First</button>
 * </CmsCollection.SortOption>
 * ```
 */
const SortOptionComponent = SortPrimitive.Option;

// Set display names
Sort.displayName = 'CmsCollection.Sort';
SortOptionComponent.displayName = 'CmsCollection.SortOption';

// Export as named export
export { SortOptionComponent as SortOption };
