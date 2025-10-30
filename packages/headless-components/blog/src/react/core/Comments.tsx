import { comments } from '@wix/comments';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import type {
  CommentsServiceAPI,
  CommentWithResolvedFields,
  QueryCommentsSort,
} from '../../services/comments-service.js';
import { CommentsServiceDefinition } from '../../services/comments-service.js';

export interface CommentsProps {
  children: (props: CommentsRenderProps) => React.ReactNode;
}

export interface CommentsRenderProps {
  comments: ReturnType<CommentsServiceAPI['getComments']>;
  isEmpty: CommentsServiceAPI['isEmpty'];
  hasNextPage: CommentsServiceAPI['hasNextPage'];
  isLoading: CommentsServiceAPI['isLoading'];
  initialLoad: CommentsServiceAPI['initialLoad'];
  loadMore: CommentsServiceAPI['loadMore'];
}

export const Comments = (props: CommentsProps) => {
  const service = useService(CommentsServiceDefinition);

  return props.children({
    comments: service.getComments(),
    isEmpty: service.isEmpty,
    hasNextPage: service.hasNextPage,
    isLoading: service.isLoading,
    loadMore: service.loadMore,
    initialLoad: service.initialLoad,
  });
};

Comments.displayName = 'Comments.Comments (core)';

export interface SortProps {
  children: (props: {
    currentSort: QueryCommentsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryCommentsSort[]) => void;
  }) => React.ReactNode;
}

export const Sort = (props: SortProps) => {
  const service = useService(CommentsServiceDefinition);

  const currentSort = service.sort.get();

  const sortOptions: SortPrimitive.SortOption[] = [
    {
      fieldName: 'NEWEST_FIRST' as const,
      label: 'Newest first',
    },
    {
      fieldName: 'OLDEST_FIRST' as const,
      label: 'Oldest first',
    },
  ];

  return props.children({
    currentSort,
    sortOptions,
    setSort: service.setSort,
  });
};

Sort.displayName = 'Comments.Sort (core)';

export interface CreateCommentProps {
  parentCommentId?: string | null;
  topCommentId?: string | null;
  children: (props: CreateCommentRenderProps) => React.ReactNode;
}

export interface CreateCommentRenderProps {
  createComment: (content: string) => Promise<CommentWithResolvedFields | null>;
  clearError: () => void;
  isLoading: boolean;
  error: string | null;
}

export const CreateComment = (props: CreateCommentProps) => {
  const service = useService(CommentsServiceDefinition);
  const { parentCommentId: parrentCommentIdOrNull, topCommentId } = props;
  const parentCommentId = parrentCommentIdOrNull ?? undefined;

  return props.children({
    createComment: (content: string) => {
      const contentAsRichContent: comments.CommentContent = {
        richContent: {
          nodes: [{ type: 'PARAGRAPH', nodes: [{ type: 'TEXT', textData: { text: content } }] }],
        },
      };

      if (parentCommentId && topCommentId) {
        return service.createReply(topCommentId, parentCommentId, contentAsRichContent);
      }

      return service.createComment(contentAsRichContent);
    },
    isLoading: service.isLoading(parentCommentId) === 'saving',
    error: service.getError(parentCommentId),
    clearError: () => service.clearError(parentCommentId),
  });
};

CreateComment.displayName = 'Comments.CreateComment (core)';

export interface CommentProps {
  commentId: string;
  children: (props: CommentRenderProps) => React.ReactNode;
}

export interface CommentRenderProps {
  comment: ReturnType<CommentsServiceAPI['getComment']>;
  replies: ReturnType<CommentsServiceAPI['getComments']>;
  deleteComment: () => ReturnType<CommentsServiceAPI['deleteComment']>;
  hasNextPage: ReturnType<CommentsServiceAPI['hasNextPage']>;
  isLoading: boolean;
  loadNextPage: () => ReturnType<CommentsServiceAPI['loadMoreReplies']>;
  parentComment: CommentWithResolvedFields | undefined;
}

export const Comment = (props: CommentProps) => {
  const { commentId } = props;
  const service = useService(CommentsServiceDefinition);
  const parentComment = service.getComments().find((c) => c._id === commentId);

  const isLoading =
    service.isLoading(commentId) === 'more' || service.isLoading(commentId) === 'initial';

  const loadNextPage = React.useCallback(
    () => service.loadMoreReplies(commentId),
    [service, commentId],
  );

  return props.children({
    comment: service.getComment(commentId),
    replies: service.getComments(commentId),
    hasNextPage: service.hasNextPage(commentId),
    isLoading,
    loadNextPage,
    parentComment,
    deleteComment: () => service.deleteComment(commentId),
  });
};

Comment.displayName = 'Comment (core)';

export const TopLevelCommentContext = React.createContext<CommentWithResolvedFields | null>(null);

type TopLevelCommentRootProps = {
  comment: CommentWithResolvedFields;
  children: React.ReactNode;
};

export const TopLevelCommentRoot = (props: TopLevelCommentRootProps) => {
  const { comment, children } = props;

  return (
    <TopLevelCommentContext.Provider value={comment}>{children}</TopLevelCommentContext.Provider>
  );
};

TopLevelCommentRoot.displayName = 'Comment.TopLevelCommentRoot (core)';
