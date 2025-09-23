import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { MediaGallery } from '@wix/headless-media/react';

enum TestIds {
  instagramMediaGalleryRepeater = 'instagram-media-gallery-repeater',
}

/**
 * Props for InstagramMedia MediaGalleryRepeater component
 */
export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component for Instagram media galleries, implementing the Repeater Level
 * of the 3-level pattern. Uses MediaGallery.Root from @wix/headless-media/react.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaGalleryRepeater>
 *   <MediaGallery.Root />
 * </InstagramMedia.MediaGalleryRepeater>
 *
 * // With custom MediaGallery components
 * <InstagramMedia.MediaGalleryRepeater>
 *   <MediaGallery.Root>
 *     <MediaGallery.Thumbnails>
 *       <MediaGallery.ThumbnailRepeater>
 *         <MediaGallery.ThumbnailItem />
 *       </MediaGallery.ThumbnailRepeater>
 *     </MediaGallery.Thumbnails>
 *   </MediaGallery.Root>
 * </InstagramMedia.MediaGalleryRepeater>
 * ```
 */
export const MediaGalleryRepeater = React.forwardRef<
  HTMLElement,
  MediaGalleryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = mediaItemService.mediaItem.get();

  // Convert Instagram media item to MediaGallery format
  const galleryItems = [
    {
      image:
        mediaItem.type === 'video'
          ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
          : mediaItem.mediaUrl,
      altText:
        mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
    },
  ];

  const hasGalleryItems = galleryItems.length > 0 && galleryItems[0]?.image;

  if (!hasGalleryItems) return null;

  return (
    <MediaGallery.Root
      mediaGalleryServiceConfig={{
        media: galleryItems,
      }}
    >
      <div data-testid={TestIds.instagramMediaGalleryRepeater}>{children}</div>
    </MediaGallery.Root>
  );
});
