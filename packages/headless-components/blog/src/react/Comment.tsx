import type { comments } from '@wix/comments';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import type { members } from '@wix/members';
import { useService } from '@wix/services-manager-react';
import React from 'react';
import {
  CommentsServiceDefinition,
  type CommentWithResolvedFields,
} from '../services/comments-service.js';
import * as CoreComments from './core/Comments.js';
import { isValidChildren } from './helpers/children.js';

export * as Form from './CommentForm.js';

export interface CommentContentProps {
  asChild?: boolean;
  className?: string;
  children?: AsChildChildren<{ content: any }> | React.ReactNode;
}

interface CommentContextValue {
  comment: CommentWithResolvedFields;
  replies: CommentWithResolvedFields[];
  deleteComment: () => Promise<void>;
  currentMemberId: string | undefined;
}

export const CommentContext = React.createContext<CommentContextValue | null>(null);

CommentContext.displayName = 'Comment.CommentContext';

/**
 * Hook to access the current comment context.
 * Must be used within a Comment.Root or Comment.ReplyItemRepeater component.
 *
 * @returns The comment context containing comment data, replies, and delete function
 * @throws Error if used outside of Comment.Root
 */
export function useCommentContext(): CommentContextValue {
  const context = React.useContext(CommentContext);
  if (!context) {
    throw new Error('useCommentContext must be used within a Comment.Root component');
  }
  return context;
}

const enum TestIds {
  root = 'comment',
  content = 'comment-content',
  author = 'comment-author',
  commentDate = 'comment-date',
  status = 'comment-status',
  replyItems = 'comment-reply-items',
  loadMoreReplies = 'comment-load-more-replies',
  actionDelete = 'comment-action-delete',
}

type RootProps = {
  comment: CommentWithResolvedFields;
  children:
    | React.ReactNode
    | AsChildChildren<{ comment: CommentWithResolvedFields; replies: CommentWithResolvedFields[] }>;
  asChild?: boolean;
  className?: string;
  currentMemberId: string | undefined;
};

/**
 * Root component for rendering a single comment.
 * Provides comment context to all child components.
 *
 * @component
 * @example
 * ```tsx
 * <Comment.Root comment={comment}>
 *   <Comment.Author />
 *   <Comment.Content />
 *   <Comment.CommentDate />
 * </Comment.Root>
 * ```
 */
