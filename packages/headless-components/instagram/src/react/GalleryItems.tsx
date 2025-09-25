import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import * as CoreGalleryItems from './core/GalleryItems.js';

export interface GalleryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

export const GalleryItems = React.forwardRef<HTMLDivElement, GalleryItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;

    return (
      <CoreGalleryItems.GalleryItems>
        {({ hasItems }) => {
          if (!hasItems) return emptyState || null;

          return (
            <div ref={ref}>
              <MediaGallery.Thumbnails>{children}</MediaGallery.Thumbnails>
            </div>
          );
        }}
      </CoreGalleryItems.GalleryItems>
    );
  },
);
