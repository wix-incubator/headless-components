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
 *     <InstagramMedia.MediaGalleryItems>
 *       <InstagramMedia.MediaGalleryRepeater>
 *         <MediaGallery.Root>
 *           <MediaGallery.Viewport />
 *         </MediaGallery.Root>
 *       </InstagramMedia.MediaGalleryRepeater>
 *     </InstagramMedia.MediaGalleryItems>
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
 * Now properly handles carousel children
 */
export function transformToMediaGalleryFormat(mediaItem: any) {
  // Handle carousel albums with children
  if (mediaItem.children && mediaItem.children.length > 0) {
    return mediaItem.children.map((child: any, index: number) => ({
      image: child.mediaUrl || child.mediaUrl,
      altText: child.caption || `Instagram media ${index + 1}`,
    }));
  }

  // Handle single media items
  const imageUrl =
    mediaItem.type === 'video'
      ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
      : mediaItem.mediaUrl;

  return [
    {
      image: imageUrl,
      altText:
        mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
    },
  ];
}

/**
 * Check if media item has valid gallery items
 */
export function hasValidGalleryItems(
  galleryItems: Array<{ image: string; altText: string }>,
) {
  return galleryItems.length > 0 && galleryItems[0]?.image;
}
