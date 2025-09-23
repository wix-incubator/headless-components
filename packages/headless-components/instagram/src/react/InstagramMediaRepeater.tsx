import React from 'react';
import { WixServices, useService } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
  InstagramFeedServiceDefinition,
} from '../services/index.js';

enum TestIds {
  instagramMediaRepeater = 'instagram-media-repeater',
}

/**
 * Props for InstagramFeed InstagramMediaRepeater component (Repeater Level)
 */
export interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that creates individual service contexts for each Instagram media item.
 * This follows the Repeater Level pattern from the rules.
 * Maps over media items and renders children for each, providing InstagramMedia context.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMediaRepeater>
 *   <InstagramMedia.Caption />
 *   <InstagramMedia.MediaType />
 *   <InstagramMedia.UserName />
 *   <InstagramMedia.Timestamp />
 *   <InstagramMedia.MediaGalleries>
 *     <InstagramMedia.MediaGalleryRepeater>
 *       <MediaGallery.Root />
 *     </InstagramMedia.MediaGalleryRepeater>
 *   </InstagramMedia.MediaGalleries>
 * </InstagramFeed.InstagramMediaRepeater>
 * ```
 */
export const InstagramMediaRepeater = React.forwardRef<
  HTMLElement,
  InstagramMediaRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();
  const { mediaItems } = feedData;

  if (!mediaItems.length) return null;

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
          <div data-testid={TestIds.instagramMediaRepeater}>{children}</div>
        </WixServices>
      ))}
    </>
  );
});
