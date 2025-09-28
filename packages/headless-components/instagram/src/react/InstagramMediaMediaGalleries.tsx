import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';

enum TestIds {
  instagramMediaGalleries = 'instagram-media-galleries',
}

export interface MediaGalleriesProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for media galleries in an Instagram media item.
 * Handles the container level for media children (carousel images/videos).
 *
 * @component
 * @example
 * ```tsx
 * <InstagramMedia.MediaGalleries>
 *   <InstagramMedia.MediaGalleryRepeater>
 *     // MediaGallery components handled internally
 *   </InstagramMedia.MediaGalleryRepeater>
 * </InstagramMedia.MediaGalleries>
 * ```
 */
export const MediaGalleries = React.forwardRef<
  HTMLDivElement,
  MediaGalleriesProps
>((props, ref) => {
  const { children, emptyState, ...otherProps } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = mediaItemService.mediaItem.get();

  // Check if this media item has children (carousel)
  const hasChildren = mediaItem?.children && mediaItem.children.length > 0;

  return (
    <div
      {...otherProps}
      ref={ref}
      data-testid={TestIds.instagramMediaGalleries}
    >
      {hasChildren ? children : emptyState}
    </div>
  );
});

MediaGalleries.displayName = 'InstagramMedia.MediaGalleries';
