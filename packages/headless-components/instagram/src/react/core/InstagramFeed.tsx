import React from 'react';
import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramFeedService,
  InstagramFeedServiceDefinition,
  type InstagramFeedServiceConfig,
} from '../../services/index.js';

export interface RootProps {
  children: React.ReactNode;
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  className?: string;
}

/**
 * Root component that provides Instagram feed service context using WixServices.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramFeed, InstagramMedia } from '@wix/headless-instagram/react';
 * import { MediaGallery } from '@wix/headless-media/react';
 *
 * // New pattern with InstagramMedia components
 * function InstagramWidgetWithMedia() {
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
 *       <InstagramFeed.InstagramMedias>
 *         <InstagramFeed.InstagramMediaRepeater>
 *           <InstagramMedia.Caption />
 *           <InstagramMedia.MediaType />
 *           <InstagramMedia.UserName />
 *           <InstagramMedia.Timestamp />
 *           <InstagramMedia.MediaGalleries>
 *             <InstagramMedia.MediaGalleryRepeater>
 *               <MediaGallery.Root />
 *             </InstagramMedia.MediaGalleryRepeater>
 *           </InstagramMedia.MediaGalleries>
 *         </InstagramFeed.InstagramMediaRepeater>
 *       </InstagramFeed.InstagramMedias>
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

/**
 * Render prop component for feed username data
 */
export function UserName(props: {
  children: (data: {
    username: string;
    displayName?: string;
  }) => React.ReactNode;
}) {
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();

  const username = feedData?.account?.instagramInfo?.instagramUsername || '';
  const displayName = feedData?.account?.instagramInfo?.instagramUsername; // Use username as display name for now

  return props.children({ username, displayName });
}

/**
 * Render prop component for feed hashtag data
 */
export function Hashtag(props: {
  children: (data: { hashtag: string }) => React.ReactNode;
}) {
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();

  // Use username as hashtag for now (can be customized based on service data structure)
  const hashtag = feedData?.account?.instagramInfo?.instagramUsername || '';

  return props.children({ hashtag });
}
