import { createServicesManager, createServicesMap } from '@wix/services-manager';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  CommentsService,
  CommentsServiceDefinition,
  type CommentWithResolvedFields,
} from './comments-service.js';

vi.mock('@wix/comments', () => ({
  comments: {
    createComment: vi.fn(),
    listCommentsByResource: vi.fn(),
    deleteComment: vi.fn(),
  },
}));

vi.mock('@wix/members', () => ({
  members: {
    getMember: vi.fn(),
  },
}));

import { comments as commentsModule, type comments } from '@wix/comments';
import { members as membersModule } from '@wix/members';

const mockMember = {
  _id: 'member-1',
  profile: {
    nickname: 'Test User',
    slug: 'test-user',
  },
};

const aComment = ({
  id,
  message,
  replyCount,
  parentId,
}: {
  id: string;
  message: string;
  replyCount?: number;
  parentId?: string;
}): comments.Comment => ({
  _id: id,
  content: { message } as unknown as comments.Comment['content'],
  author: { memberId: mockMember._id },
  replyCount: replyCount ?? 0,
  parentComment: parentId
    ? {
        _id: parentId,
        author: { memberId: mockMember._id },
      }
    : undefined,
});

const aEnhancedComment = (comment: comments.Comment): CommentWithResolvedFields => ({
  ...comment,
  resolvedFields: expect.any(Object),
});

const mockCreateComment = (comment: comments.Comment) => {
  vi.mocked(commentsModule.createComment).mockResolvedValueOnce(comment as any);
};

