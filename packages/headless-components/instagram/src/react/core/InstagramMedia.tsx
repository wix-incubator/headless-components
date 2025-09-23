import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../../services/index.js';

/**
 * Props for InstagramMedia Root component
 */
export interface RootProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Root component for individual Instagram media items.
 * This component provides the foundation for rendering a single media item
 * and integrates with the MediaGallery service.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * // Used internally by InstagramMediaRepeater
 * <InstagramMedia.Root>
 *   <InstagramMedia.Caption />
 *   <InstagramMedia.MediaType />
 *   <InstagramMedia.MediaGalleries>
 *     <InstagramMedia.MediaGalleryRepeater>
 *       <MediaGallery.Root />
 *     </InstagramMedia.MediaGalleryRepeater>
 *   </InstagramMedia.MediaGalleries>
 * </InstagramMedia.Root>
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, className, ...attrs } = props;

  const attributes = {
    className,
    ...attrs,
  };

  return <div {...attributes}>{children}</div>;
}

/**
 * Hook to get the current Instagram media item from service context
 */
export function useInstagramMediaItem() {
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  return mediaItemService.mediaItem.get();
}

/**
 * Transform Instagram media item to MediaGallery format
 * This is the core transformation logic used by MediaGallery components
 */
export function transformToMediaGalleryFormat(mediaItem: any) {
  // For external URLs (like demo data), we need to wrap them in a media object format
  // that MediaGallery can understand
  const imageUrl =
    mediaItem.type === 'video'
      ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
      : mediaItem.mediaUrl;

  const transformedData = [
    {
      // MediaGallery expects either a Wix media object or a URL
      // For external URLs, we pass them directly as the image property
      image: imageUrl,
      altText:
        mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
      // Add additional metadata that MediaGallery might need
      url: imageUrl,
      type: mediaItem.type === 'video' ? 'video' : 'image',
    },
  ];

  return transformedData;
}

/**
 * Check if media item has valid gallery items
 */
export function hasValidGalleryItems(
  galleryItems: Array<{ image: string; altText: string }>,
) {
  return galleryItems.length > 0 && galleryItems[0]?.image;
}
