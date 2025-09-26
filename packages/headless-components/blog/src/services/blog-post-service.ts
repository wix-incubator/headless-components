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

type QueryPostsBuilder = ReturnType<ReturnType<typeof posts.queryPosts>>;

export const BlogPostServiceDefinition = defineService<{
  post: Signal<PostWithResolvedFields>;
  olderPost: Signal<PostWithResolvedFields | undefined>;
  newerPost: Signal<PostWithResolvedFields | undefined>;
}>('blogPostService');

export type BlogPostServiceAPI = ServiceAPI<typeof BlogPostServiceDefinition>;

export const BlogPostService = implementService.withConfig<{
  post: PostWithResolvedFields;
  olderPost: PostWithResolvedFields | undefined;
  newerPost: PostWithResolvedFields | undefined;
}>()(BlogPostServiceDefinition, ({ getService, config }) => {
  const signalsService = getService(SignalsServiceDefinition);

  const postSignal = signalsService.signal<PostWithResolvedFields>(config.post);
  const olderPostSignal = signalsService.signal<
    PostWithResolvedFields | undefined
  >(config.olderPost);
  const newerPostSignal = signalsService.signal<
    PostWithResolvedFields | undefined
  >(config.newerPost);

  return {
    post: postSignal,
    olderPost: olderPostSignal,
    newerPost: newerPostSignal,
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
  /** Fetches sibling posts (next/previous), defaults to true */
  includeSiblingPosts?: boolean;
};

export async function loadBlogPostServiceConfig(
  params: BlogPostServiceConfigParams,
): Promise<BlogPostServiceConfigResult> {
  const { postSlug, includeSiblingPosts = true } = params;

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

    const siblingPosts = includeSiblingPosts
      ? await fetchSiblingPosts(post)
      : { olderPost: undefined, newerPost: undefined };

    const [enhancedPost, olderPost, newerPost] = await enhancePosts([
      post,
      ...(siblingPosts.olderPost ? [siblingPosts.olderPost] : []),
      ...(siblingPosts.newerPost ? [siblingPosts.newerPost] : []),
    ]);

    if (!enhancedPost) {
      return { type: 'notFound' };
    }

    return {
      type: 'success',
      config: {
        post: enhancedPost,
        olderPost,
        newerPost,
      },
    };
  } catch (error) {
    console.error('Failed to load initial post for slug', postSlug, error);
    return { type: 'notFound' };
  }
}

async function fetchSiblingPosts(post: posts.Post): Promise<{
  olderPost: posts.Post | undefined;
  newerPost: posts.Post | undefined;
}> {
  const [olderPost, newerPost] = await Promise.all([
    fetchOlderPost(post),
    fetchNewerPost(post),
  ]);

  return { olderPost, newerPost };
}

// Edge case: using `or()` to fetch older with the same firstPublishedDate using id as tie-breaker
async function fetchOlderPost(
  post: Pick<posts.Post, '_id' | 'firstPublishedDate'>,
): Promise<posts.Post | undefined> {
  try {
    const olderPostQuery: QueryPostsBuilder = posts
      .queryPosts()
      // @ts-expect-error
      .or(posts.queryPosts().lt('firstPublishedDate', post.firstPublishedDate))
      .or(
        posts.queryPosts().eq('firstPublishedDate', post.firstPublishedDate).lt(
          // @ts-expect-error
          '_id',
          post._id,
        ),
      )
      .descending('firstPublishedDate')
      .limit(1);
    const result = await olderPostQuery.find();
    return result.items.at(0);
  } catch (error) {
    console.error('Failed to fetch older post', post, error);
    return undefined;
  }
}

// Edge case: using `or()` to fetch newer with the same firstPublishedDate using id as tie-breaker
async function fetchNewerPost(
  post: Pick<posts.Post, '_id' | 'firstPublishedDate'>,
): Promise<posts.Post | undefined> {
  try {
    const newerPostQuery: QueryPostsBuilder = posts
      .queryPosts()
      // @ts-expect-error
      .or(posts.queryPosts().gt('firstPublishedDate', post.firstPublishedDate))
      .or(
        posts.queryPosts().eq('firstPublishedDate', post.firstPublishedDate).gt(
          // @ts-expect-error
          '_id',
          post._id,
        ),
      )
      .ascending('firstPublishedDate')
      .limit(1);
    const result = await newerPostQuery.find();
    return result.items.at(0);
  } catch (error) {
    console.error('Failed to fetch newer post', post, error);
    return undefined;
  }
}