describe('CommentsService', () => {
  const mockConfig = {
    contextId: 'context-123',
    resourceId: 'resource-123',
    pageSize: 5,
    sort: [{ fieldName: 'NEWEST_FIRST' as const }],
  };

  const createServiceInstance = () => {
    const servicesManager = createServicesManager(
      createServicesMap().addService(CommentsServiceDefinition, CommentsService, mockConfig),
    );

    return servicesManager.getService(CommentsServiceDefinition);
  };

  beforeEach(() => {
    vi.clearAllMocks();

    // Setup default mock implementations
    vi.mocked(membersModule.getMember).mockResolvedValue(mockMember as any);
    vi.mocked(commentsModule.listCommentsByResource).mockRejectedValue(
      new Error('listCommentsByResource is not implemented'),
    );
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  describe('initialLoad', () => {
    it('should store comments and cursors', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment' });
      const commentB = aComment({ id: 'B', message: 'Reply to A', parentId: commentA._id! });
      const commentC = aComment({ id: 'C', message: 'Reply to B', parentId: commentB._id! });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
          commentReplies: {
            [commentA._id!]: {
              replies: [commentB, commentC],
              pagingMetadata: { cursors: { next: 'next-replies-cursor' } },
            },
          },
          pagingMetadata: { cursors: { next: 'next-cursor' } },
        },
      });

      expect(service.getComments()).toHaveLength(1);
      expect(service.hasNextPage()).toBe(true);
      expect(service.getComments(commentA._id!)).toHaveLength(2);
      expect(service.hasNextPage(commentA._id!)).toBe(true);
    });
  });

  describe('createComment', () => {
    it('should create a comment and update root comment reply count', async () => {
      const { service } = await setup({ listCommentsByResourceResponse: { comments: [] } });
      const comment = aComment({ id: 'A', message: '1st comment' });
      mockCreateComment(comment);
      const resultPromise = service.createComment(comment.content!);

      expect(service.isLoading()).toEqual('saving');

      await resultPromise;

      expect(service.isLoading()).toEqual(false);
      expect(service.getComments()).toHaveLength(1);
    });
  });

  describe('createReply', () => {
    it('should create a reply and update parent comment reply count', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment' });
      const commentB = aComment({ id: 'B', message: 'Reply to A', parentId: commentA._id! });
      const { service } = await setup({
        listCommentsByResourceResponse: { comments: [commentA] },
      });

      mockCreateComment(commentB);
      const replyPromise = service.createReply(commentA._id!, commentA._id!, commentB.content!);

      expect(service.isLoading(commentA._id!)).toEqual('saving');
      expect(service.getComment(commentA._id!)?.replyCount).toBe(0);
      expect(service.getComments(commentA._id!)).toHaveLength(0);

      await replyPromise;

      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.getComment(commentA._id!)?.replyCount).toBe(1);
      expect(service.getComments(commentA._id!)).toEqual([aEnhancedComment(commentB)]);
    });

    it('should handle replies to replies', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment', replyCount: 1 });
      const commentB = aComment({ id: 'B', message: 'Reply comment', parentId: 'A' });
      const commentC = aComment({ id: 'C', message: 'Nested reply', parentId: 'B' });
      const commentD = aComment({ id: 'D', message: 'New reply', parentId: 'C' });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
          commentReplies: {
            [commentA._id!]: {
              replies: [commentB],
            },
          },
        },
      });

      mockCreateComment(commentC);

      // Execute
      const resultPromise = service.createReply(commentA._id!, commentB._id!, commentC.content!);

      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.isLoading(commentB._id!)).toEqual('saving');

      await resultPromise;

      // Assert
      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.isLoading(commentB._id!)).toEqual(false);
      expect(service.getComment(commentA._id!)?.replyCount).toBe(2);
      expect(service.getComments(commentA._id!)).toEqual([
        aEnhancedComment(commentB),
        aEnhancedComment(commentC),
      ]);

      // Reply to a new reply (to self)
      mockCreateComment(commentD);
      const resultPromise2 = service.createReply(commentA._id!, commentC._id!, commentD.content!);

      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.isLoading(commentB._id!)).toEqual(false);
      expect(service.isLoading(commentC._id!)).toEqual('saving');

      await resultPromise2;

      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.isLoading(commentB._id!)).toEqual(false);
      expect(service.isLoading(commentC._id!)).toEqual(false);
      expect(service.getComment(commentA._id!)?.replyCount).toBe(3);
      expect(service.getComments(commentA._id!)).toEqual([
        aEnhancedComment(commentB),
        aEnhancedComment(commentC),
        aEnhancedComment(commentD),
      ]);
    });

    it('should return null when reply creation fails', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment', replyCount: 1 });
      const commentB = aComment({ id: 'B', message: 'Reply comment', parentId: 'A' });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
        },
      });

      // Mock reply creation failure
      vi.mocked(commentsModule.createComment).mockRejectedValueOnce(
        new Error('Failed to create comment'),
      );

      // Execute
      const result = await service.createReply(commentA._id!, commentA._id!, commentB.content!);

      // Assert
      expect(result).toBeNull();
      expect(service.getError(commentA._id!)).toBe('Failed to create reply');
    });
  });

  describe('deleteComment', () => {
    it('should delete a root comment without replies', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment' });
      const commentB = aComment({ id: 'B', message: '2nd comment' });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA, commentB],
        },
      });

      // Mock successful deletion
      vi.mocked(commentsModule.deleteComment).mockResolvedValueOnce(undefined as any);

      // Execute
      const deletePromise = service.deleteComment(commentA._id!);

      // Assert - during deletion
      expect(service.isLoading(commentA._id!)).toEqual('saving');

      await deletePromise;

      // Assert - after deletion
      expect(service.isLoading()).toEqual(false);
      expect(service.getComments()).toHaveLength(1);
      expect(service.getComments()).toEqual([aEnhancedComment(commentB)]);
    });

    it('should delete a root comment with replies by marking it as DELETED', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment', replyCount: 1 });
      const commentB = aComment({ id: 'B', message: 'Reply to A', parentId: commentA._id! });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
          commentReplies: {
            [commentA._id!]: {
              replies: [commentB],
            },
          },
        },
      });

      // Mock successful deletion
      vi.mocked(commentsModule.deleteComment).mockResolvedValueOnce(undefined as any);

      // Execute
      const deletePromise = service.deleteComment(commentA._id!);

      // Assert - during deletion
      expect(service.isLoading(commentA._id!)).toEqual('saving');

      await deletePromise;

      // Assert - after deletion
      expect(service.isLoading()).toEqual(false);
      expect(service.getComments()).toHaveLength(1);

      const deletedComment = service.getComment(commentA._id!);
      expect(deletedComment?.status).toBe('DELETED');
      expect(deletedComment?.content).toBeUndefined();
      expect(deletedComment?.author).toBeUndefined();
      expect(deletedComment?.resolvedFields.author).toBeUndefined();
      expect(deletedComment?.resolvedFields.parentAuthor).toBeUndefined();

      // Reply should still exist
      expect(service.getComments(commentA._id!)).toHaveLength(1);
      expect(service.getComments(commentA._id!)).toEqual([aEnhancedComment(commentB)]);
    });

    it('should delete a reply without nested replies by removing it', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment', replyCount: 2 });
      const commentB = aComment({ id: 'B', message: 'Reply 1 to A', parentId: commentA._id! });
      const commentC = aComment({ id: 'C', message: 'Reply 2 to A', parentId: commentA._id! });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
          commentReplies: {
            [commentA._id!]: {
              replies: [commentB, commentC],
            },
          },
        },
      });

      // Mock successful deletion
      vi.mocked(commentsModule.deleteComment).mockResolvedValueOnce(undefined as any);

      // Execute
      const deletePromise = service.deleteComment(commentB._id!);

      // Assert - during deletion
      expect(service.isLoading(commentB._id!)).toEqual('saving');

      await deletePromise;

      // Assert - after deletion
      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.getComments(commentA._id!)).toHaveLength(1);
      expect(service.getComments(commentA._id!)).toEqual([aEnhancedComment(commentC)]);
    });

    it('should delete a reply with nested replies by marking it as DELETED', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment', replyCount: 2 });
      const commentB = aComment({ id: 'B', message: 'Reply to A', parentId: commentA._id! });
      const commentC = aComment({ id: 'C', message: 'Nested reply to B', parentId: commentB._id! });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
          commentReplies: {
            [commentA._id!]: {
              replies: [commentB, commentC],
            },
          },
        },
      });

      // Mock successful deletion
      vi.mocked(commentsModule.deleteComment).mockResolvedValueOnce(undefined as any);

      // Execute
      const deletePromise = service.deleteComment(commentB._id!);

      // Assert - during deletion
      expect(service.isLoading(commentB._id!)).toEqual('saving');

      await deletePromise;

      // Assert - after deletion
      expect(service.isLoading(commentA._id!)).toEqual(false);
      expect(service.getComments(commentA._id!)).toHaveLength(2);

      const deletedComment = service.getComment(commentB._id!);
      expect(deletedComment?.status).toBe('DELETED');
      expect(deletedComment?.content).toBeUndefined();
      expect(deletedComment?.author).toBeUndefined();
      expect(deletedComment?.resolvedFields.author).toBeUndefined();
      expect(deletedComment?.resolvedFields.parentAuthor).toBeUndefined();

      // Nested reply should still exist
      const nestedReply = service.getComment(commentC._id!);
      expect(nestedReply).toEqual(aEnhancedComment(commentC));
    });

    it('should handle deletion of non-existent comment', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment' });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
        },
      });

      // Mock successful deletion
      vi.mocked(commentsModule.deleteComment).mockResolvedValueOnce(undefined as any);

      // Execute
      await service.deleteComment('non-existent-id');

      // Assert
      expect(service.getComments()).toHaveLength(1);
      expect(service.getComments()).toEqual([aEnhancedComment(commentA)]);
    });

    it('should handle API failure during deletion', async () => {
      const commentA = aComment({ id: 'A', message: '1st comment' });
      const { service } = await setup({
        listCommentsByResourceResponse: {
          comments: [commentA],
        },
      });

      // Mock deletion failure
      vi.mocked(commentsModule.deleteComment).mockRejectedValueOnce(new Error('Failed to delete'));

      // Execute
      await service.deleteComment(commentA._id!);

      // Assert
      expect(service.getError(commentA._id!)).toBe('Failed to delete comment');
      expect(service.getComments()).toHaveLength(1);
      expect(service.getComments()).toEqual([aEnhancedComment(commentA)]);
    });
  });

  async function setup({
    listCommentsByResourceResponse,
  }: {
    listCommentsByResourceResponse: comments.ListCommentsByResourceResponse;
  }) {
    // Setup
    const service = createServiceInstance();
    // Mock initial load
    vi.mocked(commentsModule.listCommentsByResource).mockResolvedValueOnce(
      listCommentsByResourceResponse as any,
    );

    await service.initialLoad();

    return { service };
  }
});
