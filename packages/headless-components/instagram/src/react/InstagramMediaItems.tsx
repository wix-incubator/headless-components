import React from 'react';
import * as CoreGalleryItems from './core/GalleryItems.js';

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * This component will be removed in a future release.
 */
export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * List container previously used to gate empty state. Prefer handling empty state on InstagramMedias.
 */
export const InstagramMediaItems = React.forwardRef<
  HTMLDivElement,
  InstagramMediaItemsProps
>((props, ref) => {
  const { children, emptyState } = props;

  return (
    <CoreGalleryItems.GalleryItems>
      {({ hasItems }) => {
        if (!hasItems) return emptyState ?? null;

        return <div ref={ref}>{children}</div>;
      }}
    </CoreGalleryItems.GalleryItems>
  );
});
