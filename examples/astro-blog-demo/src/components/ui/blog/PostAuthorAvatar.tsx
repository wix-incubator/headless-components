import { cn } from '@/lib/utils';
import { Blog } from '@wix/blog/components';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '../avatar';

const avatarSizeVariants = cva('bg-foreground/10', {
  variants: {
    size: {
      sm: 'h-6 w-6',
      md: 'h-8 w-8',
      lg: 'h-10 w-10',
    },
  },
  defaultVariants: {
    size: 'sm',
  },
});

export type AvatarSize = NonNullable<
  VariantProps<typeof avatarSizeVariants>['size']
>;

interface PostAuthorAvatarProps {
  className?: string;
  avatarSize?: AvatarSize;
}

export const PostAuthorAvatar = React.forwardRef<
  HTMLElement,
  PostAuthorAvatarProps
>(({ avatarSize, className }, ref) => {
  return (
    <Blog.Post.AuthorAvatar asChild>
      {({ authorAvatarUrl, authorNameInitials }) => {
        return (
          <Avatar
            className={cn(avatarSizeVariants({ size: avatarSize }), className)}
          >
            <AvatarImage src={authorAvatarUrl} />
            <AvatarFallback className="bg-inherit">
              {authorNameInitials}
            </AvatarFallback>
          </Avatar>
        );
      }}
    </Blog.Post.AuthorAvatar>
  );
});

PostAuthorAvatar.displayName = 'PostAuthorAvatar';
