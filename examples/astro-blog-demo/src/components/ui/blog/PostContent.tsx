import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import React from "react";
import { RicosViewer } from "../ricos-viewer";

export interface PostContentProps
  extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * Renders the rich content of a blog post.
 *
 * @example
 * ```tsx
 * <PostContent />
 * ```
 */
export const PostContent = React.forwardRef<HTMLDivElement, PostContentProps>(
  ({ className, ...props }, ref) => {
    return (
      <Blog.Post.Content className={cn(className)} ref={ref} {...props}>
        {RicosViewer}
      </Blog.Post.Content>
    );
  }
);

PostContent.displayName = "PostContent";
