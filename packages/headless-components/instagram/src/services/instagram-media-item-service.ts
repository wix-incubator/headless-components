import { defineService, implementService } from '@wix/services-definitions';
import {
  SignalsServiceDefinition,
  type Signal,
} from '@wix/services-definitions/core-services/signals';
import type { InstagramMediaItem } from './instagram-feed-service.js';

/**
 * API interface for Instagram Media Item service
 */
export interface InstagramMediaItemServiceAPI {
  /** Reactive signal containing the media item data */
  mediaItem: Signal<InstagramMediaItem>;
  /** Reactive signal containing the media item index */
  index: Signal<number>;
}

/**
 * Configuration for Instagram Media Item service
 */
export interface InstagramMediaItemServiceConfig {
  /** The Instagram media item data */
  mediaItem: InstagramMediaItem;
  /** The index of this media item in the gallery */
  index: number;
}

/**
 * Service definition for Instagram Media Item
 */
export const InstagramMediaItemServiceDefinition =
  defineService<InstagramMediaItemServiceAPI>('instagramMediaItem');

/**
 * Implementation of the Instagram Media Item service that manages reactive media item data.
 * This service provides signals for individual media item data and its index position.
 * Used by gallery components to access media item information in a service-based architecture.
 *
 * @example
 * ```tsx
 * import { InstagramMediaItemService, InstagramMediaItemServiceDefinition } from '@wix/headless-instagram/services';
 * import { useService } from '@wix/services-manager-react';
 * import { WixServices, createServicesMap } from '@wix/services-manager';
 *
 * function MediaItemComponent({ mediaItem, index }) {
 *   return (
 *     <WixServices
 *       servicesMap={createServicesMap().addService(
 *         InstagramMediaItemServiceDefinition,
 *         InstagramMediaItemService,
 *         { mediaItem, index }
 *       )}
 *     >
 *       <MediaItemDisplay />
 *     </WixServices>
 *   );
 * }
 *
 * function MediaItemDisplay() {
 *   const mediaItemService = useService(InstagramMediaItemServiceDefinition);
 *   const mediaItem = mediaItemService.mediaItem.get();
 *   const index = mediaItemService.index.get();
 *
 *   return (
 *     <div>
 *       <img src={mediaItem.mediaUrl} alt={mediaItem.altText} />
 *       <span>Item {index + 1}</span>
 *       {mediaItem.type === 'video' && <VideoIndicator />}
 *     </div>
 *   );
 * }
 * ```
 */
export const InstagramMediaItemService =
  implementService.withConfig<InstagramMediaItemServiceConfig>()(
    InstagramMediaItemServiceDefinition,
    ({ getService, config }) => {
      const signalsService = getService(SignalsServiceDefinition);

      const mediaItem: Signal<InstagramMediaItem> = signalsService.signal(
        config.mediaItem as any,
      );
      const index: Signal<number> = signalsService.signal(config.index as any);

      return {
        mediaItem,
        index,
      };
    },
  );
