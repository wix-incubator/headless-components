import type { ServiceAPI } from '@wix/services-definitions';
import { useService } from '@wix/services-manager-react';
import {
  BlogPostServiceDefinition,
  type BlogPostServiceAPI,
} from '../../services/online-programs-program-service.js';
import React from 'react';

export interface RootProps {
  children: React.ReactNode;
  postId?: string;
}

/**
 * Core BlogPost Root component that provides BlogPost service context.
 * This is the service-connected component that should be wrapped by the public API.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { children } = props;

  // For now, use the existing service structure
  // In future, this could be enhanced to support specific post loading by ID
  return <div ref={ref as React.Ref<HTMLDivElement>}>{children}</div>;
});

export interface ContentProps {
  children: (props: ContentRenderProps) => React.ReactNode;
}

export interface ContentRenderProps {
  post: ReturnType<BlogPostServiceAPI['post']['get']>;
}

/**
 * Core Content component that provides post data access
 */
export const Content = (props: ContentProps) => {
  const service = useService(BlogPostServiceDefinition);

  return props.children({
    post: service.post.get(),
  });
};

export interface RichContentProps {
  children: (props: RichContentRenderProps) => React.ReactNode;
}

export interface RichContentRenderProps {
  ricosViewerContent: any;
}

/**
 * Core RichContent component for accessing post rich content
 */
export const RichContent = (props: RichContentProps) => {
  const service = useService(BlogPostServiceDefinition) as ServiceAPI<
    typeof BlogPostServiceDefinition
  >;

  const post = service.post.get();

  if (!post?.richContent) {
    return null;
  }

  const richContent = post.richContent;

  return props.children({
    ricosViewerContent: richContent,
  });
};
