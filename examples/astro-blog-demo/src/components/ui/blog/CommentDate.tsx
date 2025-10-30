import { Comment } from "@wix/blog/components";
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
    <Comment.CommentDate asChild className={className}>
      {({ commentDate }) => (
        <RelativeDate date={commentDate} locale={uiLocale} />
      )}
    </Comment.CommentDate>
  );
}

CommentDate.displayName = "CommentDate";
