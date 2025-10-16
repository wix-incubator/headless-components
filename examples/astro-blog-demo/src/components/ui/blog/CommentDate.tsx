import { Blog } from "@wix/blog/components";
import { RelativeDate } from "./RelativeDate";

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
