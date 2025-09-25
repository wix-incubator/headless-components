import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import * as CoreFeedMediaGalleries from './core/FeedMediaGalleries.js';

export interface MediaGalleriesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children?: React.ReactNode;
  /** Enable wrap-around navigation */
  infinite?: boolean;
  /** Auto-play configuration */
  autoPlay?: { direction?: 'forward' | 'backward'; intervalMs?: number };
  /** When true (default), renders a viewport + prev/next + thumbnails by default */
  renderDefault?: boolean;
}

/**
 * Feed-level MediaGalleries wrapper that provides MediaGallery.Root
 * with the current feed media items, similar to the Stores pattern.
 */
export const MediaGalleries = React.forwardRef<HTMLDivElement, MediaGalleriesProps>(
  (props, ref) => {
    const { children, className, infinite, autoPlay, renderDefault = true, ...otherProps } = props;

    return (
      <CoreFeedMediaGalleries.MediaGalleries>
        {({ media }) => (
          <div ref={ref} className={className} {...otherProps}>
            <MediaGallery.Root mediaGalleryServiceConfig={{ media, infinite, autoPlay }}>
              {renderDefault && (
                <>
                  <MediaGallery.Viewport />
                  <div>
                    <MediaGallery.Previous />
                    <MediaGallery.Next />
                  </div>
                  <MediaGallery.Thumbnails>
                    <MediaGallery.ThumbnailRepeater>
                      <MediaGallery.ThumbnailItem />
                    </MediaGallery.ThumbnailRepeater>
                  </MediaGallery.Thumbnails>
                </>
              )}
              {children}
            </MediaGallery.Root>
          </div>
        )}
      </CoreFeedMediaGalleries.MediaGalleries>
    );
  },
);


