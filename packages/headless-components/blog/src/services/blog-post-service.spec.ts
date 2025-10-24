import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { loadBlogPostServiceConfig } from './blog-post-service.js';

// Mock the external dependencies
vi.mock('@wix/blog', () => ({
  posts: {
    getPostBySlug: vi.fn(),
    queryPosts: vi.fn(() => ({
      or: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      descending: vi.fn().mockReturnThis(),
      ascending: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      find: vi.fn(),
    })),
  },
}));

vi.mock('./blog-feed-service.js', () => ({
  enhancePosts: vi.fn(),
}));

// Import the mocked modules and types
import { posts } from '@wix/blog';
import { enhancePosts } from './blog-feed-service.js';

const resolveWith = (response: unknown) => (async () => response) as any;
const rejectWith = (response: unknown) => (async () => Promise.reject(response)) as any;

describe('loadBlogPostServiceConfig', () => {
  const mockPost: posts.Post = {
    _id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    firstPublishedDate: new Date('2023-01-15'),
    lastPublishedDate: new Date('2023-01-15'),
    pinned: false,
    featured: false,
  };

  const mockOlderPost: posts.Post = {
    _id: 'post-0',
    title: 'Older Post',
    slug: 'older-post',
    firstPublishedDate: new Date('2023-01-10'),
    lastPublishedDate: new Date('2023-01-10'),
    pinned: false,
    featured: false,
  };

  const mockNewerPost: posts.Post = {
    _id: 'post-2',
    title: 'Newer Post',
    slug: 'newer-post',
    firstPublishedDate: new Date('2023-01-20'),
    lastPublishedDate: new Date('2023-01-20'),
    pinned: false,
    featured: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(posts.getPostBySlug).mockImplementation(resolveWith({ post: mockPost }));
    vi.mocked(enhancePosts).mockImplementation(
      async (posts) =>
        posts.map((post) => (post ? { ...post, resolvedFields: {} } : undefined)) as any,
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should load post with sibling posts by default', async () => {
    // Mock sibling posts query results
    const mockQueryBuilder = {
      or: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      descending: vi.fn().mockReturnThis(),
      ascending: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      find: vi.fn(),
    };

    vi.mocked(posts.queryPosts).mockReturnValue(mockQueryBuilder as any);

    mockQueryBuilder.find
      .mockResolvedValueOnce({ items: [mockOlderPost] })
      .mockResolvedValueOnce({ items: [mockNewerPost] });

    const result = await loadBlogPostServiceConfig({ postSlug: 'test-post' });

    expect(result.type).toBe('success');
    if (result.type === 'success') {
      expect(result.config.post.title).toBe('Test Post');
      expect(result.config.olderPost?.title).toBe('Older Post');
      expect(result.config.newerPost?.title).toBe('Newer Post');
      expect(enhancePosts).toHaveBeenCalledWith([mockPost, mockOlderPost, mockNewerPost]);
    }
  });

  it('should skip sibling posts when includeSiblingPosts is false', async () => {
    const result = await loadBlogPostServiceConfig({
      postSlug: 'test-post',
      includeSiblingPosts: false,
    });

    expect(result.type).toBe('success');
    expect(posts.queryPosts).not.toHaveBeenCalled();
    if (result.type === 'success') {
      expect(enhancePosts).toHaveBeenCalledWith([mockPost, undefined, undefined]);
      expect(result.config.olderPost).toBeUndefined();
      expect(result.config.newerPost).toBeUndefined();
    }
  });

  it('should return notFound when postSlug is empty', async () => {
    const result = await loadBlogPostServiceConfig({ postSlug: '' });
    expect(result.type).toBe('notFound');
  });

  it('should handle errors gracefully', async () => {
    vi.mocked(posts.getPostBySlug).mockRejectedValue(new Error('API Error'));

    const result = await loadBlogPostServiceConfig({ postSlug: 'test-post' });
    expect(result.type).toBe('notFound');
  });

  it('should continue when both sibling queries fail', async () => {
    const mockQueryBuilder = {
      or: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      gt: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      descending: vi.fn().mockReturnThis(),
      ascending: vi.fn().mockReturnThis(),
      limit: vi.fn().mockReturnThis(),
      find: vi
        .fn()
        .mockRejectedValueOnce(new Error('Older query failed'))
        .mockRejectedValueOnce(new Error('Newer query failed')),
    };

    vi.mocked(posts.queryPosts).mockReturnValue(mockQueryBuilder as any);
    vi.mocked(posts.getPostBySlug).mockImplementation(resolveWith({ post: mockPost }));
    vi.mocked(enhancePosts).mockImplementation(
      async (posts) =>
        posts.map((post) => (post ? { ...post, resolvedFields: {} } : undefined)) as any,
    );

    const result = await loadBlogPostServiceConfig({ postSlug: 'test-post' });

    expect(result.type).toBe('success');
    expect(enhancePosts).toHaveBeenCalledWith([mockPost, undefined, undefined]);
  });

  describe('sibling posts', () => {
    const mockPost: posts.Post = {
      _id: 'post-1',
      title: 'Test Post',
      slug: 'test-post',
      firstPublishedDate: new Date('2023-01-15'),
      lastPublishedDate: new Date('2023-01-15'),
      pinned: false,
      featured: false,
    };

    const mockOlderPost: posts.Post = {
      _id: 'post-0',
      title: 'Older Post',
      slug: 'older-post',
      firstPublishedDate: new Date('2023-01-10'),
      lastPublishedDate: new Date('2023-01-10'),
      pinned: false,
      featured: false,
    };

    const mockNewerPost: posts.Post = {
      _id: 'post-2',
      title: 'Newer Post',
      slug: 'newer-post',
      firstPublishedDate: new Date('2023-01-20'),
      lastPublishedDate: new Date('2023-01-20'),
      pinned: false,
      featured: false,
    };

    beforeEach(() => {
      vi.clearAllMocks();
    });

    describe('when fetching siblings for last/first post', () => {
      it('should return only older post for first post', async () => {
        const mockQueryBuilder = {
          or: vi.fn().mockReturnThis(),
          lt: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          descending: vi.fn().mockReturnThis(),
          ascending: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          find: vi
            .fn()
            .mockResolvedValueOnce({ items: [mockOlderPost] }) // older post found
            .mockResolvedValueOnce({ items: [] }), // newer post not found
        };

        vi.mocked(posts.queryPosts).mockReturnValue(mockQueryBuilder as any);
        vi.mocked(posts.getPostBySlug).mockImplementation(resolveWith({ post: mockPost }));
        vi.mocked(enhancePosts).mockImplementation(
          async (posts) =>
            posts.map((post) => (post ? { ...post, resolvedFields: {} } : undefined)) as any,
        );

        const result = await loadBlogPostServiceConfig({ postSlug: 'test-post' });

        expect(enhancePosts).toHaveBeenCalledWith([mockPost, mockOlderPost, undefined]);
      });

      it('should return only newer post for last post', async () => {
        const mockQueryBuilder = {
          or: vi.fn().mockReturnThis(),
          lt: vi.fn().mockReturnThis(),
          gt: vi.fn().mockReturnThis(),
          eq: vi.fn().mockReturnThis(),
          descending: vi.fn().mockReturnThis(),
          ascending: vi.fn().mockReturnThis(),
          limit: vi.fn().mockReturnThis(),
          find: vi
            .fn()
            .mockResolvedValueOnce({ items: [] }) // older post not found
            .mockResolvedValueOnce({ items: [mockNewerPost] }), // newer post found
        };

        vi.mocked(posts.queryPosts).mockReturnValue(mockQueryBuilder as any);
        vi.mocked(posts.getPostBySlug).mockImplementation(resolveWith({ post: mockPost }));
        vi.mocked(enhancePosts).mockImplementation(
          async (posts) =>
            posts.map((post) => (post ? { ...post, resolvedFields: {} } : undefined)) as any,
        );

        const result = await loadBlogPostServiceConfig({ postSlug: 'test-post' });

        expect(enhancePosts).toHaveBeenCalledWith([mockPost, undefined, mockNewerPost]);
      });
    });
  });
});
