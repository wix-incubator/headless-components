import { Sort as SortPrimitive } from '@wix/headless-components/react';
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
import { isValidChildren } from './helpers.js';
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
  blogFeedPost = 'blog-feed-post',
  blogFeedSort = 'blog-feed-sort',
  blogFeedLoadMore = 'blog-feed-load-more',
  blogFeedPostTitle = 'blog-feed-post-title',
  blogFeedPostExcerpt = 'blog-feed-post-excerpt',
  blogFeedPostContent = 'blog-feed-post-content',
  blogFeedPostCoverImage = 'blog-feed-post-cover-image',
  blogFeedPostAuthorName = 'blog-feed-post-author-name',
  blogFeedPostAuthorAvatar = 'blog-feed-post-author-avatar',
  blogFeedPostPublishDate = 'blog-feed-post-publish-date',
  blogFeedPostReadingTime = 'blog-feed-post-reading-time',
  blogFeedPostTags = 'blog-feed-post-tags',
  blogFeedPostTagOptions = 'blog-feed-post-tag-options',
  blogFeedPostTag = 'blog-feed-post-tag',
  blogFeedPostCategories = 'blog-feed-post-categories',
  blogFeedPostCategoryOptions = 'blog-feed-post-category-options',
  blogFeedPostCategory = 'blog-feed-post-category',
  blogFeedPostLink = 'blog-feed-post-link',
}

export interface BlogFeedRootProps {
  asChild?: boolean;
  className?: string;
  children: AsChildChildren<{ hasPosts: boolean }> | React.ReactNode;
  blogFeedServiceConfig: BlogFeedServiceConfig;
  fallbackImageUrl?: string;
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
  const { asChild, children, className, blogFeedServiceConfig, fallbackImageUrl } = props;

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        BlogFeedServiceDefinition,
        BlogFeedService,
        blogFeedServiceConfig,
      )}
    >
      <CoreFeed.Posts>
        {({ posts, hasPosts, totalPosts, isLoading }) => {
          const contextValue: PostsContextValue = {
            hasPosts,
            posts,
            totalPosts,
            isLoading,
            fallbackImageUrl,
          };

          const attributes = {
            'data-component-tag': HTML_CODE_TAG,
            'data-testid': TestIds.blogFeedRoot,
            'data-has-posts': hasPosts,
            'data-loading': isLoading,
          };

          return (
            <PostsContext.Provider value={contextValue}>
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
  const { hasPosts, isLoading } = usePostsContext();

  if (!hasPosts) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.blogFeedPosts,
    'data-loading': isLoading,
  };

  return (
    <div {...attributes} ref={ref as React.Ref<HTMLDivElement>} className={className}>
      {children}
    </div>
  );
});

PostItems.displayName = 'Blog.Feed.PostItems';

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
  children: React.ReactNode;
  offset?: number;
  limit?: number;
}

/**
 * Repeater component that creates individual post contexts for each post.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Feed.PostItemRepeater>
 *   <Blog.Post.Title />
 *   <Blog.Post.Excerpt />
 *   <Blog.Post.AuthorName />
 *   <Blog.Post.PublishDate />
 * </Blog.Feed.PostItemRepeater>
 * ```
 */
export const PostItemRepeater = React.forwardRef<HTMLElement, PostItemRepeaterProps>(
  (props, _ref) => {
    const { children, offset = 0, limit = Infinity } = props;
    const { hasPosts, posts, fallbackImageUrl } = usePostsContext();

    if (!hasPosts) return null;

    const postsSlice = posts.slice(offset, offset + limit);

    return (
      <>
        {postsSlice.map((post) => {
          return (
            <Post.Root key={post._id} post={post} asChild fallbackImageUrl={fallbackImageUrl}>
              {children}
            </Post.Root>
          );
        })}
      </>
    );
  },
);

PostItemRepeater.displayName = 'Blog.Feed.PostItemRepeater';

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
 * <Blog.Feed.LoadMore asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button
 *       onClick={loadNextPage}
 *       disabled={!hasNextPage || isLoading}
 *     >
 *       {isLoading ? 'Loading...' : 'Load More'}
 *     </button>
 *   )}
 * </Blog.Feed.LoadMore>
 * ```
 */
export const LoadMore = React.forwardRef<HTMLElement, LoadMoreProps>((props, ref) => {
  const { asChild, children, className, loadingState } = props;

  return (
    <CoreFeed.LoadMore>
      {({ hasNextPage, isLoading, loadNextPage }) => {
        if (!hasNextPage) return null;

        const attributes: React.ButtonHTMLAttributes<HTMLButtonElement> & {
          'data-testid'?: string;
          'data-loading'?: boolean;
          'data-has-next-page'?: boolean;
        } = {
          'data-testid': TestIds.blogFeedLoadMore,
          'data-loading': isLoading,
          'data-has-next-page': hasNextPage,
          onClick: loadNextPage,
        };

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            {...attributes}
            customElement={children}
            content={isLoading && loadingState ? loadingState : undefined}
            customElementProps={{
              isLoading,
              loadNextPage,
            }}
          >
            <button>{isValidChildren(children) ? children : null}</button>
          </AsChildSlot>
        );
      }}
    </CoreFeed.LoadMore>
  );
});

LoadMore.displayName = 'Blog.Feed.LoadMore';
