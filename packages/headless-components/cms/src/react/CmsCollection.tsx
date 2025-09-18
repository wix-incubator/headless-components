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

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionNext = 'cms-collection-next',
  cmsCollectionPrev = 'cms-collection-prev',
  cmsCollectionItemsTotals = 'cms-collection-items-totals',
  cmsCollectionItemsDisplayed = 'cms-collection-items-displayed',
  cmsCollectionCreateItem = 'cms-collection-create-item',
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
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, collection } = props;

    const collectionServiceConfig: CmsCollectionServiceConfig = {
      collectionId: collection.id,
      queryResult: collection?.queryResult,
      queryOptions: collection?.queryOptions,
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
 * Props for CmsCollection.NextAction component
 */
export interface NextActionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or button content when not */
  children?: AsChildChildren<{
    loadNext: () => void;
    hasNext: boolean;
    isLoading: boolean;
  }> | React.ReactNode;
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
  children?: AsChildChildren<{
    loadPrev: () => void;
    hasPrev: boolean;
    isLoading: boolean;
  }> | React.ReactNode;
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
  children?: AsChildChildren<{
    total: number;
  }> | React.ReactNode;
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
const Count = React.forwardRef<HTMLElement, TotalsCountProps>(
  (props, ref) => {
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
  },
);

/**
 * Props for CmsCollection.Totals.Displayed component
 */
export interface TotalsDisplayedProps {
  /** Type of display count to show */
  displayType?: DisplayType;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild or content when not */
  children?: AsChildChildren<{
    displayed: number;
  }> | React.ReactNode;
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
