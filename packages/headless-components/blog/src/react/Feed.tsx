import {
  Sort as SortPrimitive,
  GenericList,
  type ListVariant,
  type GenericListRepeaterRenderProps,
} from '@wix/headless-components/react';
import { AsChildChildren, AsChildSlot } from '@wix/headless-utils/react';
import { createServicesMap } from '@wix/services-manager';
import { WixServices } from '@wix/services-manager-react';
import React from 'react';
import {
  BlogFeedService,
  BlogFeedServiceDefinition,
  type BlogFeedServiceConfig,
  type PostWithResolvedFields,
  type QueryPostsSort,
} from '../services/blog-feed-service.js';
import * as CoreFeed from './core/Feed.js';
import { isValidChildren } from './helpers/children.js';
import * as Post from './Post.js';

/** https://manage.wix.com/apps/14bcded7-0066-7c35-14d7-466cb3f09103/extensions/dynamic/wix-vibe-component?component-id=83683a8a-9d7f-437a-9c15-d5cd083530da */
const HTML_CODE_TAG = 'blog.feed';

interface PostsContextValue {
  hasPosts: boolean;
  posts: PostWithResolvedFields[];
  totalPosts: number;
  isLoading: boolean;
  fallbackImageUrl?: string;
}

const PostsContext = React.createContext<PostsContextValue | null>(null);

PostsContext.displayName = 'Blog.Feed.PostsContext';

export function usePostsContext(): PostsContextValue {
  const context = React.useContext(PostsContext);
  if (!context) {
    throw new Error('usePostsContext must be used within a BlogFeed.Root component');
  }
  return context;
}

const enum TestIds {
  blogFeedRoot = 'blog-feed-root',
  blogFeedPosts = 'blog-feed-posts',
  blogFeedSort = 'blog-feed-sort',
  blogFeedLoadMore = 'blog-feed-load-more',
}

export interface BlogFeedRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasPosts: boolean }> | React.ReactNode;
  blogFeedServiceConfig: BlogFeedServiceConfig;
  fallbackImageUrl?: string;
  variant?: ListVariant;
}

/**
 * Root container for blog feed that provides posts context to all child components.
 * Follows Container Level pattern from architecture rules.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { Blog } from '@wix/blog/components';
 *
 * function BlogPage() {
 *   return (
 *     <Blog.Feed.Root>
 *       <Blog.Feed.Posts emptyState={<div>No posts found</div>}>
 *         <Blog.Feed.PostRepeater>
 *           <Blog.Post.Title />
 *           <Blog.Post.Excerpt />
 *         </Blog.Feed.PostRepeater>
 *       </Blog.Feed.Posts>
 *     </Blog.Feed.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogFeedRootProps>((props, ref) => {
  const { asChild, children, className, blogFeedServiceConfig, fallbackImageUrl, variant } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        BlogFeedServiceDefinition,
        BlogFeedService,
        blogFeedServiceConfig,
      )}
    >
      <CoreFeed.Posts>
        {({ posts, hasPosts, totalPosts, isLoading, hasNextPage, loadNextPage }) => {
          const contextValue: PostsContextValue = {
            hasPosts,
            posts,
            totalPosts,
            isLoading,
            fallbackImageUrl,
          };

          const items = posts.map((post) => ({ ...post, id: post._id }));

          const attributes = {
            'data-component-tag': HTML_CODE_TAG,
            'data-testid': TestIds.blogFeedRoot,
            'data-has-posts': hasPosts,
            'data-loading': isLoading,
          };

          return (
            <PostsContext.Provider value={contextValue}>
              <GenericList.Root
                items={items}
                loadMore={loadNextPage}
                hasMore={hasNextPage}
                isLoading={isLoading}
                variant={variant}
              >
                <AsChildSlot
                  ref={ref}
                  asChild={asChild}
                  className={className}
                  {...attributes}
                  customElement={children}
                  customElementProps={{ hasPosts }}
                >
                  <div>{isValidChildren(children) ? children : null}</div>
                </AsChildSlot>
              </GenericList.Root>
            </PostsContext.Provider>
          );
        }}
      </CoreFeed.Posts>
    </WixServices>
  );
});

Root.displayName = 'Blog.Feed.Root';

export interface PostItemsProps {
  children: React.ReactNode;
  className?: string;
  emptyState?: React.ReactNode;
}

/**
 * Container for the posts list with empty state support.
 * Follows List Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Feed.PostItems emptyState={<div>No posts found</div>}>
 *   <Blog.Feed.PostRepeater>
 *     <Blog.Post.Title />
 *     <Blog.Post.Excerpt />
 *   </Blog.Feed.PostRepeater>
 * </Blog.Feed.PostItems>
 * ```
 */
export const PostItems = React.forwardRef<HTMLElement, PostItemsProps>((props, ref) => {
  const { children, emptyState, className } = props;

  return (
    <GenericList.Items
      ref={ref}
      emptyState={emptyState}
      className={className}
      data-testid={TestIds.blogFeedPosts}
    >
      {children}
    </GenericList.Items>
  );
});

PostItems.displayName = 'Blog.Feed.PostItems';

export type PostRepeaterRenderProps =
  GenericListRepeaterRenderProps<PostWithResolvedFields>;

