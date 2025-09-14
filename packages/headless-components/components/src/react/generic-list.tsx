import React from 'react';
import { AsChildSlot } from '@wix/headless-utils/react';

/** List display variants */
export type ListVariant = 'list' | 'table' | 'grid';

/** List item interface - generic item with id */
export interface ListItem {
  id: string | number;
  [key: string]: any;
}

interface GenericListContextValue<T extends ListItem = ListItem> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  onLoadMore?: () => void;
  variant: ListVariant;
  infinite: boolean;
  onNextPage?: () => void;
  onPreviousPage?: () => void;
}

const GenericListContext = React.createContext<GenericListContextValue | null>(
  null,
);

function useGenericListContext<
  T extends ListItem = ListItem,
>(): GenericListContextValue<T> {
  const context = React.useContext(GenericListContext);
  if (!context) {
    throw new Error(
      'useGenericListContext must be used within a GenericList.Root component',
    );
  }
  return context as GenericListContextValue<T>;
}

/**
 * Props for the GenericList Root component
 */
export interface GenericListRootProps<T extends ListItem = ListItem> {
  /** Array of items to display */
  items: T[];
  /** Function called to load more items (infinite scroll/load more pattern) */
  onLoadMore?: () => void;
  /** Whether more items can be loaded */
  hasMore?: boolean;
  /** Whether items are currently loading */
  isLoading?: boolean;
  /** Display variant - affects layout structure (default: 'list') */
  variant?: ListVariant;
  /** Enable infinite scroll - automatically triggers onLoadMore when reaching the end (default: false) */
  infinite?: boolean;
  /** Function called to navigate to next page */
  onNextPage?: () => void;
  /** Function called to navigate to previous page */
  onPreviousPage?: () => void;
  /** Children components - required */
  children: React.ReactNode;
  /** CSS classes */
  className?: string;
}

/**
 * Props for the GenericList Items component
 */
export interface GenericListItemsProps {
  /** Content to display when no items are available */
  emptyState?: React.ReactNode;
  /** Children components - required */
  children: React.ReactNode;
  /** CSS classes */
  className?: string;
}

/**
 * Props for the GenericList LoadMore component
 */
export interface GenericListLoadMoreProps {
  /** Label text for the load more button */
  label?: string;
  /** Loading label text */
  loadingLabel?: string;
  /** Children for custom rendering - optional but either children or label must be provided */
  children?: React.ReactNode;
  /** CSS classes */
  className?: string;
}

/**
 * Props for the GenericList Totals component
 */
export interface GenericListTotalsProps {
  /** Custom render function or content - optional, defaults to displaying item count */
  children?:
    | React.ReactNode
    | ((
        props: { totalItems: number; displayedItems: number },
        ref: React.Ref<HTMLElement>,
      ) => React.ReactNode);
  /** CSS classes */
  className?: string;
}

/**
 * Container for list components that provides data context and manages list state.
 * Renders items inside another model's context and supports multiple display variants,
 * empty states, load more functionality, and totals display.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, GenericListRootProps>(
  <T extends ListItem = ListItem>(
    props: GenericListRootProps<T>,
    ref: React.Ref<HTMLElement>,
  ) => {
    const {
      items,
      onLoadMore,
      hasMore = false,
      isLoading = false,
      variant = 'list',
      infinite = false,
      onNextPage,
      onPreviousPage,
      children,
      className,
      ...otherProps
    } = props;

    if (!children) {
      throw new Error('GenericList.Root requires children');
    }

    const contextValue: GenericListContextValue<T> = React.useMemo(
      () => ({
        items,
        hasMore,
        isLoading,
        onLoadMore,
        variant,
        infinite,
        onNextPage,
        onPreviousPage,
      }),
      [
        items,
        hasMore,
        isLoading,
        onLoadMore,
        variant,
        infinite,
        onNextPage,
        onPreviousPage,
      ],
    );

    return (
      <GenericListContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          className={className}
          data-variant={variant}
          data-has-items={items.length > 0}
          data-is-loading={isLoading}
          data-has-more={hasMore}
          data-infinite={infinite}
          customElement={children}
          {...otherProps}
        >
          {children}
        </AsChildSlot>
      </GenericListContext.Provider>
    );
  },
);

Root.displayName = 'GenericList.Root';

/**
 * Container for list items that handles empty state display and provides structure
 * for item rendering. Does not render if list is empty unless emptyState is provided.
 *
 * @component
 */
export const Items = React.forwardRef<HTMLElement, GenericListItemsProps>(
  (props, ref) => {
    const { emptyState, children, className, ...otherProps } = props;
    const { items, variant } = useGenericListContext();

    if (!children) {
      throw new Error('GenericList.Items requires children');
    }

    const hasItems = items.length > 0;

    // Show empty state if no items and emptyState is provided
    if (!hasItems) {
      return emptyState || null;
    }

    return (
      <AsChildSlot
        ref={ref}
        className={className}
        data-variant={variant}
        data-empty={!hasItems}
        customElement={children}
        {...otherProps}
      >
        {children}
      </AsChildSlot>
    );
  },
);

Items.displayName = 'GenericList.Items';

/**
 * Load more button component that appears when more items can be loaded.
 * Automatically handles loading state and disables when no more items are available.
 *
 * @component
 */
export const LoadMore = React.forwardRef<
  HTMLButtonElement,
  GenericListLoadMoreProps
>((props, ref) => {
  const {
    label = 'Load More',
    loadingLabel = 'Loading...',
    children,
    className,
    ...otherProps
  } = props;

  const { hasMore, isLoading, onLoadMore } = useGenericListContext();

  // Either children or label must be provided
  if (!children && !label) {
    throw new Error('GenericList.LoadMore requires either children or label');
  }

  // Don't render if no more items to load
  if (!hasMore) {
    return null;
  }

  const handleClick = () => {
    if (onLoadMore && !isLoading) {
      onLoadMore();
    }
  };

  // Determine what content to render
  const buttonContent = isLoading ? loadingLabel : label;
  const content = buttonContent || children;

  return (
    <AsChildSlot
      ref={ref}
      className={className}
      data-has-more={hasMore}
      data-is-loading={isLoading}
      disabled={isLoading}
      onClick={handleClick}
      customElement={children}
      customElementProps={{
        label,
        loadingLabel,
        isLoading,
        hasMore,
        onLoadMore,
      }}
      {...otherProps}
    >
      {content}
    </AsChildSlot>
  );
});

LoadMore.displayName = 'GenericList.LoadMore';

/**
 * Displays totals information about the list (total items and displayed items).
 * Provides data for custom rendering patterns.
 *
 * @component
 */
export const Totals = React.forwardRef<HTMLElement, GenericListTotalsProps>(
  (props, ref) => {
    const { children, className, ...otherProps } = props;
    const { items } = useGenericListContext();

    const displayedItems = items.length;

    // Determine what content to render - either children or displayedItems
    const content = children || displayedItems;

    return (
      <AsChildSlot
        ref={ref}
        className={className}
        data-displayed-items={displayedItems}
        customElement={children}
        customElementProps={{ displayedItems }}
        asChild
        {...otherProps}
      >
        {content}
      </AsChildSlot>
    );
  },
);

Totals.displayName = 'GenericList.Totals';

export const Actions = {
  LoadMore,
};

export const GenericList = {
  Root,
  Items,
  Actions,
  Totals,
};

export { Actions as GenericListActions };
