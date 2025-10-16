import React from 'react';
import type { CommentWithResolvedFields } from '../services/blog-post-comments-service.js';

const TopLevelCommentContext = React.createContext<CommentWithResolvedFields | null>(null);

/**
 * Hook to access the top-level comment context.
 * Used internally for reply functionality to reference the root comment.
 *
 * @internal
 */
export function useTopLevelCommentContext(): CommentWithResolvedFields {
  const context = React.useContext(TopLevelCommentContext);

  if (!context) {
    throw new Error(
      'useRootCommentContext must be used within a Blog.Post.Comments.CommentRepeater component',
    );
  }

  return context;
}

type TopLevelCommentRootProps = {
  comment: CommentWithResolvedFields;
  children: React.ReactNode;
};

/**
 * Internal component that provides top-level comment context.
 * Used by the CommentRepeater to establish the root comment for nested replies.
 *
 * @internal
 */
export const TopLevelCommentRoot = (props: TopLevelCommentRootProps) => {
  const { comment, children } = props;

  return (
    <TopLevelCommentContext.Provider value={comment}>{children}</TopLevelCommentContext.Provider>
  );
};

TopLevelCommentRoot.displayName = 'Blog.Post.Comments.TopLevelCommentRoot/Internal';
