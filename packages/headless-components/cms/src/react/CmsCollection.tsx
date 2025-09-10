import React from 'react';
import * as CoreCmsCollection from './core/CmsCollection.js';
import {
  CmsCollectionServiceDefinition,
  type CmsCollectionServiceConfig,
  type WixDataItem,
} from '../services/cms-collection-service.js';
import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';

/**
 * Context for sharing collection state between components
 */
interface CmsCollectionContextValue {
  items: WixDataItem[];
  isLoading: boolean;
  error: string | null;
  hasItems: boolean;
}

const CmsCollectionContext = React.createContext<CmsCollectionContextValue | null>(null);

/**
 * Hook to access CMS collection context
 */
function useCmsCollectionContext(): CmsCollectionContextValue {
  const context = React.useContext(CmsCollectionContext);
  if (!context) {
    throw new Error(
      'useCmsCollectionContext must be used within a CmsCollection.Root component',
    );
  }
  return context;
}

enum TestIds {
  cmsCollectionRoot = 'cms-collection-root',
  cmsCollectionItems = 'cms-collection-items',
  cmsCollectionItemRepeater = 'cms-collection-item-repeater',
  cmsCollectionItem = 'cms-collection-item',
}

/**
 * Props for CmsCollection.Root component
 */
export interface RootProps {
  children: React.ReactNode;
  collection: {
    id: string;
  };
}

/**
 * Root component that provides the CMS Collection context to its children.
 * Sets up the collection data and makes it available to child components.
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children, collection } = props;

    const collectionServiceConfig: CmsCollectionServiceConfig = {
      collectionId: collection.id,
    };

    return (
      <CoreCmsCollection.Root collectionServiceConfig={collectionServiceConfig}>
        <CmsCollectionContextProvider collectionId={collection.id} ref={ref}>
          {children}
        </CmsCollectionContextProvider>
      </CoreCmsCollection.Root>
    );
  },
);

/**
 * Internal context provider component that wraps the service data for composed components
 */
const CmsCollectionContextProvider = React.forwardRef<
  HTMLDivElement,
  { children: React.ReactNode; collectionId: string }
>((props, ref) => {
  const { children, collectionId } = props;

  const service = useService(CmsCollectionServiceDefinition) as ServiceAPI<
    typeof CmsCollectionServiceDefinition
  >;

  const items = service.itemsSignal.get();
  const isLoading = service.loadingSignal.get();
  const error = service.errorSignal.get();
  const hasItems = items.length > 0;

  const contextValue: CmsCollectionContextValue = {
    items,
    isLoading,
    error,
    hasItems,
  };

  const attributes = {
    'data-testid': TestIds.cmsCollectionRoot,
    'data-collection-id': collectionId,
    'data-has-items': hasItems,
    'data-loading': isLoading,
    'data-error': Boolean(error),
  };

  return (
    <CmsCollectionContext.Provider value={contextValue}>
      <div {...attributes} ref={ref}>
        {children}
      </div>
    </CmsCollectionContext.Provider>
  );
});

/**
 * Props for CmsCollection.Items component
 */
export interface ItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
  className?: string;
}

/**
 * Container for the collection items with empty state support.
 * Renders emptyState when no items are available, otherwise renders children.
 */
export const Items = React.forwardRef<HTMLDivElement, ItemsProps>(
  (props, ref) => {
    const { children, emptyState, className } = props;
    const { hasItems, isLoading } = useCmsCollectionContext();

    const attributes = {
      'data-testid': TestIds.cmsCollectionItems,
      'data-empty': !hasItems && !isLoading,
      className,
    };

    if (!hasItems && !isLoading) {
      return emptyState || null;
    }

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);

/**
 * Props for CmsCollection.ItemRepeater component
 */
export interface ItemRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each collection item.
 * Maps over items and provides CmsCollectionItem.Root for each.
 */
export const ItemRepeater = React.forwardRef<HTMLElement, ItemRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { hasItems, items } = useCmsCollectionContext();

    if (!hasItems) return null;

    return (
      <>
        {items.map((item: WixDataItem) => (
          <CmsCollectionItem.Root
            key={item._id}
            item={item}
            data-testid={TestIds.cmsCollectionItem}
          >
            {children}
          </CmsCollectionItem.Root>
        ))}
      </>
    );
  },
);

/**
 * Context for sharing individual item data between components
 */
interface CmsCollectionItemContextValue {
  item: WixDataItem;
}

const CmsCollectionItemContext = React.createContext<CmsCollectionItemContextValue | null>(null);

/**
 * Hook to access CMS collection item context
 */
function useCmsCollectionItemContext(): CmsCollectionItemContextValue {
  const context = React.useContext(CmsCollectionItemContext);
  if (!context) {
    throw new Error(
      'useCmsCollectionItemContext must be used within a CmsCollectionItem.Root component',
    );
  }
  return context;
}

/**
 * CmsCollectionItem namespace for individual item components
 */
export namespace CmsCollectionItem {
  /**
   * Props for CmsCollectionItem.Root component
   */
  export interface RootProps {
    children: React.ReactNode;
    item: WixDataItem;
    'data-testid'?: string;
  }

  /**
   * Root component for individual collection items.
   * Provides item context to child components.
   */
  export const Root = React.forwardRef<HTMLDivElement, RootProps>(
    (props, ref) => {
      const { children, item, ...attributes } = props;

      const contextValue: CmsCollectionItemContextValue = {
        item,
      };

      return (
        <CmsCollectionItemContext.Provider value={contextValue}>
          <div {...attributes} ref={ref}>
            {children}
          </div>
        </CmsCollectionItemContext.Provider>
      );
    },
  );

  /**
   * Props for CmsCollectionItem.Field component
   */
  export interface FieldProps {
    field: string;
    className?: string;
    fallback?: React.ReactNode;
  }

  /**
   * Component for rendering individual item fields.
   * Displays the value of the specified field from the current item.
   */
  export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
    (props, ref) => {
      const { field, className, fallback } = props;
      const { item } = useCmsCollectionItemContext();

      const value = item[field];
      const displayValue = value != null ? String(value) : fallback;

      const attributes = {
        'data-testid': `cms-collection-item-field-${field}`,
        'data-field': field,
        className,
      };

      return (
        <div {...attributes} ref={ref}>
          {displayValue}
        </div>
      );
    },
  );

  /**
   * Props for CmsCollectionItem.Raw component
   */
  export interface RawProps {
    children: (item: WixDataItem) => React.ReactNode;
  }

  /**
   * Raw component that provides direct access to the item data via render prop.
   * Use this when you need custom rendering logic that doesn't fit the standard patterns.
   */
  export const Raw = (props: RawProps) => {
    const { children } = props;
    const { item } = useCmsCollectionItemContext();

    return children(item);
  };
}
