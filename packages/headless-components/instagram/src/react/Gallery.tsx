import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { AsChildSlot } from '@wix/headless-utils/react';
import * as CoreGalleryItems from './core/GalleryItems.js';

export interface GalleryProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Gallery = React.forwardRef<HTMLElement, GalleryProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreGalleryItems.GalleryItems>
        {({ hasItems, mediaItems }) => {
          if (!hasItems) return null;

          // Transform mediaItems to mediaGalleryItems format
          const mediaGalleryItems = mediaItems.map((mediaItem) => ({
            image:
              mediaItem.type === 'video'
                ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
                : mediaItem.mediaUrl,
            altText:
              mediaItem.altText ||
              mediaItem.caption ||
              `Instagram ${mediaItem.type}`,
          }));

          return (
            <MediaGallery.Root
              mediaGalleryServiceConfig={{ media: mediaGalleryItems }}
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
        }}
      </CoreGalleryItems.GalleryItems>
    );
  },
);
