import type { comments } from '@wix/comments';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import type { members } from '@wix/members';
import React from 'react';
import type { CommentWithResolvedFields } from '../services/blog-post-comments-service.js';
import { useCommentsContext } from './Comments.js';
import * as CoreComments from './core/Comments.js';

export * as CommentReplyForm from './CommentReplyForm.js';

export interface CommentContentProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ content: any }> | React.ReactNode;
}

interface CommentContextValue {
  comment: CommentWithResolvedFields;
  replies: CommentWithResolvedFields[];
  deleteComment: () => Promise<void>;
}

const CommentContext = React.createContext<CommentContextValue | null>(null);

CommentContext.displayName = 'Blog.Post.Comment.CommentContext';

/**
 * Hook to access the current comment context.
 * Must be used within a Blog.Post.Comment.Root or Blog.Post.Comment.ReplyItemRepeater component.
 *
 * @returns The comment context containing comment data, replies, and delete function
 * @throws Error if used outside of Blog.Post.Comment.Root
 */
export function useCommentContext(): CommentContextValue {
  const context = React.useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within a Blog.Post.Comment.Root component');
  }
  return context;
}

const enum TestIds {
  blogPostComment = 'blog-post-comment',
  blogPostCommentContent = 'blog-post-comment-content',
  blogPostCommentAuthor = 'blog-post-comment-author',
  blogPostCommentDate = 'blog-post-comment-date',
  blogPostCommentStatus = 'blog-post-comment-status',

  // Reply Items
  blogPostCommentReplyItems = 'blog-post-comment-reply-items',
  blogPostCommentReplyItem = 'blog-post-comment-reply-item',
  blogPostCommentLoadMoreReplies = 'blog-post-comment-load-more-replies',
  blogPostCommentCreateReply = 'blog-post-comment-create-reply',
}

type RootProps = {
  comment: CommentWithResolvedFields;
  children:
    | React.ReactNode
    | AsChildChildren<{ comment: CommentWithResolvedFields; replies: CommentWithResolvedFields[] }>;
  asChild?: boolean;
  className?: string;
};

/**
 * Root component for rendering a single comment.
 * Provides comment context to all child components.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.Comment.Root comment={comment}>
 *   <Blog.Post.Comment.Author />
 *   <Blog.Post.Comment.Content />
 *   <Blog.Post.Comment.CommentDate />
 * </Blog.Post.Comment.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { comment, children, className, asChild } = props;

  const attributes = {
    'data-testid': TestIds.blogPostComment,
    'data-comment-id': comment._id,
  };

  return (
    <CoreComments.Comment commentId={comment._id || ''}>
      {({ replies, deleteComment }) => {
        const contextValue: CommentContextValue = {
          comment,
          replies,
          deleteComment,
        };
        return (
          <CommentContext.Provider key={comment._id} value={contextValue}>
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              customElementProps={{ comment, replies }}
              {...attributes}
            >
              {children}
            </AsChildSlot>
          </CommentContext.Provider>
        );
      }}
    </CoreComments.Comment>
  );
});

Root.displayName = 'Blog.Post.Comment.Root';

/**
 * Displays the comment content with rich text support.
 *
 * @component
 * @example
 * ```tsx
 * // Custom rendering with asChild
 * <Blog.Post.Comment.Content asChild>
 *   {({ content }) => (
 *     <div className="comment-content">
 *       <RicosViewer content={content} />
 *     </div>
 *   )}
 * </Blog.Post.Comment.Content>
 * ```
 */
export const Content = React.forwardRef<HTMLElement, CommentContentProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  if (!comment?.content) return null;

  const attributes = {
    'data-testid': TestIds.blogPostCommentContent,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ content: comment.content.richContent }}
    ></AsChildSlot>
  );
});

Content.displayName = 'Blog.Post.Comment.Content';

export interface AuthorProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{
        author: members.Member | null | undefined;
      }>
    | React.ReactNode;
}

/**
 * Displays the comment author's name.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.Author />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.Author asChild>
 *   {({ author }) => author?.profile?.nickname ?? 'Unknown'} />}
 * </Blog.Post.Comment.Author>
 * ```
 */
