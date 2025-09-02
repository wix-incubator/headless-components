import { Blog } from "@wix/blog/components";
import { MemberName } from "./MemberName";

export function CommentAuthorName() {
  return (
    <Blog.Post.Comment.Author asChild>
      {({ author }) => <MemberName member={author} />}
    </Blog.Post.Comment.Author>
  );
}

CommentAuthorName.displayName = "CommentAuthorName";
