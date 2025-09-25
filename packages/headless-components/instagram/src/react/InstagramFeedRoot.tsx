import React from 'react';
import * as CoreInstagramFeed from './core/InstagramFeed.js';
import { AsChildSlot } from '@wix/headless-utils/react';
import type { InstagramFeedServiceConfig } from '../services/index.js';

enum TestIds {
  instagramFeedRoot = 'instagram-feed-root',
}

/**
 * Props for InstagramFeed Root component
 */
export interface RootProps {
  children: React.ReactNode;
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  /** Whether to render as a child component */
  asChild?: boolean;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Root component that provides Instagram feed service context.
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
 *       <InstagramFeed.InstagramMedias>
 *         <InstagramFeed.InstagramMediaItems>
 *           <InstagramFeed.InstagramMediaRepeater>
 *             <MediaGallery.Root mediaGalleryServiceConfig={{ media: [] }} />
 *           </InstagramFeed.InstagramMediaRepeater>
 *         </InstagramFeed.InstagramMediaItems>
 *       </InstagramFeed.InstagramMedias>
 *     </InstagramFeed.Root>
 *   );
 * }
 * ```
 */
export const Root = React.forwardRef<HTMLElement, RootProps>((props, ref) => {
  const { children, instagramFeedServiceConfig, asChild, className, ...otherProps } = props;

  const attributes = {
    className,
    'data-testid': TestIds.instagramFeedRoot,
    ...otherProps,
  };

  return (
    <CoreInstagramFeed.Root instagramFeedServiceConfig={instagramFeedServiceConfig}>
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        {...attributes}
      >
        <div>{children}</div>
      </AsChildSlot>
    </CoreInstagramFeed.Root>
  );
});
