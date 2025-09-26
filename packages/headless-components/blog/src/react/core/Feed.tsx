import type { Sort as SortPrimitive } from '@wix/headless-components/react';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import type {
  BlogFeedServiceAPI,
  BlogFeedServiceConfig,
  QueryPostsSort,
} from '../../services/blog-feed-service.js';
import { BlogFeedServiceDefinition } from '../../services/blog-feed-service.js';

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
export const Root = React.forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { children } = props;

  return <div ref={ref}>{children}</div>;
});

Root.displayName = 'Blog.Feed.Root (core)';

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

Posts.displayName = 'Blog.Feed.Posts (core)';

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

LoadMore.displayName = 'Blog.Feed.LoadMore (core)';

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

Sort.displayName = 'Blog.Feed.Sort/Core';
