import { Blog } from "@wix/blog/components";
import React from "react";
import { MemberAvatar, type MemberAvatarProps } from "./MemberAvatar";

interface PostAuthorAvatarProps
  extends Pick<MemberAvatarProps, "className" | "size"> {}

/**
 * Displays the author's avatar for a blog post.
 */
export const PostAuthorAvatar = React.forwardRef<
  HTMLElement,
  PostAuthorAvatarProps
>((props, ref) => {
  return (
    <Blog.Post.Author ref={ref} asChild>
      {({ author }) => <MemberAvatar member={author} {...props} />}
    </Blog.Post.Author>
  );
});

PostAuthorAvatar.displayName = "PostAuthorAvatar";
