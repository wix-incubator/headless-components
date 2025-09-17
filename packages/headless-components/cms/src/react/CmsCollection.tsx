import React from 'react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import {
  WixDataQueryResult,
  type CmsCollectionServiceConfig,
  type WixDataItem,
} from '../services/cms-collection-service.js';

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionNext = 'cms-collection-next',
  cmsCollectionPrev = 'cms-collection-prev',
}

/**
 * Props for CmsCollection.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
    queryResult: WixDataQueryResult;
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
      queryResult: collection.queryResult,
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
  children: React.ReactNode;
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
 * function NextButton() {
 *   return (
 *     <CmsCollection.NextAction className="btn-primary">
 *       Next Page
 *       <ChevronRight className="h-4 w-4" />
 *     </CmsCollection.NextAction>
 *   );
 * }
 * ```
 */
export const NextAction = React.forwardRef<HTMLButtonElement, NextActionProps>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <CoreCmsCollection.NextAction>
        {({ loadNext, hasNext, isLoading }) => {
          // Don't render if no next page available
          if (!hasNext) {
            return null;
          }

          const attributes = {
            'data-testid': TestIds.cmsCollectionNext,
            'data-loading': isLoading,
            onClick: () => loadNext(),
            disabled: isLoading,
            className,
            ...otherProps,
          };

          return (
            <button {...attributes} ref={ref}>
              {children}
            </button>
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
  children: React.ReactNode;
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
 * function PrevButton() {
 *   return (
 *     <CmsCollection.PrevAction className="btn-primary">
 *       <ChevronLeft className="h-4 w-4" />
 *       Previous Page
 *     </CmsCollection.PrevAction>
 *   );
 * }
 * ```
 */
export const PrevAction = React.forwardRef<HTMLButtonElement, PrevActionProps>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;

    return (
      <CoreCmsCollection.PrevAction>
        {({ loadPrev, hasPrev, isLoading }) => {
          // Don't render if no previous page available
          if (!hasPrev) {
            return null;
          }

          const attributes = {
            'data-testid': TestIds.cmsCollectionPrev,
            'data-loading': isLoading,
            onClick: () => loadPrev(),
            disabled: isLoading,
            className,
            ...otherProps,
          };

          return (
            <button {...attributes} ref={ref}>
              {children}
            </button>
          );
        }}
      </CoreCmsCollection.PrevAction>
    );
  },
);

