import { Blog } from "@wix/blog/components";

import { MemberName } from "./MemberName";

/**
 * Displays the author's name for a blog post.
 */
export const PostAuthorName = () => {
  return (
    <Blog.Post.Author asChild>
      {({ author }) => <MemberName member={author} />}
    </Blog.Post.Author>
  );
};

PostAuthorName.displayName = "PostAuthorName";
