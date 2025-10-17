import { Blog } from "@wix/blog/components";
import { RelativeDate } from "./RelativeDate";

/**
 * Displays the comment date in a relative time format (e.g., "2 hours ago").
 */
export function CommentDate({
  className,
  uiLocale,
}: {
  className?: string;
  uiLocale: string;
}) {
  return (
    <Blog.Post.Comment.CommentDate asChild className={className}>
      {({ commentDate }) => (
        <RelativeDate date={commentDate} locale={uiLocale} />
      )}
    </Blog.Post.Comment.CommentDate>
  );
}

CommentDate.displayName = "CommentDate";
