import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * This component will be removed in a future release.
 */
export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * @deprecated Use `InstagramFeed.InstagramMedias` with `InstagramFeed.InstagramMediaRepeater` directly.
 * List container previously used to gate empty state. Prefer handling empty state on InstagramMedias.
 */
export const InstagramMediaItems = React.forwardRef<HTMLDivElement, InstagramMediaItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const feed = useService(InstagramFeedServiceDefinition);
    const items = feed.feedData.get().mediaItems;

    if (!items || items.length === 0) return (emptyState ?? null);

    return (
      <div ref={ref}>
        {children}
      </div>
    );
  },
);


