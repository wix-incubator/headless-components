import React from 'react';
import { AsChildSlot, AsChildChildren } from '@wix/headless-utils/react';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { categories, posts, tags } from '@wix/blog';
import * as CoreBlogFeed from './core/BlogFeed.js';
import type {
  PostWithResolvedFields,
  BlogFeedServiceConfig,
  QueryPostsSort,
} from '../services/blog-feed-service.js';
import { createAuthorName, isValidChildren } from './helpers.js';

interface PostsContextValue {
  hasPosts: boolean;
  posts: PostWithResolvedFields[];
}

const PostsContext = React.createContext<PostsContextValue | null>(null);

export function usePostsContext(): PostsContextValue {
  const context = React.useContext(PostsContext);
  if (!context) {
    throw new Error(
      'usePostsContext must be used within a BlogFeed.Root component',
    );
  }
  return context;
}

interface FeedPostContextValue {
  post: PostWithResolvedFields;
  hasPost: boolean;
}

const FeedPostContext = React.createContext<FeedPostContextValue | null>(null);

export function useFeedPostContext(): FeedPostContextValue {
  const context = React.useContext(FeedPostContext);
  if (!context) {
    throw new Error(
      'useFeedPostContext must be used within a BlogFeed.PostRepeater component',
    );
  }
  return context;
}

interface PostCategoriesContextValue {
  categories: categories.Category[];
}

const PostCategoriesContext =
  React.createContext<PostCategoriesContextValue | null>(null);

export function usePostCategoriesContext(): PostCategoriesContextValue {
  const context = React.useContext(PostCategoriesContext);
  if (!context) {
    throw new Error(
      'usePostCategoriesContext must be used within a BlogFeed.PostCategories component',
    );
  }
  return context;
}

interface CategoryContextValue {
  category: posts.Category;
  hasCategory: boolean;
}

const CategoryContext = React.createContext<CategoryContextValue | null>(null);

export function useCategoryContext(): CategoryContextValue {
  const context = React.useContext(CategoryContext);
  if (!context) {
    throw new Error(
      'useCategoryContext must be used within a BlogFeed.PostCategoryRepeater component',
    );
  }
  return context;
}

interface PostTagsContextValue {
  tags: tags.BlogTag[];
}

const PostTagsContext = React.createContext<PostTagsContextValue | null>(null);

export function usePostTagsContext(): PostTagsContextValue {
  const context = React.useContext(PostTagsContext);
  if (!context) {
    throw new Error(
      'usePostTagsContext must be used within a BlogFeed.PostTags component',
    );
  }
  return context;
}

interface TagContextValue {
  tag: tags.BlogTag;
}

const TagContext = React.createContext<TagContextValue | null>(null);

