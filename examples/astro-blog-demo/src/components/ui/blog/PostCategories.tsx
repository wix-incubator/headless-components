import { Chip } from "@/components/ui/blog/Chip";
import { cn } from "@/lib/utils";
import { Blog } from "@wix/blog/components";
import React from "react";

interface PostCategoriesProps {
  /** Additional CSS classes to apply to the component */
  className?: string;
  /** Base URL for category links. If provided, categories render as links; otherwise as plain text */
  baseUrl?: string;
}

/**
 * Displays the categories associated with a blog post.
 * Categories are rendered as chips and can be displayed as links or plain text.
 *
 * @example
 * ```tsx
 * // Render categories as links
 * <PostCategories baseUrl="/category/" />
 *
 * // Render categories as plain text
 * <PostCategories />
 * ```
 */
export const PostCategories = React.forwardRef<
  HTMLElement,
  PostCategoriesProps
>(({ baseUrl, className }, ref) => {
  const CategoryLinkOrLabel = baseUrl
    ? Blog.Category.Link
    : Blog.Category.Label;

  return (
    <Blog.Post.CategoryItems
      ref={ref}
      className={cn("flex flex-wrap gap-2", className)}
    >
      <Blog.Categories.CategoryItemRepeater>
        <Chip asChild>
          <CategoryLinkOrLabel
            className="data-[href]:hover:bg-foreground/5"
            baseUrl={baseUrl}
          />
        </Chip>
      </Blog.Categories.CategoryItemRepeater>
    </Blog.Post.CategoryItems>
  );
});
