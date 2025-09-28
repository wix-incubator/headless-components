import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { MediaGallery } from '@wix/headless-media/react';

enum TestIds {
  instagramMediaGalleryRepeater = 'instagram-media-gallery-repeater',
}

export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Transform Instagram media item to MediaGallery format
 */
function transformInstagramToMediaGallery(mediaItem: any) {
  // Handle carousel albums with children
  if (mediaItem.children && mediaItem.children.length > 0) {
    return {
      media: mediaItem.children.map((child: any, index: number) => ({
        image: child.mediaUrl,
        altText: child.caption || `Instagram media ${index + 1}`,
      })),
    };
  }

  // Handle single media items
  const imageUrl =
    mediaItem.type === 'video'
      ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
      : mediaItem.mediaUrl;

  return {
    media: [
      {
        image: imageUrl,
        altText:
          mediaItem.altText ||
          mediaItem.caption ||
          `Instagram ${mediaItem.type}`,
      },
    ],
  };
}

/**
 * Repeater component that wraps MediaGallery.Root internally.
 * Consumer only provides MediaGallery UI components, not MediaGallery.Root.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramMedia.MediaGalleryRepeater>
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Previous />
 *   <MediaGallery.Next />
 *   <MediaGallery.Thumbnails>
 *     <MediaGallery.ThumbnailRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </MediaGallery.ThumbnailRepeater>
 *   </MediaGallery.Thumbnails>
 * </InstagramMedia.MediaGalleryRepeater>
 * ```
 */
export const MediaGalleryRepeater = React.forwardRef<
  HTMLDivElement,
  MediaGalleryRepeaterProps
>((props, ref) => {
  const { children, ...otherProps } = props;
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = mediaItemService.mediaItem.get();

  if (!mediaItem) return null;

  // Transform Instagram data to MediaGallery format automatically
  const mediaGalleryConfig = transformInstagramToMediaGallery(mediaItem);

  return (
    <div
      {...otherProps}
      ref={ref}
      data-testid={TestIds.instagramMediaGalleryRepeater}
    >
      {/* MediaGallery.Root is handled internally by Instagram headless */}
      <MediaGallery.Root mediaGalleryServiceConfig={mediaGalleryConfig}>
        {children}
      </MediaGallery.Root>
    </div>
  );
});

MediaGalleryRepeater.displayName = 'InstagramMedia.MediaGalleryRepeater';
