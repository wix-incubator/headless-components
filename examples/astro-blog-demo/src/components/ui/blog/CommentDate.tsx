import { Blog } from "@wix/blog/components";
import { RelativeDate } from "./RelativeDate";

export function CommentDate({ uiLocale }: { uiLocale: string }) {
  return (
    <Blog.Post.Comment.CommentDate asChild>
      {({ commentDate }) => (
        <RelativeDate date={commentDate} locale={uiLocale} />
      )}
    </Blog.Post.Comment.CommentDate>
  );
}

CommentDate.displayName = "CommentDate";
