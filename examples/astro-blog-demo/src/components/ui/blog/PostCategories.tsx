import { Chip } from '@/components/ui/blog/Chip';
import { cn } from '@/lib/utils';
import { Blog } from '@wix/blog/components';
import React from 'react';

interface PostCategoriesProps {
  className?: string;
  baseUrl?: string;
}

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
      className={cn('flex flex-wrap gap-2', className)}
    >
      <Blog.Categories.CategoryItemRepeater>
        <Chip variant="secondary" asChild>
          <CategoryLinkOrLabel
            className="data-[href]:hover:bg-foreground/5"
            baseUrl={baseUrl}
          />
        </Chip>
      </Blog.Categories.CategoryItemRepeater>
    </Blog.Post.CategoryItems>
  );
});