export interface SortProps {
  /**
   * Render function that provides sort state and controls when using asChild pattern.
   * Only called when asChild is true and children is provided.
   *
   * @param props.currentSort - Current sort configuration from Wix Blog API
   * @param props.sortOptions - Available sort options with field names, order, and labels
   * @param props.setSort - Function to update the sort configuration
   *
   * @example
   * ```tsx
   * <BlogFeed.Sort asChild>
   *   {({ currentSort, sortOptions, setSort }) => (
   *     <CustomSortSelect
   *       value={currentSort}
   *       options={sortOptions}
   *       onChange={setSort}
   *     />
   *   )}
   * </BlogFeed.Sort>
   * ```
   */
  children?: (props: {
    currentSort: QueryPostsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryPostsSort[]) => void;
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
 * Sort component for blog feed that provides sorting functionality.
 *
 * This component integrates with the BlogFeed service to provide predefined sort options
 * supports both controlled rendering via the asChild pattern and default UI rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <Blog.Feed.Sort />
 *
 * // As list of clickable options
 * <Blog.Feed.Sort as="list" />
 *
 * // With custom styling
 * <Blog.Feed.Sort
 *   as="select"
 *   className="custom-sort-select"
 * />
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>(
  ({ children, className, as, asChild }, ref) => {
    return (
      <CoreFeed.Sort>
        {({ currentSort, sortOptions, setSort }) => {
          if (asChild && children) {
            return children({ currentSort, sortOptions, setSort });
          }

          return (
            <SortPrimitive.Root
              ref={ref}
              value={currentSort}
              onChange={(value) => setSort(value as QueryPostsSort[])}
              sortOptions={sortOptions}
              as={as}
              className={className}
              data-testid={TestIds.blogFeedSort}
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
      </CoreFeed.Sort>
    );
  },
);

Sort.displayName = 'Blog.Feed.Sort';

export interface PostItemRepeaterProps {
  children:
    | React.ReactNode
    | ((props: PostRepeaterRenderProps, ref: React.Ref<HTMLElement>) => React.ReactNode);
  offset?: number;
  limit?: number;
  asChild?: boolean;
}

/**
 * Repeater component that creates individual post contexts for each post.
 * Follows Repeater Level pattern from architecture rules and uses GenericList.Repeater for consistency.
 * Supports asChild pattern for advanced layout components.
 *
 * @component
 * @example
 * ```tsx
 * // Standard usage
 * <Blog.Feed.PostItemRepeater>
 *   <Blog.Post.Title />
 *   <Blog.Post.Excerpt />
 *   <Blog.Post.PublishDate />
 * </Blog.Feed.PostItemRepeater>
 *
 * // With offset/limit
 * <Blog.Feed.PostItemRepeater offset={0} limit={10}>
 *   <Blog.Post.Title />
 * </Blog.Feed.PostItemRepeater>
 *
 * // AsChild usage with custom wrapper
 * <Blog.Feed.PostItemRepeater asChild>
 *   {({ items, variant, itemWrapper }) => (
 *     <CustomWrapper
 *       items={items}
 *       variant={variant}
 *       itemRenderer={(item, index) =>
 *         itemWrapper({ item, index, children: <>
 *           <Blog.Post.Title />
 *           <Blog.Post.Excerpt />
 *         </> })
 *       }
 *     />
 *   )}
 * </Blog.Feed.PostItemRepeater>
 * ```
 */
export const PostItemRepeater = React.forwardRef<HTMLElement, PostItemRepeaterProps>(
  (props, ref) => {
    const { children, offset = 0, limit = Infinity, asChild } = props;
    const { fallbackImageUrl } = usePostsContext();

    const itemWrapper: GenericList.GenericListRepeaterProps<PostWithResolvedFields>['itemWrapper'] = ({
      item: post,
      children,
    }) => (
      <Post.Root
        key={post._id}
        post={post}
        asChild
        fallbackImageUrl={fallbackImageUrl}
      >
        {children}
      </Post.Root>
    );


    // If offset/limit are used, use asChild pattern to access items and slice them
    if (offset !== 0 || limit !== Infinity) {
      return (
        <GenericList.Repeater<PostWithResolvedFields>
          ref={ref}
          asChild={true}
          itemWrapper={itemWrapper}
        >
          {({ items, itemWrapper: wrapper }) => {
            const postsSlice = items.slice(offset, offset + limit);
            return (
              <>
                {postsSlice.map((post, index) =>
                  wrapper({
                    item: post,
                    index,
                    children: children as React.ReactNode,
                  }),
                )}
              </>
            );
          }}
        </GenericList.Repeater>
      );
    }

    // Otherwise use GenericList.Repeater normally
    return (
      <GenericList.Repeater<PostWithResolvedFields>
        ref={ref}
        asChild={asChild}
        itemWrapper={itemWrapper}
      >
        {children}
      </GenericList.Repeater>
    );
  },
);

PostItemRepeater.displayName = 'Blog.Feed.PostItemRepeater';

export interface LoadMoreProps {
  className?: string;
  loadingState?: React.ReactNode;
  children?: React.ReactNode;
}

/**
 * Load more trigger component for pagination.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Feed.LoadMore>
 *   <button>Load More</button>
 * </Blog.Feed.LoadMore>
 * ```
 */
export const LoadMore = React.forwardRef<HTMLButtonElement, LoadMoreProps>(
  (props, ref) => {
    const { children, className, loadingState } = props;

    return (
      <GenericList.Actions.LoadMore
        ref={ref}
        className={className}
        loadingState={loadingState}
        data-testid={TestIds.blogFeedLoadMore}
      >
        {children}
      </GenericList.Actions.LoadMore>
    );
  },
);

LoadMore.displayName = 'Blog.Feed.LoadMore';
