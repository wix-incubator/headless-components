import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export interface InstagramMediasProps {
  /** Render prop function that receives Instagram medias data */
  children: (props: InstagramMediasRenderProps) => React.ReactNode;
}

/**
 * Render props for InstagramMedias component
 */
export interface InstagramMediasRenderProps {
  /** Whether there are media items to display */
  hasItems: boolean;
  /** Array of media items */
  mediaItems: any[];
}

/**
 * Headless component for Instagram medias
 * Handles service logic and provides render props with media items data
 */
export function InstagramMedias(props: InstagramMediasProps) {
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hasItems = feedData.mediaItems.length > 0;

  return props.children({
    hasItems,
    mediaItems: feedData.mediaItems,
  });
}
