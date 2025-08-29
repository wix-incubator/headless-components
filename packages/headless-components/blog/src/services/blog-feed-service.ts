import { categories, posts, tags } from '@wix/blog';
import { members } from '@wix/members';
import { media } from '@wix/sdk';
import {
  defineService,
  implementService,
  type ServiceAPI,
} from '@wix/services-definitions';
import type { Signal } from '@wix/services-definitions/core-services/signals';
import { SignalsServiceDefinition } from '@wix/services-definitions/core-services/signals';

const DEFAULT_PAGE_SIZE = 12;

export interface PostResolvedFields {
  owner: members.Member | null | undefined;
  categories: posts.Category[];
  tags: tags.BlogTag[];
  coverImageUrl: string | null;
  coverImageAlt: string | null;
}

export interface PostWithResolvedFields extends posts.Post {
  resolvedFields: PostResolvedFields;
}

type QueryPostsSortField = Parameters<
  ReturnType<NonNullable<ReturnType<typeof posts.queryPosts>>>['ascending']
>[number];

export interface QueryPostsSort {
  fieldName: QueryPostsSortField;
  order: posts.SortOrderWithLiterals;
}

export const BlogFeedServiceDefinition = defineService<{
  posts: Signal<PostWithResolvedFields[]>;
  category: Signal<categories.Category | null>;
  sort: Signal<QueryPostsSort[]>;
  isLoading: Signal<boolean>;
  error: Signal<string | null>;
  totalPosts: number;
  isEmpty: () => boolean;
  hasNextPage: () => boolean;
  loadNextPage: () => Promise<void>;
  setSort: (sort: QueryPostsSort[]) => void;
}>('blogService');

export type BlogFeedServiceAPI = ServiceAPI<typeof BlogFeedServiceDefinition>;

export type BlogFeedServiceConfig = {
  initialPosts: PostWithResolvedFields[];
  initialCategory?: categories.Category;
  excludePostIds: string[];
  totalPostCount: number;
  pageSize: number;
  nextPageCursor?: string;
  sort: QueryPostsSort[];
};

export const BlogFeedService =
  implementService.withConfig<BlogFeedServiceConfig>()(
    BlogFeedServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const postsSignal = signalsService.signal<PostWithResolvedFields[]>(
        config.initialPosts,
      );
      const categorySignal = signalsService.signal<categories.Category | null>(
        config.initialCategory || null,
      );
      const sortSignal = signalsService.signal<QueryPostsSort[]>(config.sort);
      const isLoadingSignal = signalsService.signal<boolean>(false);
      const errorSignal = signalsService.signal<string | null>(null);

      let nextPageCursor: string | undefined = config.nextPageCursor;

      const totalPosts = config.totalPostCount || 0;

      const isEmpty = (): boolean => {
        return !isLoadingSignal.get() && totalPosts === 0;
      };

      const hasNextPage = (): boolean => {
        return !!nextPageCursor;
      };

      // Actions
      const load = async (
        loadMore: boolean,
      ): Promise<posts.PostsQueryResult | undefined> => {
        try {
          if (loadMore && !nextPageCursor) {
            return;
          }

          isLoadingSignal.set(true);
          errorSignal.set(null);

          const result = await fetchPosts({
            skipTo: loadMore ? nextPageCursor : undefined,
            sort: sortSignal.get(),
            pageSize: config.pageSize || DEFAULT_PAGE_SIZE,
            categoryId: config.initialCategory?._id,
            excludePostIds: config.excludePostIds || [],
            postIds: [],
          });

          if (loadMore) {
            postsSignal.set([...postsSignal.get(), ...result.items]);
          } else {
            postsSignal.set(result.items);
          }

          nextPageCursor = result?.cursors.next || undefined;

          return result;
        } catch (err) {
          console.error('Failed to load posts:', err);
          errorSignal.set('Failed to load posts');
        } finally {
          isLoadingSignal.set(false);
        }
      };

      const loadNextPage = async (): Promise<void> => {
        await load(true);
      };

      const setSort = async (sort: QueryPostsSort[]): Promise<void> => {
        sortSignal.set(sort);
        await load(false);
      };

      return {
        posts: postsSignal,
        category: categorySignal,
        isLoading: isLoadingSignal,
        error: errorSignal,
        totalPosts,
        isEmpty,
        hasNextPage,
        loadNextPage: loadNextPage,
        sort: sortSignal,
        setSort,
      };
    },
  );

export type BlogFeedServiceConfigParams = {
  categorySlug?: string;
  pageSize?: number;
  excludePostIds?: (string | undefined)[];
  postIds?: (string | undefined)[];
  sort?: QueryPostsSort[];
};

export async function loadBlogFeedServiceConfig(
  params: BlogFeedServiceConfigParams = {},
): Promise<BlogFeedServiceConfig> {
  const pageSize = params.pageSize || 10;
  const sort: BlogFeedServiceConfig['sort'] = params.sort || [
    {
      fieldName: 'firstPublishedDate',
      order: 'DESC',
    },
  ];
  const excludePostIds = params.excludePostIds?.filter(nonNullable) || [];
  const postIds = params.postIds?.filter(nonNullable) || [];

  try {
    let initialCategory: categories.Category | undefined;
    if (params.categorySlug) {
      const category = await categories.getCategoryBySlug(params.categorySlug, {
        fieldsets: ['SEO'],
      });
      if (category.category) {
        initialCategory = category.category;
      } else {
        throw new Error(`Category for slug "${params.categorySlug}" not found`);
      }
    }

    const result = await fetchPosts({
      skipTo: undefined,
      sort,
      pageSize,
      categoryId: initialCategory?._id,
      excludePostIds,
      postIds,
    });

    return {
      initialPosts: result.items || [],
      initialCategory,
      totalPostCount: result.length,
      pageSize,
      excludePostIds,
      sort,
      nextPageCursor: result.cursors.next || undefined,
    };
  } catch (error) {
    return {
      initialPosts: [],
      initialCategory: undefined,
      totalPostCount: 0,
      excludePostIds,
      pageSize,
      sort,
      nextPageCursor: undefined,
    };
  }
}

