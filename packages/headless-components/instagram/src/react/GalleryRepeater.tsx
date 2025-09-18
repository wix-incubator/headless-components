import React from 'react';
import { type InstagramMediaItem } from '../services/index.js';
import { TestIds } from './types.js';
import {
  useGalleryContext,
  GalleryItemContext,
  type GalleryItemContextValue,
} from './contexts.js';

/**
 * Props for InstagramFeed GalleryRepeater component (Repeater Level)
 */
export interface GalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each media item.
 * This follows the Repeater Level pattern from the rules.
 *
 * @component
 */
export const GalleryRepeater = React.forwardRef<
  HTMLElement,
  GalleryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const { hasItems, mediaItems } = useGalleryContext();

  if (!hasItems) return null;

  return (
    <>
      {mediaItems.map((mediaItem: InstagramMediaItem, index: number) => {
        const contextValue: GalleryItemContextValue = {
          mediaItem,
          index,
        };

        return (
          <GalleryItemContext.Provider key={mediaItem.id} value={contextValue}>
            <div data-testid={TestIds.instagramFeedGalleryItem}>{children}</div>
          </GalleryItemContext.Provider>
        );
      })}
    </>
  );
});
