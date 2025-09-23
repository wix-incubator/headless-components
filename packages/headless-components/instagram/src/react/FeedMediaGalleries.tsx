import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface MediaGalleriesProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'> {
  children: React.ReactNode;
  infinite?: boolean;
  autoPlay?: { direction?: 'forward' | 'backward'; intervalMs?: number };
}

/**
 * Feed-level MediaGalleries wrapper that provides MediaGallery.Root
 * with the current feed media items, similar to the Stores pattern.
 */
export const MediaGalleries = React.forwardRef<HTMLDivElement, MediaGalleriesProps>(
  (props, ref) => {
    const { children, className, infinite, autoPlay, ...otherProps } = props;
    const feedService = useService(InstagramFeedServiceDefinition);
    const feed = feedService.feedData.get();

    const media = (feed.mediaItems || [])
      .map((item) => {
        // Mirror Stores: gallery renders images only. Use thumbnail for videos, full image for images.
        const image =
          item.type === 'video'
            ? item.thumbnailUrl || null
            : item.mediaUrl || item.thumbnailUrl || null;
        if (!image) return null;
        return {
          image,
          altText: item.altText,
        };
      })
      .filter(Boolean) as { image: string; altText?: string | null }[];

    return (
      <div ref={ref} className={className} {...otherProps}>
        <MediaGallery.Root
          mediaGalleryServiceConfig={{ media, infinite, autoPlay }}
        >
          {children}
        </MediaGallery.Root>
      </div>
    );
  },
);