type FetchPostsParams = {
  skipTo?: string;
  sort: QueryPostsSort[];
  pageSize: number;
  categoryId?: string;
  excludePostIds: string[];
  postIds: string[];
};

async function fetchPosts(
  params: FetchPostsParams,
): Promise<
  Omit<posts.PostsQueryResult, 'items'> & { items: PostWithResolvedFields[] }
> {
  const {
    skipTo,
    sort,
    categoryId,
    pageSize = DEFAULT_PAGE_SIZE,
    excludePostIds,
    postIds,
  } = params;

  let query = posts.queryPosts().limit(pageSize);

  if (skipTo) {
    query = query.skipTo(skipTo);
  }

  for (const sortOption of sort) {
    if (sortOption.fieldName) {
      if (sortOption.order === 'ASC') {
        query = query.ascending(sortOption.fieldName);
      } else if (sortOption.order === 'DESC') {
        query = query.descending(sortOption.fieldName);
      }
    }
  }

  if (categoryId) {
    query = query.hasSome('categoryIds', [categoryId]);
  }

  if (postIds.length) {
    query = query.in('_id', postIds);
  }

  for (const excludePostId of excludePostIds || []) {
    query = query.ne('_id', excludePostId);
  }

  const result = await query.find();
  const rawPosts = result.items || [];
  const enhancedPosts = await enhancePosts(rawPosts);

  return {
    ...result,
    items: enhancedPosts,
  };
}

export async function enhancePosts(
  rawPosts: posts.Post[],
): Promise<PostWithResolvedFields[]> {
  const { members, categories, tags } = await fetchPostEntities(rawPosts);

  return rawPosts.map<PostWithResolvedFields>((post) => {
    const coverImage = getCoverImage(post);
    return {
      ...post,
      resolvedFields: {
        owner: post.memberId ? members[post.memberId] : undefined,
        categories:
          post.categoryIds
            ?.map((categoryId) => categories[categoryId])
            .filter(nonNullable) ?? [],
        tags:
          post.tagIds?.map((tagId) => tags[tagId]).filter(nonNullable) ?? [],
        coverImageUrl: coverImage.url,
        coverImageAlt: coverImage.alt,
      },
    };
  });
}

async function fetchPostEntities(posts: posts.Post[]): Promise<{
  members: Record<string, members.Member | null | undefined>;
  categories: Record<string, categories.Category | null | undefined>;
  tags: Record<string, tags.BlogTag | null | undefined>;
}> {
  const memberIdsToResolve = uniqueFlatMapByKey(posts, 'memberId');
  const categoryIdsToResolve = uniqueFlatMapByKey(posts, 'categoryIds');
  const tagIdsToResolve = uniqueFlatMapByKey(posts, 'tagIds');

  const memberPromises = memberIdsToResolve.map((memberId) => {
    return members
      .getMember(memberId)
      .then((response) => [memberId, response] as const)
      .catch((err) => {
        console.error(`Failed to resolve member ${memberId}`, err?.message);
        return [memberId, null] as const;
      });
  });

  const categoryPromises = categoryIdsToResolve.map((categoryId) =>
    categories
      .getCategory(categoryId)
      .then((response) => [categoryId, response.category] as const)
      .catch((err) => {
        console.error(`Failed to resolve category ${categoryId}`, err?.details);
        return [categoryId, null] as const;
      }),
  );

  const tagPromises = tagIdsToResolve.map((tagId) =>
    tags
      .getTag(tagId)
      .then((response) => [tagId, response] as const)
      .catch((err) => {
        console.error(`Failed to resolve tag ${tagId}`, err?.message);
        return [tagId, null] as const;
      }),
  );

  const [resolvedMembers, resolvedCategories, resolvedTags] = await Promise.all(
    [
      Promise.all(memberPromises),
      Promise.all(categoryPromises),
      Promise.all(tagPromises),
    ],
  );

  return {
    members: Object.fromEntries(resolvedMembers),
    categories: Object.fromEntries(resolvedCategories),
    tags: Object.fromEntries(resolvedTags),
  };
}

function getCoverImage(post: posts.Post): {
  url: string | null;
  alt: string | null;
} {
  let coverImageUrl: string | null = null;
  if (post.media?.wixMedia?.image) {
    coverImageUrl = media.getImageUrl(post.media.wixMedia.image).url;
  } else if (post.media?.embedMedia?.thumbnail?.url) {
    coverImageUrl = post.media.embedMedia.thumbnail.url;
  }

  return {
    url: coverImageUrl,
    alt: post.media?.altText || post.title || null,
  };
}

function nonNullable<T>(value: T): value is NonNullable<T> {
  return !!value;
}

function uniqueFlatMapByKey<T extends Record<string, any>, K extends keyof T>(
  collection: T[],
  key: K,
): Array<NonNullable<T[K]> extends Array<infer U> ? U : NonNullable<T[K]>> {
  const values = collection.flatMap((item) => {
    return item[key] || [];
  });

  const uniqueValues = [...new Set(values)];

  return uniqueValues;
}
