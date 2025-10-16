import { comments } from '@wix/comments';
import { Sort as SortPrimitive } from '@wix/headless-components/react';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import type {
  BlogPostCommentsServiceAPI,
  BlogPostCommentsServiceConfig,
  CommentWithResolvedFields,
  QueryCommentsSort,
} from '../../services/blog-post-comments-service.js';
import { BlogPostCommentsServiceDefinition } from '../../services/blog-post-comments-service.js';

export interface RootProps {
  children: React.ReactNode;
  commentsConfig?: BlogPostCommentsServiceConfig;
}

/**
 * Core Blog.Post.Comments.Root component that provides Blog.Post.Comments.Root service context.
 * This is the service-connected component that should be wrapped by the public API.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { children } = props;

  return <div ref={ref}>{children}</div>;
});

Root.displayName = 'Blog.Post.Comments.Root (core)';

export interface CommentsProps {
  children: (props: CommentsRenderProps) => React.ReactNode;
}

export interface CommentsRenderProps {
  comments: ReturnType<BlogPostCommentsServiceAPI['getComments']>;
  isEmpty: BlogPostCommentsServiceAPI['isEmpty'];
  hasNextPage: BlogPostCommentsServiceAPI['hasNextPage'];
  isLoading: BlogPostCommentsServiceAPI['isLoading'];
  initialLoad: BlogPostCommentsServiceAPI['initialLoad'];
  loadMore: BlogPostCommentsServiceAPI['loadMore'];
}

export const Comments = (props: CommentsProps) => {
  const service = useService(BlogPostCommentsServiceDefinition);

  return props.children({
    comments: service.getComments(),
    isEmpty: service.isEmpty,
    hasNextPage: service.hasNextPage,
    isLoading: service.isLoading,
    loadMore: service.loadMore,
    initialLoad: service.initialLoad,
  });
};

Comments.displayName = 'Blog.Post.Comments.Comments (core)';

export interface SortProps {
  children: (props: {
    currentSort: QueryCommentsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryCommentsSort[]) => void;
  }) => React.ReactNode;
}

export const Sort = (props: SortProps) => {
  const service = useService(BlogPostCommentsServiceDefinition);

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

Sort.displayName = 'Blog.Post.Comments.Sort (core)';

export interface CreateCommentProps {
  children: (props: CreateCommentRenderProps) => React.ReactNode;
}

export interface CreateCommentRenderProps {
  createComment: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  error: string | null;
}

export const CreateComment = (props: CreateCommentProps) => {
  const service = useService(BlogPostCommentsServiceDefinition);

  return props.children({
    createComment: service.createComment,
    isLoading: service.isLoading() === 'saving',
    error: service.getError(),
  });
};

CreateComment.displayName = 'Blog.Post.Comments.CreateComment (core)';

export interface CommentProps {
  commentId: string;
  children: (props: CommentRenderProps) => React.ReactNode;
}

export interface CommentRenderProps {
  comment: ReturnType<BlogPostCommentsServiceAPI['getComment']>;
  replies: ReturnType<BlogPostCommentsServiceAPI['getComments']>;
  deleteComment: () => ReturnType<BlogPostCommentsServiceAPI['deleteComment']>;
  hasNextPage: ReturnType<BlogPostCommentsServiceAPI['hasNextPage']>;
  isLoading: boolean;
  loadNextPage: () => ReturnType<BlogPostCommentsServiceAPI['loadMoreReplies']>;
  parentComment: CommentWithResolvedFields | undefined;
}

export const Comment = (props: CommentProps) => {
  const { commentId } = props;
  const service = useService(BlogPostCommentsServiceDefinition);
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

Comment.displayName = 'Blog.Post.Comment (core)';

export interface CreateReplyProps {
  topCommentId: string;
  parentCommentId: string;
  children: (props: CreateReplyRenderProps) => React.ReactNode;
}

export interface CreateReplyRenderProps {
  createReply: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  replyError: string | null;
}

export const CreateReply = (props: CreateReplyProps) => {
  const { parentCommentId, topCommentId } = props;
  const service = useService(BlogPostCommentsServiceDefinition);

  const createReply = React.useCallback(
    (content: comments.CommentContent) => {
      return service.createReply(topCommentId, parentCommentId, content);
    },
    [service, parentCommentId, topCommentId],
  );

  return props.children({
    createReply,
    isLoading: service.isLoading(parentCommentId) === 'saving',
    replyError: service.getError(parentCommentId),
  });
};

CreateReply.displayName = 'Blog.Post.Comment.CreateReply (core)';

const TopLevelCommentContext = React.createContext<CommentWithResolvedFields | null>(null);

export function useTopLevelCommentContext(): CommentWithResolvedFields {
  const context = React.useContext(TopLevelCommentContext);

  if (!context) {
    throw new Error(
      'useTopLevelCommentContext must be used within a Blog.Post.Comments.CommentItemRepeater component',
    );
  }

  return context;
}

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

TopLevelCommentRoot.displayName = 'Blog.Post.Comments.TopLevelCommentRoot (core)';
