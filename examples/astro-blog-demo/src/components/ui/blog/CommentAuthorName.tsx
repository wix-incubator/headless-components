import { Blog } from "@wix/blog/components";
import { MemberName } from "./MemberName";

/**
 * Displays the comment author's name using the Blog.Post.Comment.Author component.
 */
export function CommentAuthorName() {
  return (
    <Blog.Post.Comment.Author asChild>
      {({ author }) => <MemberName member={author} />}
    </Blog.Post.Comment.Author>
  );
}

CommentAuthorName.displayName = "CommentAuthorName";
