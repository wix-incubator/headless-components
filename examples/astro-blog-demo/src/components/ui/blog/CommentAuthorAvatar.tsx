import { Blog } from "@wix/blog/components";
import React from "react";
import { MemberAvatar, type MemberAvatarProps } from "./MemberAvatar";

interface CommentAuthorAvatarProps
  extends Pick<MemberAvatarProps, "className" | "size"> {}

export const CommentAuthorAvatar = React.forwardRef<
  HTMLElement,
  CommentAuthorAvatarProps
>((props, ref) => {
  return (
    <Blog.Post.Comment.Status asChild>
      {({ status }) =>
        (status === "DELETED" || status === 'HIDDEN') ? (
          <MemberAvatar member={undefined} {...props} />
        ) : (
          <Blog.Post.Comment.Author asChild ref={ref}>
            {({ author }) => <MemberAvatar member={author} {...props} />}
          </Blog.Post.Comment.Author>
        )
      }
    </Blog.Post.Comment.Status>
  );
});

CommentAuthorAvatar.displayName = "CommentAuthorAvatar";
