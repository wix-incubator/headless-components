import { Blog } from "@wix/blog/components";

export const PostReadingTime = () => {
  return (
    <Blog.Post.ReadingTime asChild>
      {({ readingTime }) => <span>{readingTime} min read</span>}
    </Blog.Post.ReadingTime>
  );
};

PostReadingTime.displayName = "PostReadingTime";
