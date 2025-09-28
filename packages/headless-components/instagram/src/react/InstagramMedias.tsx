import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * Props for InstagramFeed InstagramMedias component
 */
export interface InstagramMediasProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ hasMediaItems: boolean; mediaItems: any[] }>;
  /** CSS classes to apply to the default element */
  className?: string;
  /** Content to show when there are no media items */
  emptyState?: React.ReactNode;
}

/**
 * Container for Instagram media list, implementing the Container Level
 * of the 3-level pattern. Only renders if there are media items available.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramFeed.InstagramMedias>
 *   <InstagramFeed.InstagramMediaRepeater>
 *     <InstagramMedia.Caption />
 *   </InstagramFeed.InstagramMediaRepeater>
 * </InstagramFeed.InstagramMedias>
 *
 * // With empty state
 * <InstagramFeed.InstagramMedias emptyState={<div>No posts found</div>}>
 *   <InstagramFeed.InstagramMediaRepeater>
 *     <InstagramMedia.Caption />
 *   </InstagramFeed.InstagramMediaRepeater>
 * </InstagramFeed.InstagramMedias>
 *
 * // Using AsChild pattern for custom container
 * <InstagramFeed.InstagramMedias asChild>
 *   {({ hasMediaItems, mediaItems }) => (
 *     <div className="media-grid">
 *       {hasMediaItems && (
 *         <span className="media-count">
 *           {mediaItems.length} posts
 *         </span>
 *       )}
 *     </div>
 *   )}
 * </InstagramFeed.InstagramMedias>
 * ```
 */
export const InstagramMedias = React.forwardRef<
  HTMLDivElement,
  InstagramMediasProps
>((props, ref) => {
  const { asChild, children, className, emptyState, ...otherProps } = props;
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();

  const mediaItems = feedData?.mediaItems || [];
  const hasMediaItems = mediaItems.length > 0;

  // Don't render if no media items and using default rendering
  if (!hasMediaItems && !asChild) {
    return emptyState || null;
  }

  const data = { hasMediaItems, mediaItems };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={data}
      content={null}
      data-testid="instagram-medias"
      {...otherProps}
    >
      <div>
        {hasMediaItems
          ? typeof children === 'function' ||
            (typeof children === 'object' &&
              children !== null &&
              !React.isValidElement(children))
            ? null
            : children
          : emptyState}
      </div>
    </AsChildSlot>
  );
});
