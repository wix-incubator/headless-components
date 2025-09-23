import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMedias = 'instagram-medias',
}

/**
 * Props for InstagramFeed InstagramMedias component (Container Level)
 */
export interface InstagramMediasProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ hasMedias: boolean; mediaItems: any[] }>;
  className?: string;
}

/**
 * Container component for Instagram media items.
 * Does not render when there are no media items.
 * This follows the Container Level pattern from the rules.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.InstagramMedias>
 *   <InstagramFeed.InstagramMediaRepeater>
 *     <InstagramMedia.Caption />
 *     <InstagramMedia.MediaType />
 *   </InstagramFeed.InstagramMediaRepeater>
 * </InstagramFeed.InstagramMedias>
 * ```
 */
export const InstagramMedias = React.forwardRef<
  HTMLDivElement,
  InstagramMediasProps
>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hasMedias = feedData.mediaItems.length > 0;

  // Don't render if no medias (following the Container Level pattern)
  if (!hasMedias) return null;

  const contextValue = {
    hasMedias,
    mediaItems: feedData.mediaItems,
  };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={contextValue}
      data-testid={TestIds.instagramMedias}
      {...otherProps}
    >
      <div>{React.isValidElement(children) ? children : null}</div>
    </AsChildSlot>
  );
});
