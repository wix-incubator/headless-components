import { Blog } from "@wix/blog/components";
import React from "react";
import { MemberAvatar, type MemberAvatarProps } from "./MemberAvatar";

interface CommentAuthorAvatarProps
  extends Pick<MemberAvatarProps, "className" | "size"> {}

/**
 * Displays the comment author's avatar using the Blog.Post.Comment.Author component.
 */
export const CommentAuthorAvatar = React.forwardRef<
  HTMLElement,
  CommentAuthorAvatarProps
>((props, ref) => {
  return (
    <Blog.Post.Comment.Author asChild ref={ref}>
      {({ author }) => <MemberAvatar member={author} {...props} />}
    </Blog.Post.Comment.Author>
  );
});

CommentAuthorAvatar.displayName = "CommentAuthorAvatar";
