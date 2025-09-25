import React from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import { MediaGallery } from '@wix/headless-media/react';
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
 * Repeater component that renders MediaGallery.Root for each Instagram media item.
 * This follows the Repeater Level pattern from the architecture rules.
 * Maps over items, creates MediaGallery.Root with media data, and provides Instagram media item context.
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
 *     <InstagramMedia.MediaGalleryItems>
 *       <InstagramMedia.MediaGalleryRepeater>
 *         <MediaGallery.Thumbnails>
 *           <MediaGallery.ThumbnailRepeater>
 *             <MediaGallery.ThumbnailItem />
 *           </MediaGallery.ThumbnailRepeater>
 *         </MediaGallery.Thumbnails>
 *       </InstagramMedia.MediaGalleryRepeater>
 *     </InstagramMedia.MediaGalleryItems>
 *   </InstagramMedia.MediaGalleries>
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
        {mediaItems.map((mediaItem: any, index: number) => {
          // Convert Instagram media to MediaGallery format
          let mediaGalleryItems;

          if (mediaItem.type === 'carousel' && mediaItem.children && mediaItem.children.length > 0) {
            // Convert all carousel children to MediaGallery format
            mediaGalleryItems = mediaItem.children.map((carouselItem: any, carouselIndex: number) => {
              const imageUrl = carouselItem.type === 'video'
                ? carouselItem.thumbnailUrl || carouselItem.mediaUrl
                : carouselItem.mediaUrl;

              return {
                image: imageUrl,
                altText: carouselItem.altText || mediaItem.caption || `Instagram carousel item ${carouselIndex + 1}`,
              };
            });
          } else {
            // Convert single Instagram media item to MediaGallery format
            const imageUrl = mediaItem.type === 'video'
              ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
              : mediaItem.mediaUrl;

            mediaGalleryItems = [{
              image: imageUrl,
              altText: mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
            }];
          }

          return (
            <WixServices
              key={mediaItem.id || index}
              servicesMap={createServicesMap().addService(
                InstagramMediaItemServiceDefinition,
                InstagramMediaItemService,
                { mediaItem, index },
              )}
            >
              <MediaGallery.Root
                mediaGalleryServiceConfig={{ media: mediaGalleryItems }}
                data-testid={TestIds.instagramMediaItem}
              >
                {children as React.ReactElement}
              </MediaGallery.Root>
            </WixServices>
          );
        })}
      </>
    );
  },
);
