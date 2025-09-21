import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface InstagramMediasProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for Instagram media items list.
 * Renders nothing (or emptyState) when there are no media items.
 */
export const InstagramMedias = React.forwardRef<HTMLDivElement, InstagramMediasProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const instagramFeedService = useService(InstagramFeedServiceDefinition);
    const feedData = instagramFeedService.feedData.get();

    const hasItems = feedData.mediaItems.length > 0;

    if (!hasItems) {
      return emptyState || null;
    }

    return (
      <div ref={ref}>
        {children}
      </div>
    );
  },
);

