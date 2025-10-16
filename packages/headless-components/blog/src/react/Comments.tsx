import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';

import React from 'react';
import type {
  BlogPostCommentsServiceConfig,
  CommentWithResolvedFields,
  QueryCommentsSort,
} from '../services/blog-post-comments-service.js';
import * as Comment from './Comment.js';
import { TopLevelCommentRoot } from './CommentInternal.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren, useIntersectionObserver } from './helpers.js';
import { usePostContext } from './Post.js';

export * as CommentCreateForm from './CommentCreateForm.js';

interface CommentsContextValue {
  isLoading: boolean;
  comments: CommentWithResolvedFields[];
}

const CommentsContext = React.createContext<CommentsContextValue | null>(null);

export function useCommentsContext(): CommentsContextValue {
  const context = React.useContext(CommentsContext);
  if (!context) {
    throw new Error('useCommentsContext must be used within a BlogPostComments.Root component');
  }
  return context;
}

const enum TestIds {
  blogPostCommentsRoot = 'blog-post-comments-root',

  blogPostComments = 'blog-post-comments',
  blogPostCommentsSort = 'blog-post-comments-sort',
  blogPostCommentsLoadMore = 'blog-post-comments-load-more',
}

export interface BlogPostCommentsRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasComments: boolean }> | React.ReactNode;
  commentsConfig?: BlogPostCommentsServiceConfig;
}

/**
 * Root container for blog post comments that provides comments context to all child components.
 * Uses IntersectionObserver for lazy loading - comments are loaded when the container becomes visible.
 * Follows Container Level pattern from architecture rules.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Blog } from '@wix/blog/components';
 *
 * function PostPage() {
 *   return (
 *     <Blog.Post.Root blogPostServiceConfig={blogPostServiceConfig}>
 *       <Blog.Post.Comments.Root emptyState={<div>No comments yet</div>}>
 *         <Blog.Post.Comments.CommentRepeater>
 *           <Blog.Post.Comment.Author />
 *           <Blog.Post.Comment.Content />
 *         </Blog.Post.Comments.CommentRepeater>
 *       </Blog.Post.Comments.Root>
 *     </Blog.Post.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogPostCommentsRootProps>(
  (props, forwardedRef) => {
    const { asChild, children, className } = props;
    const { ref, isVisible } = useIntersectionObserver(forwardedRef);
    const { post } = usePostContext();

    if (!post) {
      throw new Error('Blog.Post.Comments.Root must be used within a Blog.Post.Root component');
    }

    const isPaywalled = post.preview ?? false;
    const isDisabledComments = !post.commentingEnabled;

    if (isPaywalled || isDisabledComments) {
      return null;
    }

    return (
      <CoreComments.Comments>
        {({ comments, initialLoad, isLoading }) => {
          // Trigger initial load when component becomes visible
          React.useEffect(() => {
            if (isVisible) {
              initialLoad();
            }
          }, [isVisible, initialLoad]);

          const contextValue: CommentsContextValue = {
            comments,
            isLoading: isLoading() === 'initial',
          };

          const attributes = {
            'data-testid': TestIds.blogPostCommentsRoot,
            'data-visible': isVisible,
            'data-loading': contextValue.isLoading,
          };

          return (
            <CommentsContext.Provider value={contextValue}>
              <AsChildSlot
                ref={ref}
                asChild={asChild}
                className={className}
                {...attributes}
                customElement={children}
              >
                <div>{isValidChildren(children) ? children : null}</div>
              </AsChildSlot>
            </CommentsContext.Provider>
          );
        }}
      </CoreComments.Comments>
    );
  },
);

Root.displayName = 'Blog.Post.Comments.Root';

export interface CommentsProps {
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
 * <BlogPostComments.Comments emptyState={<div>No comments yet</div>}>
 *   <BlogPostComments.CommentRepeater>
 *     <BlogPostComments.CommentAuthor />
 *     <BlogPostComments.CommentContent />
 *   </BlogPostComments.CommentRepeater>
 * </BlogPostComments.Comments>
 * ```
 */
export const Comments = React.forwardRef<HTMLElement, CommentsProps>((props, ref) => {
  const { children, emptyState, loadingState, className } = props;
  const { comments, isLoading } = useCommentsContext();

  if (isLoading && loadingState) {
    return loadingState;
  }

  if (comments.length === 0) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.blogPostComments,
  };

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
});

Comments.displayName = 'Blog.Post.Comments.Comments';

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
   * <BlogPostComments.Sort asChild>
   *   {({ currentSort, sortOptions, setSort }) => (
   *     <CustomSortSelect
   *       value={currentSort}
   *       options={sortOptions}
   *       onChange={setSort}
   *     />
   *   )}
   * </BlogPostComments.Sort>
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
 * This component integrates with the BlogPostComments service to provide predefined sort options
 * and supports both controlled rendering via the asChild pattern and default UI rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <BlogPostComments.Sort />
 *
 * // As list of clickable options
 * <BlogPostComments.Sort as="list" />
 *
 * // With custom styling
 * <BlogPostComments.Sort
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
              data-testid={TestIds.blogPostCommentsSort}
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

Sort.displayName = 'Blog.Post.Comments.Sort';

export interface CommentRepeaterProps {
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
 * <BlogPostComments.CommentRepeater>
 *   <BlogPostComments.CommentAuthor />
 *   <BlogPostComments.CommentContent />
 *   <BlogPostComments.CommentDate />
 * </BlogPostComments.CommentRepeater>
 * ```
 */
export const CommentRepeater = React.forwardRef<HTMLElement, CommentRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { comments } = useCommentsContext();

    if (comments.length === 0) return null;

    return comments.map((comment) => {
      return (
        <TopLevelCommentRoot key={comment._id} comment={comment}>
          <Comment.Root comment={comment} asChild>
            {children}
          </Comment.Root>
        </TopLevelCommentRoot>
      );
    });
  },
);

CommentRepeater.displayName = 'Blog.Post.Comments.CommentRepeater';

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
 * <BlogPostComments.LoadMore asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button
 *       onClick={loadNextPage}
 *       disabled={!hasNextPage || isLoading}
 *     >
 *       {isLoading ? 'Loading...' : 'Load More Comments'}
 *     </button>
 *   )}
 * </BlogPostComments.LoadMore>
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
          'data-testid': TestIds.blogPostCommentsLoadMore,
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

LoadMore.displayName = 'Blog.Post.Comments.LoadMore';
