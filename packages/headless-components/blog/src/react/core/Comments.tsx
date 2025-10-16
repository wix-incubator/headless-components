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

/**
 * Props for BlogPostComments Root core component
 */
export interface RootProps {
  children: React.ReactNode;
  commentsConfig?: BlogPostCommentsServiceConfig;
}

/**
 * Core BlogPostComments Root component that provides BlogPostComments service context.
 * This is the service-connected component that should be wrapped by the public API.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { children } = props;

  return <div ref={ref}>{children}</div>;
});

Root.displayName = 'Blog.Post.Comments.Root/Core';

/**
 * Props for BlogPostComments Comments core component
 */
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

/**
 * Core Comments component that provides comments data access
 */
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

Comments.displayName = 'Blog.Post.Comments.Comments/Core';

export interface SortProps {
  children: (props: {
    currentSort: QueryCommentsSort[];
    sortOptions: SortPrimitive.SortOption[];
    setSort: (sort: QueryCommentsSort[]) => void;
  }) => React.ReactNode;
}

/**
 * Core Sort component for comment sorting functionality
 */
export const Sort = (props: SortProps) => {
  const service = useService(BlogPostCommentsServiceDefinition);

  // Note: We need to get the current sort from somewhere - this might need to be adjusted
  // based on how we store the current sort in the service
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

Sort.displayName = 'Blog.Post.Comments.Sort/Core';

/**
 * Props for BlogPostComments CreateComment core component
 */
export interface CreateCommentProps {
  children: (props: CreateCommentRenderProps) => React.ReactNode;
}

export interface CreateCommentRenderProps {
  createComment: (content: comments.CommentContent) => Promise<CommentWithResolvedFields | null>;
  isLoading: boolean;
  error: string | null;
}

/**
 * Core CreateComment component for comment creation functionality
 */
export const CreateComment = (props: CreateCommentProps) => {
  const service = useService(BlogPostCommentsServiceDefinition);

  return props.children({
    createComment: service.createComment,
    isLoading: service.isLoading() === 'saving',
    error: service.getError(),
  });
};

CreateComment.displayName = 'Blog.Post.Comments.CreateComment/Core';

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

Comment.displayName = 'Blog.Post.Comment/Core';

/**
 * Props for BlogPostComments CreateReply core component
 */
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

/**
 * Core CreateReply component for reply creation functionality
 */
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

CreateReply.displayName = 'Blog.Post.Comment.CreateReply/Core';
