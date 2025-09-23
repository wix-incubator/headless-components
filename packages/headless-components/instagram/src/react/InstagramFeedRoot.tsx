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
  /** Configuration for the Instagram feed service */
  instagramFeedServiceConfig: InstagramFeedServiceConfig;
  className?: string;
}

/**
 * Root component that provides the Instagram feed service context to its children.
 * This component provides the foundation for all Instagram feed functionality
 * and must wrap all other Instagram feed components.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramFeed } from '@wix/headless-instagram/react';
 *
 * function MyInstagramFeed() {
 *   return (
 *     <InstagramFeed.Root
 *       instagramFeedServiceConfig={{ accountId: 'my_account', limit: 6 }}
 *     >
 *       <InstagramFeed.Title />
 *       <InstagramFeed.UserName />
 *       <InstagramFeed.InstagramMedias>
 *         <InstagramFeed.InstagramMediaRepeater>
 *           <InstagramMedia.Caption />
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
