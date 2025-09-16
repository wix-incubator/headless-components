import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import { cva, type VariantProps } from "class-variance-authority";
import React from "react";

export const postTitleVariants = cva("text-foreground", {
  variants: {
    variant: {
      base: "text-xl leading-tight font-medium",
      lg: "text-3xl leading-tight font-semibold",
      xl: "-mt-1 text-3xl leading-tight font-bold tracking-tight md:text-5xl",
    },
  },
  defaultVariants: {
    variant: "base",
  },
});

export interface PostTitleProps
  extends React.ComponentProps<typeof Blog.Post.Title>,
    VariantProps<typeof postTitleVariants> {}

/**
 * Displays the title of a blog post with customizable size variants.
 *
 * @example
 * ```tsx
 * <PostTitle variant="xl" />
 * <PostTitle variant="lg" />
 * ```
 */
export const PostTitle = React.forwardRef<HTMLElement, PostTitleProps>(
  ({ className, variant, ...props }, ref) => {
    return (
      <Blog.Post.Title
        className={cn(postTitleVariants({ variant, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);

PostTitle.displayName = "PostTitle";
