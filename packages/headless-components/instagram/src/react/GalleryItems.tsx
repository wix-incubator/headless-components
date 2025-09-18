import React from 'react';
import { TestIds } from './types.js';
import { useGalleryContext } from './contexts.js';

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
 *   <InstagramFeed.GalleryRepeater>
 *     <InstagramFeed.GalleryItem>
 *       <InstagramFeed.Media />
 *     </InstagramFeed.GalleryItem>
 *   </InstagramFeed.GalleryRepeater>
 * </InstagramFeed.GalleryItems>
 * ```
 */
export const GalleryItems = React.forwardRef<HTMLDivElement, GalleryItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const { hasItems } = useGalleryContext();

    if (!hasItems) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.instagramFeedGalleryItems,
    };

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);
