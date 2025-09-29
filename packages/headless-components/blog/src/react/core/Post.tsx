import type { ServiceAPI } from '@wix/services-definitions';
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

export interface RichContentProps {
  children: (props: RichContentRenderProps) => React.ReactNode;
}

export interface RichContentRenderProps {
  content: any;
  pricingPlanIds: string[];
}

/**
 * Core RichContent component for accessing post rich content
 */
export const RichContent = (props: RichContentProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();
  const content = post?.richContent;
  const pricingPlanIds = post?.pricingPlanIds ?? [];

  if (!content) {
    return null;
  }

  return props.children({ content, pricingPlanIds });
};

RichContent.displayName = 'Blog.Post.RichContent/Core';
