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

    // Convert Instagram media items to MediaGallery format
    const convertedMediaItems = feedData.mediaItems.map((mediaItem: any) => {
      let mediaGalleryItems: any[] = [];

      if (mediaItem.type === 'carousel' && mediaItem.children && mediaItem.children.length > 0) {
        // Convert all carousel children to MediaGallery format
        mediaGalleryItems = mediaItem.children.map((carouselItem: any, carouselIndex: number) => {
          const imageUrl = carouselItem.type === 'video'
            ? carouselItem.thumbnailUrl || carouselItem.mediaUrl
            : carouselItem.mediaUrl;

          return {
            image: imageUrl,
            altText: carouselItem.altText || mediaItem.caption || `Instagram carousel item ${carouselIndex + 1}`,
          };
        });
      } else {
        // Convert single Instagram media item to MediaGallery format
        const imageUrl = mediaItem.type === 'video'
          ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
          : mediaItem.mediaUrl;

        mediaGalleryItems = [{
          image: imageUrl,
          altText: mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
        }];
      }

      return {// Keep original Instagram data
        ...mediaItem,
        mediaGalleryItems, // Add converted MediaGallery data
      };
    });
  return props.children({
    hasItems,
    mediaItems: convertedMediaItems,
  });
}
