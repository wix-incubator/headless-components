import React from 'react';
import { useInstagramMediasContext } from './InstagramMedias.js';

/**
 * Props for InstagramFeed InstagramMediaItems component (List Container Level)
 */
export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

enum TestIds {
  instagramMediaItems = 'instagram-media-items',
}

/**
 * Container for Instagram media items with empty state support.
 * This follows the List Container Level pattern from the architecture rules.
 * Simple container that supports emptyState prop and renders emptyState when no items.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMediaItems emptyState={<div>No posts to display</div>}>
 *   <div className="grid grid-cols-3 gap-4">
 *     <InstagramFeed.InstagramMediaRepeater>
 *       <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
 *     </InstagramFeed.InstagramMediaRepeater>
 *   </div>
 * </InstagramFeed.InstagramMediaItems>
 * ```
 */
export const InstagramMediaItems = React.forwardRef<HTMLDivElement, InstagramMediaItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const { hasItems } = useInstagramMediasContext();

    if (!hasItems) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.instagramMediaItems,
    };

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);
