import { posts } from '@wix/blog';
import {
  defineService,
  implementService,
  type ServiceAPI,
  type ServiceFactoryConfig,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';
import {
  enhancePosts,
  type PostWithResolvedFields,
} from './blog-feed-service.js';

export const BlogPostServiceDefinition = defineService<{
  post: Signal<PostWithResolvedFields>;
}>('blogPostService');

export type BlogPostServiceAPI = ServiceAPI<typeof BlogPostServiceDefinition>;

export const BlogPostService = implementService.withConfig<{
  post: PostWithResolvedFields;
}>()(BlogPostServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const postSignal = signalsService.signal<PostWithResolvedFields>(config.post);

  return {
    post: postSignal,
  };
});

export type BlogPostServiceConfig = ServiceFactoryConfig<
  typeof BlogPostService
>;

export type BlogPostServiceConfigResult =
  | {
      type: 'success';
      config: BlogPostServiceConfig;
    }
  | { type: 'notFound' };

type BlogPostServiceConfigParams = {
  postSlug: string;
};

export async function loadBlogPostServiceConfig(
  params: BlogPostServiceConfigParams,
): Promise<BlogPostServiceConfigResult> {
  const { postSlug } = params;

  if (!postSlug) {
    return { type: 'notFound' };
  }

  try {
    const { post } = await posts.getPostBySlug(postSlug, {
      fieldsets: ['RICH_CONTENT', 'SEO'],
    });

    if (!post) {
      return { type: 'notFound' };
    }

    const [enhancedPost] = await enhancePosts([post]);

    if (!enhancedPost) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: {
        post: enhancedPost,
      },
    };
  } catch (error) {
    console.error('Failed to load initial post for slug', postSlug, error);
    return { type: 'notFound' };
  }
}
