import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * List container for media items within InstagramMedias.
 * Renders emptyState when there are no items.
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


