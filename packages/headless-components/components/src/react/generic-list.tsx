import React from 'react';
import { AsChildSlot } from '@wix/headless-utils/react';

/** List display variants */
export type ListVariant = 'list' | 'grid';

/** List item interface - generic item with id */
export interface ListItem {
  [key: string]: any;
}

interface GenericListContextValue<T extends ListItem = ListItem> {
  items: T[];
  hasMore: boolean;
  isLoading: boolean;
  loadMore?: () => void;
  variant?: ListVariant;
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
  loadMore?: () => void;
  /** Whether more items can be loaded */
  hasMore?: boolean;
  /** Whether items are currently loading */
  isLoading?: boolean;
  /** Display variant - affects layout structure (default: 'list') */
  variant?: ListVariant;
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

export interface GenericListLoadMoreRenderProps {
  isLoading: boolean;
  hasMore: boolean;
  loadMore: () => void;
}

/**
 * Props for the GenericList LoadMore component
 */
export interface GenericListLoadMoreProps {
  /** Label text for the load more button */
  label?: string;
  /** Loading state content */
  loadingState?: React.ReactNode;
  /** Children for custom rendering - optional but either children or label must be provided */
  children?:
    | React.ReactNode
    | ((
        props: GenericListLoadMoreRenderProps,
        ref: React.Ref<HTMLElement>,
      ) => React.ReactNode);
  /** CSS classes */
  className?: string;
}

export interface GenericListTotalsRenderProps {
  displayedItems: number;
}

/**
 * Props for the GenericList Totals component
 */
export interface GenericListTotalsProps {
  /** Custom render function or content - optional, defaults to displaying item count */
  children?:
    | React.ReactNode
    | ((
        props: GenericListTotalsRenderProps,
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
      loadMore,
      hasMore = false,
      isLoading = false,
      variant,
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
        loadMore,
        variant,
      }),
      [items, hasMore, isLoading, loadMore, variant],
    );

    return (
      <GenericListContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          className={className}
          data-has-items={items.length > 0}
          data-is-loading={isLoading}
          data-has-more={hasMore}
          data-variant={variant}
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
    const { items } = useGenericListContext();

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
  const { label, loadingState, children, className, ...otherProps } = props;

  const { hasMore, isLoading, loadMore } = useGenericListContext();

  // Either children or label must be provided
  if (!children && !label) {
    throw new Error('GenericList.LoadMore requires either children or label');
  }

  // Don't render if no more items to load
  if (!hasMore) {
    return null;
  }

  const handleClick = () => {
    if (loadMore && !isLoading) {
      loadMore();
    }
  };

  // Determine what content to render
  const buttonContent = isLoading ? loadingState : label;
  const content = buttonContent;

  return (
    <AsChildSlot
      ref={ref}
      asChild
      className={className}
      data-has-more={hasMore}
      data-is-loading={isLoading}
      disabled={isLoading}
      onClick={handleClick}
      customElement={children}
      customElementProps={{
        label,
        loadingState,
        isLoading,
        hasMore,
        loadMore,
      }}
      content={content}
      {...otherProps}
    />
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

    const content = displayedItems;

    return (
      <AsChildSlot
        ref={ref}
        className={className}
        data-displayed-items={displayedItems}
        customElement={children}
        customElementProps={{ displayedItems }}
        asChild
        content={content}
        {...otherProps}
      />
    );
  },
);

Totals.displayName = 'GenericList.Totals';

/**
 * Render props for GenericList Repeater asChild pattern
 */
export interface GenericListRepeaterRenderProps<T extends ListItem = ListItem> {
  items: T[];
  variant?: ListVariant;
  itemRenderer: (
    item: T,
    index: number,
    children: React.ReactNode,
  ) => React.ReactNode;
}

/**
 * Props for the GenericList Repeater component
 */
export interface GenericListRepeaterProps<T extends ListItem = ListItem> {
  /** Function that renders content for each item */
  children:
    | React.ReactNode
    | ((
        props: GenericListRepeaterRenderProps<T>,
        ref: React.Ref<HTMLElement>,
      ) => React.ReactNode);
  /** Function that wraps each item with its container/root component */
  renderItem: (
    item: T,
    children: React.ReactNode,
    index: number,
  ) => React.ReactNode;
  /** Whether to render as child component (asChild pattern) */
  asChild?: boolean;
  /** CSS classes */
  className?: string;
}

/**
 * Generic repeater component that maps over items from GenericList context.
 * This component provides a reusable pattern for rendering lists of items
 * where each item needs to be wrapped in a specific Root component.
 * Supports asChild pattern for advanced layout components.
 *
 * @component
 */
export const Repeater = <T extends ListItem = ListItem>(
  props: GenericListRepeaterProps<T> & { ref?: React.Ref<HTMLElement> },
) => {
  const {
    ref,
    children,
    renderItem,
    asChild = false,
    className,
    ...otherProps
  } = props;
  const { items, variant } = useGenericListContext<T>();

  if (items.length === 0) return null;

  if (asChild) {
    const asChildRenderProps: GenericListRepeaterRenderProps<T> = {
      items,
      variant,
      itemRenderer: (item: T, index: number, children: React.ReactNode) => {
        return renderItem(item, children, index);
      },
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={asChildRenderProps}
        {...otherProps}
      />
    );
  }

  return items.map((item, index) =>
    renderItem(item, children as React.ReactNode, index),
  );
};

Repeater.displayName = 'GenericList.Repeater';

export const Actions = {
  LoadMore,
};

export const GenericList = {
  Root,
  Items,
  Repeater,
  Actions,
  Totals,
};

export { Actions as GenericListActions };
