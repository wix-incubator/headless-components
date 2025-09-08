import type { Sort as SortPrimitive } from '@wix/headless-components/react';
import { useService } from '@wix/services-manager-react';
import type {
  BlogFeedServiceAPI,
  PostWithResolvedFields,
  BlogFeedServiceConfig,
  QueryPostsSort,
} from '../../services/blog-feed-service.js';
import { BlogFeedServiceDefinition } from '../../services/blog-feed-service.js';
import React from 'react';

/**
 * Props for BlogFeed Root core component
 */
export interface RootProps {
  children: React.ReactNode;
  blogFeedConfig?: BlogFeedServiceConfig;
}

/**
 * Core BlogFeed Root component that provides BlogFeed service context.
 * This is the service-connected component that should be wrapped by the public API.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>(
  (props, ref) => {
    const { children } = props;

    return <div ref={ref}>{children}</div>;
  },
);

/**
 * Props for BlogFeed Posts core component
 */
export interface PostsProps {
  children: (props: PostsRenderProps) => React.ReactNode;
}

export interface PostsRenderProps {
  posts: ReturnType<BlogFeedServiceAPI['posts']['get']>;
  isLoading: ReturnType<BlogFeedServiceAPI['isLoading']['get']>;
  isEmpty: ReturnType<BlogFeedServiceAPI['isEmpty']>;
  hasNextPage: ReturnType<BlogFeedServiceAPI['hasNextPage']>;
  loadNextPage: BlogFeedServiceAPI['loadNextPage'];
  hasPosts: boolean;
  totalPosts: number;
}

/**
 * Core Posts component that provides posts data access
 */
export const Posts = (props: PostsProps) => {
  const service = useService(BlogFeedServiceDefinition);
  const posts = service.posts.get();
  const hasPosts = posts.length > 0;

  return props.children({
    posts,
    isLoading: service.isLoading.get(),
    isEmpty: service.isEmpty(),
    hasNextPage: service.hasNextPage(),
    loadNextPage: service.loadNextPage,
    hasPosts,
    totalPosts: service.totalPosts.get(),
  });
};

/**
 * Props for BlogFeed ItemContent core component
 */
export interface ItemContentProps {
  children: (props: ItemContentRenderProps) => React.ReactNode;
}

export interface ItemContentRenderProps {
  post: PostWithResolvedFields;
}

/**
 * Core ItemContent component that maps over posts and provides individual post context.
 * This is used by the repeater to provide post data to each item.
 */
export const ItemContent = (props: ItemContentProps) => {
  const service = useService(BlogFeedServiceDefinition);
  const posts = service.posts.get();

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <>
      {posts.map((post: PostWithResolvedFields) => (
        <React.Fragment key={post._id}>
          {props.children({ post })}
        </React.Fragment>
      ))}
    </>
  );
};

/**
 * Props for BlogFeed EmptyState core component
 */
export interface EmptyStateProps {
  children: React.ReactNode;
}

/**
 * Core EmptyState component that renders when no posts are available
 */
export const EmptyState = React.forwardRef<HTMLElement, EmptyStateProps>(
  (props, ref) => {
    const { children } = props;
    const service = useService(BlogFeedServiceDefinition);
    const isEmpty = service.isEmpty();

    if (!isEmpty) {
      return null;
    }

    return <div ref={ref as React.Ref<HTMLDivElement>}>{children}</div>;
  },
);

/**
 * Props for BlogFeed LoadMore core component
 */
export interface LoadMoreProps {
  children: (props: LoadMoreRenderProps) => React.ReactNode;
}

export interface LoadMoreRenderProps {
  hasNextPage: boolean;
  isLoading: boolean;
  loadNextPage: () => Promise<void>;
}

/**
 * Core LoadMore component for pagination functionality
 */
export const LoadMore = (props: LoadMoreProps) => {
  const service = useService(BlogFeedServiceDefinition);

  return props.children({
    hasNextPage: service.hasNextPage(),
    isLoading: service.isLoading.get(),
    loadNextPage: service.loadNextPage,
  });
};

export interface SortProps {
  children: (props: {
    currentSort: QueryPostsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryPostsSort[]) => void;
  }) => React.ReactNode;
}

export const Sort = (props: SortProps) => {
  const blogFeedService = useService(BlogFeedServiceDefinition);
  const currentSort = blogFeedService.sort.get();

  const sortOptions: SortPrimitive.SortOption[] = [
    {
      fieldName: 'firstPublishedDate' satisfies QueryPostsSort['fieldName'],
      order: 'DESC',
      label: 'Newest First',
    },
    {
      fieldName: 'firstPublishedDate' satisfies QueryPostsSort['fieldName'],
      order: 'ASC',
      label: 'Oldest First',
    },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: (sort: QueryPostsSort[]) => {
      blogFeedService.setSort(sort);
    },
  });
};
