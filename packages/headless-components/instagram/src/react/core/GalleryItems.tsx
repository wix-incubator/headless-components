import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export interface GalleryItemsProps {
  /** Render prop function that receives gallery items data */
  children: (props: GalleryItemsRenderProps) => React.ReactNode;
}

/**
 * Render props for GalleryItems component
 */
export interface GalleryItemsRenderProps {
  /** Whether there are media items to display */
  hasItems: boolean;
  /** Array of media items */
  mediaItems: any[];
}

/**
 * Headless component for Instagram gallery items
 * Handles service logic and provides render props with gallery items data
 */
export function GalleryItems(props: GalleryItemsProps) {
  const instagramFeedService = useService(InstagramFeedServiceDefinition);
  const feedData = instagramFeedService.feedData.get();

  const hasItems = feedData.mediaItems.length > 0;

  return props.children({
    hasItems,
    mediaItems: feedData.mediaItems,
  });
}
