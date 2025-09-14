import { cn } from '@/lib/utils';
import { Blog } from '@wix/headless-blog/react';
import React from 'react';

export const PostExcerpt = React.forwardRef<
  HTMLElement,
  { className?: string }
>(({ className }, ref) => {
  return (
    <Blog.Post.Excerpt
      ref={ref}
      className={cn('text-content-secondary line-clamp-3', className)}
    />
  );
});

PostExcerpt.displayName = 'PostExcerpt';