export function useTagContext(): TagContextValue {
  const context = React.useContext(TagContext);
  if (!context) {
    throw new Error(
      'useTagContext must be used within a BlogFeed.PostTagRepeater component',
    );
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
  blogFeedConfig?: BlogFeedServiceConfig;
}

/**
 * Root container for blog feed that provides posts context to all child components.
 * Follows Container Level pattern from architecture rules.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { BlogFeed } from '@wix/headless-blog/react';
 *
 * function BlogPage() {
 *   return (
 *     <BlogFeed.Root>
 *       <BlogFeed.Posts emptyState={<div>No posts found</div>}>
 *         <BlogFeed.PostRepeater>
 *           <BlogPost.Title />
 *           <BlogPost.Excerpt />
 *         </BlogFeed.PostRepeater>
 *       </BlogFeed.Posts>
 *     </BlogFeed.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, BlogFeedRootProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreBlogFeed.Posts>
        {({ posts, hasPosts }) => {
          const contextValue: PostsContextValue = {
            hasPosts,
            posts,
          };

          const attributes = {
            'data-testid': TestIds.blogFeedRoot,
            'data-has-posts': hasPosts,
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
      </CoreBlogFeed.Posts>
    );
  },
);

export interface PostsProps {
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
 * <BlogFeed.Posts emptyState={<div>No posts found</div>}>
 *   <BlogFeed.PostRepeater>
 *     <BlogPost.Title />
 *     <BlogPost.Excerpt />
 *   </BlogFeed.PostRepeater>
 * </BlogFeed.Posts>
 * ```
 */
export const Posts = React.forwardRef<HTMLElement, PostsProps>((props, ref) => {
  const { children, emptyState, className } = props;
  const { hasPosts } = usePostsContext();

  if (!hasPosts) {
    return emptyState || null;
  }

  const attributes = {
    'data-testid': TestIds.blogFeedPosts,
  };

  return (
    <div
      {...attributes}
      ref={ref as React.Ref<HTMLDivElement>}
      className={className}
    >
      {children}
    </div>
  );
});

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
 * Sort component for product lists that provides sorting functionality.
 *
 * This component integrates with the BlogFeed service to provide predefined sort options
 * supports both controlled rendering via the asChild pattern and default UI rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default select dropdown
 * <BlogFeed.Sort />
 *
 * // As list of clickable options
 * <BlogFeed.Sort as="list" />
 *
 * // With custom styling
 * <BlogFeed.Sort
 *   as="select"
 *   className="custom-sort-select"
 * />
 * ```
 */
export const Sort = React.forwardRef<HTMLElement, SortProps>(
  ({ children, className, as, asChild }, ref) => {
    return (
      <CoreBlogFeed.Sort>
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
      </CoreBlogFeed.Sort>
    );
  },
);

export interface PostRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual post contexts for each post.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogFeed.PostRepeater>
 *   <BlogFeed.PostTitle />
 *   <BlogFeed.PostExcerpt />
 *   <BlogFeed.PostAuthor />
 *   <BlogFeed.PostPublishDate />
 * </BlogFeed.PostRepeater>
 * ```
 */
export const PostRepeater = React.forwardRef<HTMLElement, PostRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { hasPosts, posts } = usePostsContext();

    if (!hasPosts) return null;

    return (
      <>
        {posts.map((post: PostWithResolvedFields) => {
          const contextValue: FeedPostContextValue = {
            post,
            hasPost: Boolean(post),
          };

          return (
            <FeedPostContext.Provider key={post._id} value={contextValue}>
              {children}
            </FeedPostContext.Provider>
          );
        })}
      </>
    );
  },
);

export interface LoadMoreProps {
  asChild?: boolean;
  className?: string;
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
 * <BlogFeed.LoadMore asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button
 *       onClick={loadNextPage}
 *       disabled={!hasNextPage || isLoading}
 *     >
 *       {isLoading ? 'Loading...' : 'Load More'}
 *     </button>
 *   )}
 * </BlogFeed.LoadMore>
 * ```
 */
export const LoadMore = React.forwardRef<HTMLElement, LoadMoreProps>(
  (props, ref) => {
    const { asChild, children, className } = props;

    return (
      <CoreBlogFeed.LoadMore>
        {({ hasNextPage, isLoading, loadNextPage }) => {
          if (!hasNextPage) return null;

          const attributes = {
            'data-testid': TestIds.blogFeedLoadMore,
            'data-loading': isLoading,
            'data-has-next-page': hasNextPage,
          };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              disabled={isLoading}
              {...attributes}
              customElement={children}
              customElementProps={{ isLoading, loadNextPage }}
            >
              <button onClick={loadNextPage}>
                {isLoading ? 'Loading...' : 'Load More'}
              </button>
            </AsChildSlot>
          );
        }}
      </CoreBlogFeed.LoadMore>
    );
  },
);

export interface PostTitleProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{ title: string; slug: string; postId: string }>
    | React.ReactNode;
}

/**
 * Displays the post title within feed context.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogFeed.PostTitle />
 *
 * // Custom styling
 * <BlogFeed.PostTitle className="text-xl font-semibold line-clamp-2" />
 *
 * // Custom rendering with asChild
 * <BlogFeed.PostTitle asChild>
 *   {({ title, slug, postId }) => (
 *     <h3 className="post-title" data-post-id={postId}>
 *       {title}
 *     </h3>
 *   )}
 * </BlogFeed.PostTitle>
 * ```
 */
