import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { createServicesMap } from '@wix/services-manager';
import { WixServices, useService } from '@wix/services-manager-react';
import React from 'react';
import {
  CommentsService,
  CommentsServiceDefinition,
  type CommentsServiceConfig,
  type QueryCommentsSort,
} from '../services/comments-service.js';
import * as Comment from './Comment.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren } from './helpers/children.js';
import { useIntersectionObserver } from './helpers/listeners.js';

const enum TestIds {
  root = 'comments-root',
  items = 'comments-items',
  sort = 'comments-sort',
  loadMore = 'comments-load-more',
}

export interface CommentsRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasComments: boolean }> | React.ReactNode;
  currentMember?: unknown;
  commentsServiceConfig: CommentsServiceConfig;
}

const CurrentMemberContext = React.createContext<unknown | undefined>(undefined);

const useCurrentMemberId = (): string | undefined => {
  const currentMember = React.useContext(CurrentMemberContext);

  const currentMemberId =
    typeof currentMember === 'object' &&
    currentMember !== null &&
    '_id' in currentMember &&
    typeof currentMember._id === 'string'
      ? currentMember._id
      : undefined;

  return currentMemberId;
};

/**
 * Root container for comments that provides comments context to all child components.
 * Uses IntersectionObserver for lazy loading - comments are loaded when the container becomes visible.
 *
 * @component
 * @example
 * ```tsx
 * import { Blog, Comment } from '@wix/blog/components';
 *
 * function CommentsSection() {
 *   return (
 *     <Comments.Root commentsServiceConfig={{ contextId, resourceId }}>
 *       <Comments.CommentItemRepeater>
 *         <Comment.Author />
 *         <Comment.Content />
 *       </Comments.CommentItemRepeater>
 *     </Comments.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, CommentsRootProps>((props, forwardedRef) => {
  const { asChild, children, className, currentMember, commentsServiceConfig } = props;
  const { ref, isVisible } = useIntersectionObserver(forwardedRef);

  return (
    <WixServices
      // key: Ensure we re-render the component when the comments config changes
      key={`${commentsServiceConfig.contextId}-${commentsServiceConfig.resourceId}`}
      servicesMap={createServicesMap().addService(
        CommentsServiceDefinition,
        CommentsService,
        commentsServiceConfig,
      )}
    >
      <CurrentMemberContext.Provider value={currentMember}>
        <CoreComments.Comments>
          {({ initialLoad, isLoading }) => {
            // Trigger initial load when component becomes visible
            React.useEffect(() => {
              if (isVisible) {
                initialLoad();
              }
            }, [isVisible, initialLoad]);

            const attributes = {
              'data-testid': TestIds.root,
              'data-visible': isVisible,
              'data-loading': isLoading() === 'initial',
            };

            return (
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                {...attributes}
                customElement={children}
              >
                <div>{isValidChildren(children) ? children : null}</div>
              </AsChildSlot>
            );
          }}
        </CoreComments.Comments>
      </CurrentMemberContext.Provider>
    </WixServices>
  );
});

Root.displayName = 'Comments.Root';

export interface CommentItemsProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
  loadingState?: React.ReactNode;
}

/**
 * Container for the comments list with empty state support.
 * Follows List Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Comments.CommentItems emptyState={<div>No comments yet</div>}>
 *   <Comments.CommentItemRepeater>
 *     <Comment.Author />
 *     <Comment.Content />
 *   </Comments.CommentItemRepeater>
 * </Comments.CommentItems>
 * ```
 */
export const CommentItems = React.forwardRef<HTMLElement, CommentItemsProps>((props, ref) => {
  const { children, emptyState, loadingState, className } = props;
  const service = useService(CommentsServiceDefinition);
  const comments = service.getComments();
  const isLoading = service.isLoading() === 'initial';

  if (isLoading && loadingState) {
    return loadingState;
  }

  if (comments.length === 0) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.items,
  };

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
});

CommentItems.displayName = 'Comments.CommentItems';

export interface SortProps {
  /**
   * Render function that provides sort state and controls when using asChild pattern.
   * Only called when asChild is true and children is provided.
   *
   * @param props.currentSort - Current sort configuration from Wix Comments API
   * @param props.sortOptions - Available sort options with field names and labels
   * @param props.setSort - Function to update the sort configuration
   *
   * @example
   * ```tsx
   * <Comments.Sort asChild>
   *   {({ currentSort, sortOptions, setSort }) => (
   *     <CustomSortSelect
   *       value={currentSort}
   *       options={sortOptions}
   *       onChange={setSort}
   *     />
   *   )}
   * </Comments.Sort>
   * ```
   */
  children?: (props: {
    currentSort: QueryCommentsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryCommentsSort[]) => void;
  }) => React.ReactNode;

  /**
   * CSS classes to apply to the sort component.
   * Only used when asChild is false (default rendering).
   */
  className?: string;

  /**
   * Render mode for the default sort component.
   * - 'select': Renders as HTML select dropdown
   * - 'list': Renders as clickable list of options
   *
   * @default 'select'
   */
  as?: 'select' | 'list';

  /**
   * When true, the component uses the asChild pattern and delegates
   * rendering to the children render function. When false (default),
   * renders the built-in Sort.Root component.
   *
   * @default false
   */
  asChild?: boolean;
}

