import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface GalleryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

export const GalleryItems = React.forwardRef<HTMLDivElement, GalleryItemsProps>((props, ref) => {
  const { children, emptyState } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hasItems = feedData.mediaItems.length > 0;
  if (!hasItems) return emptyState || null;

  return (
    <div ref={ref}>
      <MediaGallery.Thumbnails>
        {children}
      </MediaGallery.Thumbnails>
    </div>
  );
});


