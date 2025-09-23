import React from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { useInstagramMediasContext } from './InstagramMedias.js';
import {
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
} from '../services/index.js';

/**
 * Props for InstagramFeed InstagramMediaRepeater component (Repeater Level)
 */
export interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}

enum TestIds {
  instagramMediaItem = 'instagram-media-item',
}

/**
 * Repeater component that renders children for each Instagram media item.
 * This follows the Repeater Level pattern from the architecture rules.
 * Maps over items and provides each item context through WixServices.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMediaRepeater>
 *   <InstagramMedia.Root>
 *     <InstagramMedia.Caption />
 *     <InstagramMedia.MediaType />
 *   </InstagramMedia.Root>
 * </InstagramFeed.InstagramMediaRepeater>
 *
 * // Simple usage with MediaGallery
 * <InstagramFeed.InstagramMediaRepeater>
 *   <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
 * </InstagramFeed.InstagramMediaRepeater>
 * ```
 */
export const InstagramMediaRepeater = React.forwardRef<HTMLElement, InstagramMediaRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { hasItems, mediaItems } = useInstagramMediasContext();

    if (!hasItems) return null;

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
            <div data-testid={TestIds.instagramMediaItem}>
              {children as React.ReactElement}
            </div>
          </WixServices>
        ))}
      </>
    );
  },
);
