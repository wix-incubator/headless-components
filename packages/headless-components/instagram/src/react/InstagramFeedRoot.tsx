import React from 'react';
import { WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  type InstagramFeedServiceConfig,
} from '../services/index.js';

/**
 * Props for InstagramFeed Root component
 */
export interface RootProps {
  children: React.ReactNode;
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  className?: string;
}

/**
 * Root component that provides Instagram feed service context using WixServices.
 * This follows the same service-based pattern as the stores package.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramFeed } from '@wix/headless-instagram/react';
 * import { MediaGallery } from '@wix/headless-media/react';
 *
 * function InstagramWidget() {
 *   return (
 *     <InstagramFeed.Root
 *       instagramFeedServiceConfig={{
 *         accountId: 'instagram_account_123',
 *         limit: 6
 *       }}
 *     >
 *       <div>
 *         <InstagramFeed.Title />
 *         <InstagramFeed.UserName />
 *         <InstagramFeed.Hashtag />
 *       </div>
 *       <InstagramFeed.Gallery>
 *         <InstagramFeed.GalleryItems>
 *           <InstagramFeed.GalleryItemRepeater>
 *             <MediaGallery.ThumbnailItem />
 *           </InstagramFeed.GalleryItemRepeater>
 *         </InstagramFeed.GalleryItems>
 *       </InstagramFeed.Gallery>
 *     </InstagramFeed.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, instagramFeedServiceConfig, className, ...attrs } = props;

  const attributes = {
    className,
    ...attrs,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        InstagramFeedServiceDefinition,
        InstagramFeedService,
        instagramFeedServiceConfig,
      )}
    >
      <div {...attributes}>{children}</div>
    </WixServices>
  );
}
