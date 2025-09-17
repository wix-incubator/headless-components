import React from 'react';
import { type InstagramFeedServiceConfig } from '../services/index.js';
import {
  InstagramFeedContext,
  type InstagramFeedContextValue,
} from './contexts.js';
import { TestIds } from './types.js';

/**
 * Props for InstagramFeed Root component
 */
export interface RootProps {
  children: React.ReactNode;
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  className?: string;
}

/**
 * Root component that provides Instagram feed service context.
 * This is the main container that initializes the Instagram feed service.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramFeed } from '@wix/instagram/components';
 *
 * function InstagramWidget() {
 *   return (
 *     <InstagramFeed.Root
 *       instagramFeedServiceConfig={{
 *         username: 'myaccount',
 *         limit: 6
 *       }}
 *     >
 *       <div>
 *         <InstagramFeed.Title />
 *         <InstagramFeed.UserName />
 *       </div>
 *       <InstagramFeed.Gallery>
 *         <InstagramFeed.GalleryItems>
 *           <InstagramFeed.GalleryRepeater>
 *             <InstagramFeed.GalleryItem>
 *               <InstagramFeed.Media />
 *             </InstagramFeed.GalleryItem>
 *           </InstagramFeed.GalleryRepeater>
 *         </InstagramFeed.GalleryItems>
 *       </InstagramFeed.Gallery>
 *     </InstagramFeed.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, instagramFeedServiceConfig, className, ...attrs } = props;

  // TODO: Integrate with actual service when service manager is available
  // For now, simulate the service state with mock data
  const [serviceState] = React.useState({
    feedData: instagramFeedServiceConfig.feedData || {
      account: {
        _id: instagramFeedServiceConfig.accountId || 'sample_account',
        instagramInfo: {
          instagramId: instagramFeedServiceConfig.accountId || 'sample_id',
          instagramUsername:
            instagramFeedServiceConfig.accountId?.replace('instagram_', '') ||
            'sample_user',
        },
      },
      mediaItems: [],
      hasMore: false,
    },
    isLoading: false,
    error: undefined,
    loadMore: async () => {},
    refresh: async () => {},
  });

  const contextValue: InstagramFeedContextValue = serviceState;

  const attributes = {
    'data-testid': TestIds.instagramFeedRoot,
    className,
    ...attrs,
  };

  return (
    <InstagramFeedContext.Provider value={contextValue}>
      <div {...attributes}>{children}</div>
    </InstagramFeedContext.Provider>
  );
}
