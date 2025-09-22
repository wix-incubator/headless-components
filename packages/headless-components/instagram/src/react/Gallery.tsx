import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { AsChildSlot } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * Props for InstagramFeed Gallery component (Container Level)
 */
export interface GalleryProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children: React.ReactNode;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Gallery container for Instagram media items.
 * Does not render when there are no media items.
 * This follows the Container Level pattern from the rules.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.Gallery>
 *   <InstagramFeed.GalleryItems>
 *     <InstagramFeed.GalleryItemRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </InstagramFeed.GalleryItemRepeater>
 *   </InstagramFeed.GalleryItems>
 * </InstagramFeed.Gallery>
 *
 * // asChild with custom container
 * <InstagramFeed.Gallery asChild>
 *   <section className="gallery-section">
 *     <InstagramFeed.GalleryItems>
 *       // gallery content
 *     </InstagramFeed.GalleryItems>
 *   </section>
 * </InstagramFeed.Gallery>
 * ```
 */
export const Gallery = React.forwardRef<HTMLElement, GalleryProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const instagramFeedService = useService(InstagramFeedServiceDefinition);
    const feedData = instagramFeedService.feedData.get();

    const hasItems = feedData.mediaItems.length > 0;

    // Don't render if no items (following the Container Level pattern)
    if (!hasItems) return null;

    // Convert Instagram media items to MediaGallery format
    // Note: MediaGallery only supports images, so we use thumbnails for videos
    const mediaGalleryItems = feedData.mediaItems.map((mediaItem) => ({
      image:
        mediaItem.type === 'video'
          ? mediaItem.thumbnailUrl || mediaItem.mediaUrl // Use thumbnail for videos
          : mediaItem.mediaUrl,
      altText:
        mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
    }));

    return (
      <MediaGallery.Root
        mediaGalleryServiceConfig={{
          media: mediaGalleryItems,
        }}
      >
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          customElement={children}
          {...otherProps}
        >
          <div>{React.isValidElement(children) ? children : null}</div>
        </AsChildSlot>
      </MediaGallery.Root>
    );
  },
);
