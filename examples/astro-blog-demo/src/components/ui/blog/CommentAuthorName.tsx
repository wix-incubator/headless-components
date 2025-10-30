import { Comment } from "@wix/blog/components";
import { MemberName } from "./MemberName";

/**
 * Displays the comment author's name using the Comment.Author component.
 */
export function CommentAuthorName() {
  return (
    <Comment.Author asChild>
      {({ author }) => <MemberName member={author} />}
    </Comment.Author>
  );
}

CommentAuthorName.displayName = "CommentAuthorName";
