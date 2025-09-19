import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import React from "react";

/**
 * Displays the excerpt/summary of a blog post with line clamping.
 */
export const PostExcerpt = React.forwardRef<
  HTMLElement,
  { className?: string }
>(({ className }, ref) => {
  return (
    <Blog.Post.Excerpt
      ref={ref}
      className={cn("text-content-secondary line-clamp-3", className)}
    />
  );
});

PostExcerpt.displayName = "PostExcerpt";
