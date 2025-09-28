import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramFeedServiceDefinition,
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
} from '../services/index.js';
import { Root as InstagramMediaRoot } from './InstagramMedia.js';

/**
 * Props for InstagramFeed InstagramMediaRepeater component
 */
export interface InstagramMediaRepeaterProps {
  /** Template to repeat for each media item */
  children: React.ReactNode;
}

/**
 * Simple repeater component for Instagram media items.
 * MediaGallery integration handled by InstagramFeed.MediaGallery and InstagramMedia.MediaGallery wrappers.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMediaRepeater>
 *   <InstagramFeed.MediaGallery>
 *     <MediaGallery.Previous />
 *     <MediaGallery.Next />
 *   </InstagramFeed.MediaGallery>
 *
 *   <InstagramMedia.Caption />
 *   <InstagramMedia.MediaType />
 *
 *   <InstagramMedia.MediaGallery>
 *     <MediaGallery.Viewport />
 *   </InstagramMedia.MediaGallery>
 * </InstagramFeed.InstagramMediaRepeater>
 * ```
 */
export const InstagramMediaRepeater = React.forwardRef<
  HTMLElement,
  InstagramMediaRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();

  const mediaItems = feedData?.mediaItems || [];

  if (mediaItems.length === 0) return null;

  return (
    <>
      {mediaItems.map((mediaItem: any, index: number) => (
        <WixServices
          key={mediaItem.id || index}
          servicesMap={createServicesMap().addService(
            InstagramMediaItemServiceDefinition,
            InstagramMediaItemService,
            { mediaItem, index },
          )}
        >
          <InstagramMediaRoot data-testid="instagram-media-repeater">
            {children}
          </InstagramMediaRoot>
        </WixServices>
      ))}
    </>
  );
});