/**
 * Sort component for comments that provides sorting functionality.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <Comments.Sort />
 *
 * // As list of clickable options
 * <Comments.Sort as="list" />
 *
 * // With custom styling
 * <Comments.Sort
 *   as="select"
 *   className="custom-sort-select"
 * />
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>(
  ({ children, className, as, asChild }, ref) => {
    return (
      <CoreComments.Sort>
        {({ currentSort, sortOptions, setSort }) => {
          if (asChild && children) {
            return children({ currentSort, sortOptions, setSort });
          }

          return (
            <SortPrimitive.Root
              ref={ref}
              value={currentSort}
              onChange={(value) => setSort(value as QueryCommentsSort[])}
              sortOptions={sortOptions}
              as={as}
              className={className}
              data-testid={TestIds.sort}
            >
              {sortOptions.map((option) => {
                if ('fieldName' in option) {
                  return (
                    <SortPrimitive.Option
                      key={option.label}
                      fieldName={option.fieldName}
                      order={'order' in option ? option.order : 'ASC'}
                      label={option.label}
                    />
                  );
                }

                return null;
              })}
            </SortPrimitive.Root>
          );
        }}
      </CoreComments.Sort>
    );
  },
);

Sort.displayName = 'Comments.Sort';

export interface CommentItemRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual comment contexts for each comment.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Comments.CommentItemRepeater>
 *   <Comment.Author />
 *   <Comment.Content />
 *   <Comment.CommentDate />
 * </Comments.CommentItemRepeater>
 * ```
 */
export const CommentItemRepeater = React.forwardRef<HTMLElement, CommentItemRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const service = useService(CommentsServiceDefinition);
    const comments = service.getComments();
    const currentMemberId = useCurrentMemberId();

    if (comments.length === 0) return null;

    return comments.map((comment) => {
      return (
        <CoreComments.TopLevelCommentRoot key={comment._id} comment={comment}>
          <Comment.Root comment={comment} asChild currentMemberId={currentMemberId}>
            {children}
          </Comment.Root>
        </CoreComments.TopLevelCommentRoot>
      );
    });
  },
);

CommentItemRepeater.displayName = 'Comments.CommentItemRepeater';

export interface LoadMoreProps {
  asChild?: boolean;
  className?: string;
  loadingState?: React.ReactNode;
  children?:
    | AsChildChildren<{
        isLoading: boolean;
        loadNextPage: () => Promise<void>;
      }>
    | React.ReactNode;
}

/**
 * Load more trigger component for pagination.
 *
 * @component
 * @example
 * ```tsx
 * <Comments.LoadMore asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button
 *       onClick={loadNextPage}
 *       disabled={!hasNextPage || isLoading}
 *     >
 *       {isLoading ? 'Loading...' : 'Load More Comments'}
 *     </button>
 *   )}
 * </Comments.LoadMore>
 * ```
 */
export const LoadMore = React.forwardRef<HTMLElement, LoadMoreProps>((props, ref) => {
  const { asChild, children, className, loadingState } = props;

  return (
    <CoreComments.Comments>
      {({ hasNextPage: getHasNextPage, isLoading: getIsLoading, loadMore }) => {
        const hasNextPage = getHasNextPage();
        if (!hasNextPage) return null;

        const isLoading = getIsLoading() === 'more';
        const handleClick = () => {
          if (isLoading) return;

          loadMore();
        };
        const dataAttributes = {
          'data-testid': TestIds.loadMore,
          'data-loading': isLoading,
          'data-has-next-page': hasNextPage,
        };
        const buttonAttributes: React.ComponentProps<'button'> = {
          onClick: handleClick,
          type: 'button',
        };

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            {...dataAttributes}
            {...buttonAttributes}
            customElement={children}
            customElementProps={{ isLoading, loadNextPage: handleClick }}
            content={isLoading && loadingState ? loadingState : undefined}
          >
            <button>{isValidChildren(children) ? children : null}</button>
          </AsChildSlot>
        );
      }}
    </CoreComments.Comments>
  );
});

LoadMore.displayName = 'Comments.LoadMore';
