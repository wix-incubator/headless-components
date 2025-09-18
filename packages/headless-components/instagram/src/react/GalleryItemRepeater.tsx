import React from 'react';
import { MediaGallery } from '@wix/headless-media/react';
import { WixServices, useService } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
  InstagramFeedServiceDefinition,
} from '../services/index.js';

/**
 * Props for InstagramFeed GalleryItemRepeater component (Repeater Level)
 */
export interface GalleryItemRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual service contexts for each Instagram media item.
 * This follows the WixServices pattern like ProductList.ItemContent, creating a service context
 * for each media item that can be consumed by child components.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.GalleryItemRepeater>
 *   <MediaGallery.ThumbnailItem asChild>
 *     {({ src, alt, index }) => <CustomMediaCard src={src} alt={alt} index={index} />}
 *   </MediaGallery.ThumbnailItem>
 * </InstagramFeed.GalleryItemRepeater>
 * ```
 */
export const GalleryItemRepeater: React.FC<GalleryItemRepeaterProps> = ({ children }) => {
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();
  const { mediaItems } = feedData;

  if (!mediaItems.length) return null;

  // Use MediaGallery.ThumbnailRepeater for iteration, but wrap children with Instagram service context
  return (
    <MediaGallery.ThumbnailRepeater>
      <ItemWrapper mediaItems={mediaItems}>
        {children}
      </ItemWrapper>
    </MediaGallery.ThumbnailRepeater>
  );
};

// Component that provides Instagram service context using MediaGallery's index
const ItemWrapper: React.FC<{
  children: React.ReactNode;
  mediaItems: any[];
}> = ({ children, mediaItems }) => {
  // This will be called by MediaGallery.ThumbnailRepeater for each item
  return React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    // Clone the MediaGallery.ThumbnailItem and enhance its render prop
    return React.cloneElement(child, {
      ...child.props,
      children: child.props.asChild
        ? (mediaGalleryProps: { src: string; alt: string; index: number }) => {
            const { index } = mediaGalleryProps;
            const mediaItem = mediaItems[index];

            if (!mediaItem) return null;

            // Wrap with Instagram service context
            return (
              <WixServices
                servicesMap={createServicesMap().addService(
                  InstagramMediaItemServiceDefinition,
                  InstagramMediaItemService,
                  { mediaItem, index }
                )}
              >
                {typeof child.props.children === 'function'
                  ? child.props.children(mediaGalleryProps)
                  : child.props.children}
              </WixServices>
            );
          }
        : child.props.children,
    });
  });
};