export const Author = React.forwardRef<HTMLElement, AuthorProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  const author = comment?.resolvedFields?.author;

  const attributes = {
    'data-testid': TestIds.blogPostCommentAuthor,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ author }}
    >
      <span>{author?.profile?.nickname ?? 'Unknown'}</span>
    </AsChildSlot>
  );
});

Author.displayName = 'Blog.Post.Comment.Author';

export interface CommentDateProps {
  asChild?: boolean;
  className?: string;
  locale?: Intl.LocalesArgument;
  children?: AsChildChildren<{ commentDate: string }> | React.ReactNode;
}

/**
 * Displays the comment date in a formatted way.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.CommentDate />
 *
 * // With custom locale
 * <Blog.Post.Comment.CommentDate locale="en-US" />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.CommentDate asChild>
 *   {({ commentDate }) => <RelativeDate date={commentDate} />}
 * </Blog.Post.Comment.CommentDate>
 * ```
 */
export const CommentDate = React.forwardRef<HTMLElement, CommentDateProps>((props, ref) => {
  const { asChild, children, className, locale } = props;
  const { comment } = useCommentContext();

  const commentDate = comment?.commentDate || comment?._createdDate;
  if (!commentDate) return null;

  const formattedDate = new Date(commentDate).toLocaleDateString(locale || 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const dateTimeString = typeof commentDate === 'string' ? commentDate : commentDate.toISOString();

  const attributes = {
    'data-testid': TestIds.blogPostCommentDate,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ commentDate: dateTimeString }}
      content={formattedDate}
    >
      <time dateTime={dateTimeString}>{formattedDate}</time>
    </AsChildSlot>
  );
});

CommentDate.displayName = 'Blog.Post.Comment.CommentDate';

export interface StatusProps {
  asChild?: boolean;
  className?: string;
  children?:
    | AsChildChildren<{ status: comments.Comment['status']; isPending: boolean }>
    | React.ReactNode;
}

/**
 * Displays or provides access to the comment status (PUBLISHED, PENDING, DELETED, etc.).
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.Status />
 *
 * // Conditional rendering with asChild
 * <Blog.Post.Comment.Status asChild>
 *   {({ status, isPending }) => (
 *     status === 'PENDING' ? <span>Awaiting approval</span> : null
 *   )}
 * </Blog.Post.Comment.Status>
 * ```
 */
export const Status = React.forwardRef<HTMLElement, StatusProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  if (!comment?.status) return null;

  const status = comment.status;
  const isPending = status === 'PENDING';

  const attributes = {
    'data-testid': TestIds.blogPostCommentStatus,
    'data-status': status,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ status, isPending }}
    >
      <span>{status}</span>
    </AsChildSlot>
  );
});

Status.displayName = 'Blog.Post.Comment.Status';

export interface ReplyItemsProps {
  className?: string;
  children: React.ReactNode;
}

/**
 * Container for comment replies with empty state support.
 * Follows List Container Level pattern from architecture rules.
 * Always renders if there are total replies, even if no replies are loaded initially.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.Comment.ReplyItems>
 *   <Blog.Post.Comment.ReplyItemRepeater>
 *     <Blog.Post.Comment.Author />
 *     <Blog.Post.Comment.Content />
 *   </Blog.Post.Comment.ReplyItemRepeater>
 *   <Blog.Post.Comment.LoadMoreReplies />
 * </Blog.Post.Comment.ReplyItems>
 * ```
 */
export const ReplyItems = React.forwardRef<HTMLElement, ReplyItemsProps>((props, ref) => {
  const { children, className } = props;
  const { comment } = useCommentContext();

  return (
    <CoreComments.Comment commentId={comment._id || ''}>
      {({ parentComment }) => {
        if ((parentComment?.replyCount ?? 0) === 0) return null;

        const attributes = {
          'data-testid': TestIds.blogPostCommentReplyItems,
        };

        return (
          <div {...attributes} ref={ref as React.Ref<HTMLDivElement>} className={className}>
            {children}
          </div>
        );
      }}
    </CoreComments.Comment>
  );
});

ReplyItems.displayName = 'Blog.Post.Comment.ReplyItems';