export const PostTitle = React.forwardRef<HTMLElement, PostTitleProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = useFeedPostContext();

    if (!post?.title) return null;

    const title = post.title;
    const attributes = {
      'data-testid': TestIds.blogFeedPostTitle,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{
          title,
          slug: post.slug || '',
          postId: post._id || '',
        }}
        content={title}
      >
        <h2>{title}</h2>
      </AsChildSlot>
    );
  },
);

export interface PostExcerptProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ excerpt: string }> | React.ReactNode;
}

/**
 * Displays the post excerpt within feed context.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogFeed.PostExcerpt />
 *
 * // Custom styling with line clamping
 * <BlogFeed.PostExcerpt className="text-gray-600 line-clamp-3" />
 *
 * // Custom rendering with asChild
 * <BlogFeed.PostExcerpt asChild>
 *   {({ excerpt }) => (
 *     <p className="post-excerpt">{excerpt.substring(0, 100)}...</p>
 *   )}
 * </BlogFeed.PostExcerpt>
 * ```
 */
export const PostExcerpt = React.forwardRef<HTMLElement, PostExcerptProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { post } = useFeedPostContext();

    if (!post?.excerpt) return null;

    const excerpt = post.excerpt;
    const attributes = {
      'data-testid': TestIds.blogFeedPostExcerpt,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ excerpt }}
        content={excerpt}
      >
        <p>{excerpt}</p>
      </AsChildSlot>
    );
  },
);

export interface PostCoverImageProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{ imageUrl: string; alt: string }>
    | React.ReactNode;
}

export const PostCoverImage = React.forwardRef<
  HTMLElement,
  PostCoverImageProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { post } = useFeedPostContext();

  const imageUrl = post?.resolvedFields?.coverImageUrl;
  const alt =
    post?.resolvedFields?.coverImageAlt || post?.title || 'Blog post cover';

  if (!imageUrl) return null;

  const attributes = {
    'data-testid': TestIds.blogFeedPostCoverImage,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ imageUrl, alt }}
    >
      <img src={imageUrl} alt={alt} />
    </AsChildSlot>
  );
});

export interface PostAuthorNameProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        authorName: string;
      }>
    | React.ReactNode;
}

export const PostAuthorName = React.forwardRef<
  HTMLElement,
  PostAuthorNameProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { post } = useFeedPostContext();

  const owner = post?.resolvedFields?.owner;
  if (!owner) return null;

  const authorName = createAuthorName(owner);

  const attributes = {
    'data-testid': TestIds.blogFeedPostAuthorName,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{
        authorName,
      }}
      content={authorName}
    >
      <span>{authorName}</span>
    </AsChildSlot>
  );
});

export interface PostAuthorAvatarProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        authorNameInitials: string;
        authorAvatarUrl: string | undefined;
      }>
    | React.ReactNode;
}

export const PostAuthorAvatar = React.forwardRef<
  HTMLElement,
  PostAuthorAvatarProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { post } = useFeedPostContext();

  const owner = post?.resolvedFields?.owner;
  if (!owner) return null;

  const [error, setError] = React.useState(false);
  const authorName = createAuthorName(owner);
  const authorAvatarUrl = owner.profile?.photo?.url;
  const authorAvatarInitials = owner.profile?.nickname
    ?.split(' ')
    .map((name) => name[0]?.toLocaleUpperCase())
    .filter((char) => char && /[A-Z]/i.test(char))
    .join('');

  const attributes = {
    'data-testid': TestIds.blogFeedPostAuthorAvatar,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{
        authorAvatarUrl,
        authorAvatarInitials,
      }}
      content={authorName}
    >
      {authorAvatarUrl && !error ? (
        <img
          src={authorAvatarUrl}
          alt={authorAvatarInitials}
          onError={() => setError(true)}
        />
      ) : (
        <span>{authorAvatarInitials}</span>
      )}
    </AsChildSlot>
  );
});

export interface PostPublishDateProps {
  asChild?: boolean;
  className?: string;
  locale: Intl.LocalesArgument;
  children?:
    | AsChildChildren<{ publishDate: string; formattedDate: string }>
    | React.ReactNode;
}

export const PostPublishDate = React.forwardRef<
  HTMLElement,
  PostPublishDateProps
