import React from 'react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import * as CoreCmsCollectionFilters from './core/CmsCollectionFilters.js';
import {
  type CmsCollectionServiceConfig,
  type WixDataItem,
} from '../services/cms-collection-service.js';
import type { FilterOption } from '@wix/headless-components/react';

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
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
  /** Optional filter options configuration for enabling filtering */
  filterOptions?: FilterOption[];
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
    const { children, collection, filterOptions } = props;

    const collectionServiceConfig: CmsCollectionServiceConfig = {
      collectionId: collection.id,
      collection: collection.items,
    };

    // Create filters service config if filter options are provided
    const filtersServiceConfig = filterOptions ? {
      collectionId: collection.id,
      filterOptions,
      initialItems: collection.items,
    } : undefined;

    const attributes = {
      'data-testid': TestIds.cmsCollectionRoot,
      'data-collection-id': collection.id,
      'data-has-filters': !!filterOptions,
    };

    return (
      <CoreCmsCollection.Root
        collectionServiceConfig={collectionServiceConfig}
        filtersServiceConfig={filtersServiceConfig}
      >
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
 * Props for CmsCollection.Filters component
 */
export interface FiltersProps extends CoreCmsCollectionFilters.FiltersProps {}

/**
 * Filter component that provides comprehensive filtering functionality for CMS collections.
 *
 * This component acts as a provider that integrates with the CmsCollectionFilters service to offer
 * predefined filter options based on the collection's filterable fields configuration.
 *
 * The component automatically extracts available filter options from the service configuration
 * and provides them to child Filter primitive components for rendering.
 *
 * @component
 * @example
 * ```tsx
 * import { CmsCollection } from '@wix/cms/components';
 * import { Filter } from '@wix/headless-components/react';
 *
 * function CollectionWithFilters() {
 *   const filterOptions = [
 *     {
 *       key: 'title',
 *       label: 'Title',
 *       type: 'single',
 *       displayType: 'text',
 *       fieldType: 'singular',
 *     },
 *     {
 *       key: 'category',
 *       label: 'Category',
 *       type: 'multi',
 *       displayType: 'text',
 *       fieldType: 'singular',
 *       validValues: ['news', 'blog', 'events'],
 *     },
 *   ];
 *
 *   return (
 *     <CmsCollection.Root
 *       collection={{ id: 'MyCollection' }}
 *       filterOptions={filterOptions}
 *     >
 *       <CmsCollection.Filters>
 *         <Filter.FilterOptions>
 *           <Filter.FilterOptionRepeater>
 *             <Filter.FilterOption.Label />
 *             <Filter.FilterOption.MultiFilter />
 *             <Filter.FilterOption.RangeFilter />
 *           </Filter.FilterOptionRepeater>
 *         </Filter.FilterOptions>
 *       </CmsCollection.Filters>
 *
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
export const Filters = CoreCmsCollectionFilters.Filters;