export interface ReplyItemRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders all replies to a comment.
 * Follows Repeater Level pattern from architecture rules.
 * Note: Repeater components do NOT support asChild as per architecture rules.
 *
 * @component
 * @example
 * ```tsx
 * <Blog.Post.Comment.ReplyItems>
 *   <Blog.Post.Comment.ReplyItemRepeater>
 *     <Blog.Post.Comment.Author />
 *     <Blog.Post.Comment.Content />
 *   </Blog.Post.Comment.ReplyItemRepeater>
 * </Blog.Post.Comment.ReplyItems>
 * ```
 */
export const ReplyItemRepeater = React.forwardRef<HTMLElement, ReplyItemRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { comment } = useCommentContext();

    return (
      <CoreComments.Comment commentId={comment._id || ''}>
        {({ replies }) =>
          replies.map((reply) => {
            return (
              <Root key={reply._id} comment={reply}>
                {children}
              </Root>
            );
          })
        }
      </CoreComments.Comment>
    );
  },
);

ReplyItemRepeater.displayName = 'Blog.Post.Comment.ReplyItemRepeater';

export interface ParentCommentProps extends Omit<RootProps, 'comment'> {}

/**
 * Displays the parent comment when the current comment is a reply to another reply.
 * Only renders if the parent is not a top-level comment.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.ParentComment>
 *   <Blog.Post.Comment.Author />
 *   <Blog.Post.Comment.Content />
 * </Blog.Post.Comment.ParentComment>
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.ParentComment asChild>
 *   {({ comment: parentComment }) => (
 *     <div>
 *       Replying to: <CommentPreview comment={parentComment} />
 *     </div>
 *   )}
 * </Blog.Post.Comment.ParentComment>
 * ```
 */
export const ParentComment = React.forwardRef<HTMLDivElement, ParentCommentProps>((props, ref) => {
  const { children, asChild, className } = props;
  const { comments } = useCommentsContext();
  const { comment } = useCommentContext();

  if (!comment.parentComment?._id) return null;

  const parentCommentInRoot = comments.find((c) => c._id === comment.parentComment?._id);

  // Only relevant if parent comment a reply, not a top-level comment
  if (parentCommentInRoot) return null;

  return (
    <CoreComments.Comment commentId={comment.parentComment?._id || ''}>
      {({ comment }) => {
        if (!comment) return null;

        return (
          <Root
            key={comment._id}
            comment={comment}
            ref={ref}
            asChild={asChild}
            className={className}
          >
            {children}
          </Root>
        );
      }}
    </CoreComments.Comment>
  );
});

ParentComment.displayName = 'Blog.Post.Comment.ParentComment';

export interface LoadMoreRepliesProps {
  asChild?: boolean;
  className?: string;
  loadingState?: React.ReactNode;
  children?:
    | AsChildChildren<{
        isLoading: boolean;
        hasNextPage: boolean;
        loadNextPage: () => Promise<void>;
      }>
    | React.ReactNode;
}

/**
 * Button to load more replies when there are additional pages.
 * Only renders when there are more replies to load.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Blog.Post.Comment.LoadMoreReplies />
 *
 * // Custom rendering with asChild
 * <Blog.Post.Comment.LoadMoreReplies asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button onClick={loadNextPage} disabled={isLoading}>
 *       {isLoading ? 'Loading...' : 'Show more replies'}
 *     </button>
 *   )}
 * </Blog.Post.Comment.LoadMoreReplies>
 * ```
 */
export const LoadMoreReplies = React.forwardRef<HTMLElement, LoadMoreRepliesProps>((props, ref) => {
  const { asChild, children, className, loadingState } = props;
  const { comment } = useCommentContext();
  const commentId = comment._id;

  if (!commentId) return null;

  return (
    <CoreComments.Comment commentId={commentId}>
      {({ hasNextPage, loadNextPage, isLoading, parentComment, replies }) => {
        if ((parentComment?.replyCount ?? 0) === 0) return null;

        const attributes = {
          'data-testid': TestIds.blogPostCommentLoadMoreReplies,
          'data-loading': isLoading,
        };

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            {...attributes}
            customElement={children}
            customElementProps={{
              hasNextPage,
              isLoading,
              loadNextPage,
              replies,
            }}
            content={isLoading && loadingState ? loadingState : undefined}
          >
            <button onClick={loadNextPage} disabled={isLoading}>
              Load replies
            </button>
          </AsChildSlot>
        );
      }}
    </CoreComments.Comment>
  );
});

LoadMoreReplies.displayName = 'Blog.Post.Comment.LoadMoreReplies';
