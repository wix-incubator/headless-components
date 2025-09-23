import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMediaGalleries = 'instagram-media-galleries',
}

/**
 * Props for InstagramMedia MediaGalleries component (Container Level)
 */
export interface MediaGalleriesProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    hasGalleryItems: boolean;
    galleryItems: Array<{ image: string; altText: string }>;
  }>;
  className?: string;
}

/**
 * Container for Instagram media galleries, implementing the Container Level
 * of the 3-level pattern. Does not render if no gallery items are available.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaGalleries>
 *   <InstagramMedia.MediaGalleryRepeater>
 *     <MediaGallery.Root />
 *   </InstagramMedia.MediaGalleryRepeater>
 * </InstagramMedia.MediaGalleries>
 *
 * // AsChild pattern for custom container
 * <InstagramMedia.MediaGalleries asChild>
 *   {({ hasGalleryItems, galleryItems, ...props }) => (
 *     <div {...props} className="media-gallery-container">
 *       {hasGalleryItems && (
 *         <span className="gallery-count">
 *           {galleryItems.length} items
 *         </span>
 *       )}
 *     </div>
 *   )}
 * </InstagramMedia.MediaGalleries>
 * ```
 */
export const MediaGalleries = React.forwardRef<
  HTMLDivElement,
  MediaGalleriesProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
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

  const contextValue = {
    hasGalleryItems,
    galleryItems,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={contextValue}
      data-testid={TestIds.instagramMediaGalleries}
      {...otherProps}
    >
      <div>{React.isValidElement(children) ? children : null}</div>
    </AsChildSlot>
  );
});
