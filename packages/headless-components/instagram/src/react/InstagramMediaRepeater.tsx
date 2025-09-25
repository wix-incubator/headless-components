import React from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemServiceDefinition,
  InstagramMediaItemService,
} from '../services/index.js';
import * as CoreInstagramMedias from './core/InstagramMedias.js';
import { MediaGallery } from '@wix/headless-media/react';

export interface InstagramMediaRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeats children for each Instagram media item, providing a per-item service context.
 */
export const InstagramMediaRepeater: React.FC<InstagramMediaRepeaterProps> = ({
  children,
}) => {
  return (
    <CoreInstagramMedias.InstagramMedias>
      {({ hasItems, mediaItems }) => {
        if (!hasItems) return null;

        return (
          <>
            {mediaItems.map((mediaItem, index) => (
              <WixServices
                key={mediaItem.id || index}
                servicesMap={createServicesMap().addService(
                  InstagramMediaItemServiceDefinition,
                  InstagramMediaItemService,
                  { mediaItem, index },
                )}
              >
                <MediaGallery.Root
                  mediaGalleryServiceConfig={{
                    media: [
                      {
                        image: (mediaItem.type === 'video'
                          ? (mediaItem.thumbnailUrl || mediaItem.mediaUrl)
                          : mediaItem.mediaUrl) || '',
                        altText: mediaItem.altText || '',
                      }
                    ].filter(item => item.image) // Only include items with valid image URLs
                  }}
                >
                  {children}
                </MediaGallery.Root>
              </WixServices>
            ))}
          </>
        );
      }}
    </CoreInstagramMedias.InstagramMedias>
  );
};
