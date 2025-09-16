import React from 'react';
import { AsChildSlot, TestIds } from './types.js';
import {
  useInstagramFeedContext,
  GalleryContext,
  type GalleryContextValue,
} from './contexts.js';

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
 *     <InstagramFeed.GalleryRepeater>
 *       <InstagramFeed.GalleryItem>
 *         <InstagramFeed.Media />
 *       </InstagramFeed.GalleryItem>
 *     </InstagramFeed.GalleryRepeater>
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
    const { feedData } = useInstagramFeedContext();

    const hasItems = feedData.mediaItems.length > 0;

    // Don't render if no items (following the Container Level pattern)
    if (!hasItems) return null;

    const contextValue: GalleryContextValue = {
      hasItems,
      mediaItems: feedData.mediaItems,
    };

    return (
      <GalleryContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.instagramFeedGallery}
          customElement={children}
          {...otherProps}
        >
          <div>{React.isValidElement(children) ? children : null}</div>
        </AsChildSlot>
      </GalleryContext.Provider>
    );
  },
);