>((props, ref) => {
  const { asChild, children, className, locale } = props;
  const { post } = useFeedPostContext();

  const publishDate = post?.firstPublishedDate;
  if (!publishDate) return null;

  const formattedDate = new Date(publishDate).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  // Ensure publishDate is a string for dateTime attribute
  const dateTimeString =
    typeof publishDate === 'string' ? publishDate : publishDate.toISOString();

  const attributes = {
    'data-testid': TestIds.blogFeedPostPublishDate,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ publishDate: dateTimeString, formattedDate }}
      content={formattedDate}
    >
      <time dateTime={dateTimeString}>{formattedDate}</time>
    </AsChildSlot>
  );
});

export interface PostCategoriesProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container for post categories that provides categories context to all child components.
 * Does not render if no categories are available.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogFeed.PostCategories>
 *   <BlogFeed.PostCategoryRepeater>
 *     <BlogFeed.PostCategoryLink baseUrl="/category/" />
 *   </BlogFeed.PostCategoryRepeater>
 * </BlogFeed.PostCategories>
 * ```
 */
export const PostCategories = React.forwardRef<
  HTMLElement,
  PostCategoriesProps
>((props, ref) => {
  const { children, className } = props;
  const { post } = useFeedPostContext();

  const categories = post?.resolvedFields?.categories || [];
  const hasCategories = categories.length > 0;

  if (!hasCategories) return null;

  const contextValue: PostCategoriesContextValue = {
    categories,
  };

  const attributes = {
    'data-testid': TestIds.blogFeedPostCategories,
  };

  return (
    <PostCategoriesContext.Provider value={contextValue}>
      <div
        {...attributes}
        ref={ref as React.Ref<HTMLDivElement>}
        className={className}
      >
        {children}
      </div>
    </PostCategoriesContext.Provider>
  );
});

export interface PostCategoryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual category contexts for each category.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogFeed.PostCategoryRepeater>
 *   <BlogFeed.PostCategoryLink baseUrl="/category/" className="badge-category" />
 * </BlogFeed.PostCategoryRepeater>
 * ```
 */
export const PostCategoryRepeater = React.forwardRef<
  HTMLElement,
  PostCategoryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { categories } = usePostCategoriesContext();

  if (categories.length === 0) return null;

  return (
    <>
      {categories.map((category) => {
        const contextValue: CategoryContextValue = {
          category,
          hasCategory: Boolean(category),
        };

        return (
          <CategoryContext.Provider key={category._id} value={contextValue}>
            {children}
          </CategoryContext.Provider>
        );
      })}
    </>
  );
});

export interface PostCategoryLinkProps {
  asChild?: boolean;
  className?: string;
  /** Prepended to the slug to form the full URL */
  baseUrl?: string;
  children?:
    | AsChildChildren<{ href: string; category: posts.Category }>
    | React.ReactNode;
}

export const PostCategoryLink = React.forwardRef<
  HTMLElement,
  PostCategoryLinkProps
>((props, ref) => {
  const { asChild, children, className, baseUrl = '' } = props;
  const { category } = useCategoryContext();

  if (!category?.label) return null;

  const href = `${baseUrl}${category.slug}`;

  const attributes = {
    'data-testid': TestIds.blogFeedPostCategory,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ category, href }}
      content={category.label}
    >
      <a href={href}>{category.label}</a>
    </AsChildSlot>
  );
});

export interface PostCategoryLabelProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ category: posts.Category }> | React.ReactNode;
}

export const PostCategoryLabel = React.forwardRef<
  HTMLElement,
  PostCategoryLabelProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { category } = useCategoryContext();

  if (!category?.label) return null;

  const attributes = {
    'data-testid': TestIds.blogFeedPostCategory,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ category }}
      content={category.label}
    >
      <span>{category.label}</span>
    </AsChildSlot>
  );
});