export const Root = React.forwardRef<HTMLDivElement, RootProps>((props, ref) => {
  const { comment, children, className, asChild, currentMemberId } = props;

  const attributes = {
    'data-testid': TestIds.root,
    'data-comment-id': comment._id,
  };

  return (
    <CoreComments.Comment commentId={comment._id || ''}>
      {({ replies, deleteComment }) => {
        const contextValue: CommentContextValue = {
          comment,
          replies,
          deleteComment,
          currentMemberId,
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

Root.displayName = 'Comment.Root';

/**
 * Displays the comment content with rich text support.
 *
 * @component
 * @example
 * ```tsx
 * // Custom rendering with asChild
 * <Comment.Content asChild>
 *   {({ content }) => (
 *     <div className="comment-content">
 *       <RicosViewer content={content} />
 *     </div>
 *   )}
 * </Comment.Content>
 * ```
 */
export const Content = React.forwardRef<HTMLElement, CommentContentProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  if (!comment?.content) return null;

  const attributes = {
    'data-testid': TestIds.content,
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

Content.displayName = 'Comment.Content';

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
 * <Comment.Author />
 *
 * // Custom rendering with asChild
 * <Comment.Author asChild>
 *   {({ author }) => author?.profile?.nickname ?? 'Unknown'} />}
 * </Comment.Author>
 * ```
 */
export const Author = React.forwardRef<HTMLElement, AuthorProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  const author = comment?.resolvedFields?.author;

  const attributes = {
    'data-testid': TestIds.author,
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

Author.displayName = 'Comment.Author';

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
 * <Comment.CommentDate />
 *
 * // With custom locale
 * <Comment.CommentDate locale="en-US" />
 *
 * // Custom rendering with asChild
 * <Comment.CommentDate asChild>
 *   {({ commentDate }) => <RelativeDate date={commentDate} />}
 * </Comment.CommentDate>
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
    'data-testid': TestIds.commentDate,
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

CommentDate.displayName = 'Comment.CommentDate';

export interface OwnerProps {
  children?: React.ReactNode;
}

/**
 * Renders if the current member is the owner of the comment.
 *
 * @component
 * @example
 * ```tsx
 * <Comment.Owner>
 *   <Comment.Action.Delete />
 * </Comment.Owner>
 * ```
 */
export const Owner = (props: OwnerProps) => {
  const { children } = props;
  const { currentMemberId, comment } = useCommentContext();

  if (
    !currentMemberId ||
    !comment.author?.memberId ||
    comment.author.memberId !== currentMemberId
  ) {
    return null;
  }

  return children;
};

Owner.displayName = 'Comment.Owner';

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
 * <Comment.Status />
 *
 * // Conditional rendering with asChild
 * <Comment.Status asChild>
 *   {({ status }) => (
 *     status === 'PENDING' ? <span>Awaiting approval</span> : null
 *   )}
 * </Comment.Status>
 * ```
 */
export const Status = React.forwardRef<HTMLElement, StatusProps>((props, ref) => {
  const { asChild, children, className } = props;
  const { comment } = useCommentContext();

  if (!comment?.status) return null;

  const status = comment.status;

  const attributes = {
    'data-testid': TestIds.status,
    'data-status': status,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      customElement={children}
      customElementProps={{ status }}
    >
      <span>{status}</span>
    </AsChildSlot>
  );
});

Status.displayName = 'Comment.Status';

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
 * <Comment.ReplyItems>
 *   <Comment.ReplyItemRepeater>
 *     <Comment.Author />
 *     <Comment.Content />
 *   </Comment.ReplyItemRepeater>
 *   <Comment.LoadMoreReplies />
 * </Comment.ReplyItems>
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
          'data-testid': TestIds.replyItems,
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

ReplyItems.displayName = 'Comment.ReplyItems';

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
 * <Comment.ReplyItems>
 *   <Comment.ReplyItemRepeater>
 *     <Comment.Author />
 *     <Comment.Content />
 *   </Comment.ReplyItemRepeater>
 * </Comment.ReplyItems>
 * ```
 */
export const ReplyItemRepeater = React.forwardRef<HTMLElement, ReplyItemRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { comment, currentMemberId } = useCommentContext();

    return (
      <CoreComments.Comment commentId={comment._id || ''}>
        {({ replies }) =>
          replies.map((reply) => {
            return (
              <Root key={reply._id} comment={reply} currentMemberId={currentMemberId}>
                {children}
              </Root>
            );
          })
        }
      </CoreComments.Comment>
    );
  },
);

ReplyItemRepeater.displayName = 'Comment.ReplyItemRepeater';

export interface ParentCommentProps extends Omit<RootProps, 'comment' | 'currentMemberId'> {}

/**
 * Displays the parent comment when the current comment is a reply to another reply.
 * Only renders if the parent is not a top-level comment.
 *
 * @component
 * @example
 * ```tsx
 * // Default rendering
 * <Comment.ParentComment>
 *   <Comment.Author />
 *   <Comment.Content />
 * </Comment.ParentComment>
 *
 * // Custom rendering with asChild
 * <Comment.ParentComment asChild>
 *   {({ comment: parentComment }) => (
 *     <div>
 *       Replying to: <CommentPreview comment={parentComment} />
 *     </div>
 *   )}
 * </Comment.ParentComment>
 * ```
 */
export const ParentComment = React.forwardRef<HTMLDivElement, ParentCommentProps>((props, ref) => {
  const { children, asChild, className } = props;
  const service = useService(CommentsServiceDefinition);
  const comments = service.getComments();
  const { comment, currentMemberId } = useCommentContext();

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
            currentMemberId={currentMemberId}
          >
            {children}
          </Root>
        );
      }}
    </CoreComments.Comment>
  );
});

ParentComment.displayName = 'Comment.ParentComment';

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
 * <Comment.LoadMoreReplies />
 *
 * // Custom rendering with asChild
 * <Comment.LoadMoreReplies asChild>
 *   {({ hasNextPage, isLoading, loadNextPage }) => (
 *     <button onClick={loadNextPage} disabled={isLoading}>
 *       {isLoading ? 'Loading...' : 'Show more replies'}
 *     </button>
 *   )}
 * </Comment.LoadMoreReplies>
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
          'data-testid': TestIds.loadMoreReplies,
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

LoadMoreReplies.displayName = 'Comment.LoadMoreReplies';

export interface DeleteActionProps {
  /** If callback returns false, the delete action will not be performed. */
  onDelete?: () => boolean;
  asChild?: boolean;
  className?: string;
  children?: React.ReactNode | AsChildChildren<{ deleteComment: () => Promise<void> }>;
}

const DeleteAction = React.forwardRef<HTMLButtonElement, DeleteActionProps>((props, ref) => {
  const { asChild, children, className, onDelete } = props;
  const { deleteComment } = useCommentContext();

  const attributes = {
    'data-testid': TestIds.actionDelete,
  };

  const handleDelete = React.useCallback(async () => {
    if (onDelete && !onDelete()) return;
    await deleteComment();
  }, [deleteComment, onDelete]);

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      {...attributes}
      onClick={handleDelete}
      customElement={children}
      customElementProps={{ deleteComment }}
    >
      {isValidChildren(children) ? children : <button>Delete</button>}
    </AsChildSlot>
  );
});

DeleteAction.displayName = 'Comment.Action.Delete';

export const Action = {
  Delete: DeleteAction,
};
