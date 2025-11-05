import { useService } from '@wix/services-manager-react';
import React from 'react';
import {
  BlogPostServiceDefinition,
  type BlogPostServiceAPI,
} from '../../services/blog-post-service.js';

export interface RootProps {
  children: (props: RootRenderProps) => React.ReactNode;
}

export interface RootRenderProps {
  post: ReturnType<BlogPostServiceAPI['post']['get']>;
  olderPost: ReturnType<BlogPostServiceAPI['olderPost']['get']>;
  newerPost: ReturnType<BlogPostServiceAPI['newerPost']['get']>;
}

/**
 * Core Content component that provides post data access
 */
export const Root = (props: RootProps) => {
  const service = useService(BlogPostServiceDefinition);

  return props.children({
    post: service.post.get(),
    olderPost: service.olderPost.get(),
    newerPost: service.newerPost.get(),
  });
};

Root.displayName = 'Blog.Post.Root/Core';
