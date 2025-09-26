import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { enhancePosts } from './blog-feed-service.js';

// Mock the external dependencies
vi.mock('@wix/blog', () => ({
  posts: {},
  categories: { getCategory: vi.fn() },
  tags: { getTag: vi.fn() },
}));

vi.mock('@wix/members', () => ({ members: { getMember: vi.fn() } }));

vi.mock('@wix/sdk', () => ({ media: { getImageUrl: vi.fn() } }));

// Import the mocked modules and types
import { categories, posts, tags } from '@wix/blog';
import { members } from '@wix/members';
import { media } from '@wix/sdk';

describe('enhancePosts', () => {
  const mockMember: members.Member = {
    _id: 'member-1',
    contactId: 'contact-1',
    loginEmail: 'test@example.com',
    status: 'APPROVED' as members.StatusWithLiterals,
    privacyStatus: 'PUBLIC' as members.PrivacyStatusStatusWithLiterals,
    activityStatus: 'ACTIVE' as members.ActivityStatusStatusWithLiterals,
    _createdDate: new Date(),
    _updatedDate: new Date(),
  };

  const mockCategory: categories.Category = {
    _id: 'category-1',
    label: 'Test Category',
    slug: 'test-category',
    description: 'A test category',
    _updatedDate: new Date(),
  };

  const mockTag: tags.BlogTag = {
    _id: 'tag-1',
    label: 'Test Tag',
    slug: 'test-tag',
    _createdDate: new Date(),
    _updatedDate: new Date(),
  };

  const mockPost: posts.Post = {
    _id: 'post-1',
    title: 'Test Post',
    slug: 'test-post',
    memberId: 'member-1',
    categoryIds: ['category-1'],
    tagIds: ['tag-1'],
    media: {
      wixMedia: {
        image: 'wix://test-image.jpg',
      },
      altText: 'Test image alt text',
    },
    firstPublishedDate: new Date(),
    lastPublishedDate: new Date(),
    pinned: false,
    featured: false,
  };

  const resolveWith = (response: unknown) => (async (_id: string) => response) as any;

  const mockImageUrl = 'https://example.com/image.jpg';

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(members.getMember).mockImplementation(resolveWith(mockMember));
    vi.mocked(categories.getCategory).mockImplementation(resolveWith({ category: mockCategory }));
    vi.mocked(tags.getTag).mockImplementation(resolveWith(mockTag));
    vi.mocked(media.getImageUrl).mockImplementation(() => ({
      url: mockImageUrl,
      id: 'test',
      height: 600,
      width: 800,
    }));
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('should enhance posts with all resolved fields', async () => {
    const rawPosts = [mockPost];
    const result = await enhancePosts(rawPosts);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({
      ...mockPost,
      resolvedFields: {
        owner: mockMember,
        categories: [mockCategory],
        tags: [mockTag],
        coverImageUrl: mockImageUrl,
        coverImageAlt: mockPost.media?.altText,
      },
    });
  });

  describe('when posts contain undefined values', () => {
    it('should preserve undefined positions in the result array', async () => {
      const rawPosts: (posts.Post | undefined)[] = [mockPost, undefined, mockPost];
      const result = await enhancePosts(rawPosts);

      expect(result).toHaveLength(3);
      expect(result[0]).toBeDefined();
      expect(result[1]).toBeUndefined();
      expect(result[2]).toBeDefined();
    });

    it('should handle empty array', async () => {
      const result = await enhancePosts([]);
      expect(result).toEqual([]);
    });

    it('should handle array with only undefined values', async () => {
      const result = await enhancePosts([undefined, undefined]);

      expect(result).toEqual([undefined, undefined]);
    });
  });

  describe('when posts have missing IDs', () => {
    it('should handle posts with empty categoryIds and tagIds arrays', async () => {
      const postWithEmptyArrays: posts.Post = {
        ...mockPost,
        categoryIds: [],
        tagIds: [],
      };

      const result = await enhancePosts([postWithEmptyArrays]);

      expect(result[0]?.resolvedFields.categories).toEqual([]);
      expect(result[0]?.resolvedFields.tags).toEqual([]);
    });
  });

  describe('when entity resolution fails', () => {
    it('should handle member resolution failure gracefully', async () => {
      vi.mocked(members.getMember).mockRejectedValue(new Error('Member not found'));

      const result = await enhancePosts([mockPost]);

      expect(result[0]?.resolvedFields.owner).toBeNull();
      // Other fields should still be resolved
      expect(result[0]?.resolvedFields.categories).toEqual([mockCategory]);
      expect(result[0]?.resolvedFields.tags).toEqual([mockTag]);
    });

    it('should handle category resolution failure gracefully', async () => {
      vi.mocked(categories.getCategory).mockRejectedValue(new Error('Category not found'));

      const result = await enhancePosts([mockPost]);

      expect(result[0]?.resolvedFields.categories).toEqual([]);
      // Other fields should still be resolved
      expect(result[0]?.resolvedFields.owner).toBeDefined();
      expect(result[0]?.resolvedFields.tags).toEqual([mockTag]);
    });

    it('should handle tag resolution failure gracefully', async () => {
      vi.mocked(tags.getTag).mockRejectedValue(new Error('Tag not found'));

      const result = await enhancePosts([mockPost]);

      expect(result[0]?.resolvedFields.tags).toEqual([]);
      // Other fields should still be resolved
      expect(result[0]?.resolvedFields.owner).toBeDefined();
      expect(result[0]?.resolvedFields.categories).toEqual([mockCategory]);
    });
  });

  describe('when posts have shared entities', () => {
    it('should deduplicate entity resolution requests', async () => {
      const post2: posts.Post = {
        ...mockPost,
        _id: 'post-2',
        memberId: 'member-1', // Same member
        categoryIds: ['category-1'], // Same category
        tagIds: ['tag-1'], // Same tag
      };

      const result = await enhancePosts([mockPost, post2]);

      // Each entity should only be fetched once
      expect(members.getMember).toHaveBeenCalledTimes(1);
      expect(categories.getCategory).toHaveBeenCalledTimes(1);
      expect(tags.getTag).toHaveBeenCalledTimes(1);
    });
  });

  describe('when extracting cover image', () => {
    it('should use wixMedia image URL', async () => {
      const result = await enhancePosts([mockPost]);
      expect(result[0]?.resolvedFields.coverImageUrl).toBe(mockImageUrl);
      expect(vi.mocked(media.getImageUrl)).toHaveBeenCalledWith(mockPost.media?.wixMedia?.image);
    });

    it('should use embedMedia thumbnail URL when wixMedia is not available', async () => {
      const postWithEmbed: posts.Post = {
        ...mockPost,
        media: {
          embedMedia: {
            thumbnail: {
              url: 'https://example.com/embed-thumb.jpg',
            },
          },
        },
      };

      const result = await enhancePosts([postWithEmbed]);
      expect(result[0]?.resolvedFields.coverImageUrl).toBe('https://example.com/embed-thumb.jpg');
      expect(vi.mocked(media.getImageUrl)).not.toHaveBeenCalled();
    });

    it('should use post title as alt text when media altText is not available', async () => {
      const postWithoutAlt: posts.Post = {
        ...mockPost,
        media: {
          wixMedia: {
            image: 'wix://test-image.jpg',
          },
          // No altText
        },
      };

      const result = await enhancePosts([postWithoutAlt]);
      expect(result[0]?.resolvedFields.coverImageAlt).toBe(mockPost.title);
    });

    it('should use embedMedia thumbnail URL when wixMedia is not available', async () => {
      const postWithEmbed: posts.Post = {
        ...mockPost,
        media: {
          embedMedia: {
            thumbnail: { url: 'https://example.com/embed-thumb.jpg' },
          },
        },
      };

      const result = await enhancePosts([postWithEmbed]);

      expect(result[0]?.resolvedFields.coverImageUrl).toBe('https://example.com/embed-thumb.jpg');
      expect(result[0]?.resolvedFields.coverImageAlt).toBe(mockPost.title);
    });

    it('should use post title as alt text when media is not available', async () => {
      const postWithoutMedia: posts.Post = { ...mockPost, media: undefined };

      const result = await enhancePosts([postWithoutMedia]);

      expect(result[0]?.resolvedFields.coverImageUrl).toBeNull();
      expect(result[0]?.resolvedFields.coverImageAlt).toBe(mockPost.title);
    });
  });
});
