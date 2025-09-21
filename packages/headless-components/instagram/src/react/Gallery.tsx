import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { AsChildSlot } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface GalleryProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

export const Gallery = React.forwardRef<HTMLElement, GalleryProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hasItems = feedData.mediaItems.length > 0;
  if (!hasItems) return null;

  const mediaGalleryItems = feedData.mediaItems.map((mediaItem) => ({
    image: mediaItem.type === 'video' ? (mediaItem.thumbnailUrl || mediaItem.mediaUrl) : mediaItem.mediaUrl,
    altText: mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
  }));

  return (
    <MediaGallery.Root mediaGalleryServiceConfig={{ media: mediaGalleryItems }}>
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
});