export interface PostTagsProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container for post tags that provides tags context to all child components.
 * Does not render if no tags are available.
 * Follows Container Level pattern from architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <BlogFeed.PostTags>
 *   <BlogFeed.PostTagRepeater>
 *     <BlogFeed.PostTag />
 *   </BlogFeed.PostTagRepeater>
 * </BlogFeed.PostTags>
 * ```
 */
export const PostTags = React.forwardRef<HTMLElement, PostTagsProps>(
  (props, ref) => {
    const { children, className } = props;
    const { post } = useFeedPostContext();

    const tags = post?.resolvedFields?.tags || [];
    const hasTags = tags.length > 0;

    if (!hasTags) return null;

    const contextValue: PostTagsContextValue = {
      tags,
    };

    const attributes = {
      'data-testid': TestIds.blogFeedPostTags,
    };

    return (
      <PostTagsContext.Provider value={contextValue}>
        <div
          {...attributes}
          ref={ref as React.Ref<HTMLDivElement>}
          className={className}
        >
          {children}
        </div>
      </PostTagsContext.Provider>
    );
  },
);

export interface PostTagRepeaterProps {
  children: React.ReactNode;
}

export const PostTagRepeater = React.forwardRef<
  HTMLElement,
  PostTagRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { tags } = usePostTagsContext();

  if (tags.length === 0) return null;

  return (
    <>
      {tags.map((tag) => {
        const contextValue: TagContextValue = {
          tag,
        };

        return (
          <TagContext.Provider key={tag._id} value={contextValue}>
            {children}
          </TagContext.Provider>
        );
      })}
    </>
  );
});

export interface PostTagProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ tag: tags.BlogTag }> | React.ReactNode;
}

export const PostTag = React.forwardRef<HTMLElement, PostTagProps>(
  (props, ref) => {
    const { asChild, children, className } = props;
    const { tag } = useTagContext();

    if (!tag?.label) return null;

    const attributes = {
      'data-testid': TestIds.blogFeedPostTag,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ tag }}
        content={tag.label}
      >
        <span>{tag.label}</span>
      </AsChildSlot>
    );
  },
);

export interface PostLinkProps {
  asChild?: boolean;
  className?: string;
  /** Prepended to the slug to form the full URL */
  baseUrl?: string;
  children?: AsChildChildren<{ href: string; slug: string }> | React.ReactNode;
}

/**
 * Creates a link to the full blog post with customizable rendering.
 *
 * @component
 * @example
 * ```tsx
 * // Default link
 * <BlogFeed.PostLink baseUrl="/blog/" />
 *
 * // Custom rendering with asChild
 * <BlogFeed.PostLink baseUrl="/blog/" asChild>
 *   {({ href }) => (
 *     <Link to={href} className="block hover:shadow-lg transition-shadow">
 *       <BlogFeed.PostTitle />
 *       <BlogFeed.PostExcerpt />
 *     </Link>
 *   )}
 * </BlogFeed.PostLink>
 * ```
 */
export const PostLink = React.forwardRef<HTMLAnchorElement, PostLinkProps>(
  (props, ref) => {
    const { asChild, children, className, baseUrl = '' } = props;
    const { post } = useFeedPostContext();

    const slug = post?.slug;
    if (!slug) return null;

    const href = `${baseUrl}${slug}`;

    const attributes = {
      'data-testid': TestIds.blogFeedPostLink,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        {...attributes}
        customElement={children}
        customElementProps={{ href, slug }}
        content={children}
      >
        <a href={href}>{isValidChildren(children) ? children : slug}</a>
      </AsChildSlot>
    );
  },
);

export interface PostReadingTimeProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{ readingTime: number; readingTimeText: string }>
    | React.ReactNode;
}

/**
 * Displays the reading time within feed context using the post's minutesToRead field.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <BlogFeed.PostReadingTime />
 *
 * // Custom rendering with asChild
 * <BlogFeed.PostReadingTime asChild>
 *   {({ readingTime }) => (
 *     <span className="text-gray-500">{readingTime} min read</span>
 *   )}
 * </BlogFeed.PostReadingTime>
 * ```
 */
export const PostReadingTime = React.forwardRef<
  HTMLElement,
  PostReadingTimeProps
>((props, ref) => {
  const { asChild, children, className } = props;
  const { post } = useFeedPostContext();

  const readingTime = post?.minutesToRead ?? 0;
  if (readingTime <= 0) return null;

  const attributes = {
    'data-testid': TestIds.blogFeedPostReadingTime,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ readingTime }}
      content={readingTime}
    >
      <span>{readingTime}</span>
    </AsChildSlot>
  );
});
