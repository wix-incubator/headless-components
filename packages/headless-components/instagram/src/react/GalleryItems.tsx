import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * Props for InstagramFeed GalleryItems component (List Container Level)
 */
export interface GalleryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for gallery items with empty state support.
 * This follows the List Container Level pattern from the rules.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.GalleryItems emptyState={<div>No photos to display</div>}>
 *   <div className="grid grid-cols-3 gap-4">
 *     <InstagramFeed.GalleryItemRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </InstagramFeed.GalleryItemRepeater>
 *   </div>
 * </InstagramFeed.GalleryItems>
 * ```
 */
export const GalleryItems = React.forwardRef<HTMLDivElement, GalleryItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const instagramFeedService = useService(InstagramFeedServiceDefinition);
    const feedData = instagramFeedService.feedData.get();

    const hasItems = feedData.mediaItems.length > 0;

    if (!hasItems) {
      return emptyState || null;
    }

    return (
      <div ref={ref}>
        <MediaGallery.Thumbnails>
          {children}
        </MediaGallery.Thumbnails>
      </div>
    );
  },
);
