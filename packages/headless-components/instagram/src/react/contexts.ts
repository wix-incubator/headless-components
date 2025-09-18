import React from 'react';
import {
  type InstagramFeedData,
  type InstagramMediaItem,
} from '../services/index.js';

/**
 * Context for sharing Instagram feed state between components
 */
export interface InstagramFeedContextValue {
  feedData: InstagramFeedData;
  isLoading: boolean;
  error?: string;
  loadMore: () => Promise<void>;
  refresh: () => Promise<void>;
}

export const InstagramFeedContext =
  React.createContext<InstagramFeedContextValue | null>(null);

/**
 * Hook to access Instagram feed context
 */
export function useInstagramFeedContext(): InstagramFeedContextValue {
  const context = React.useContext(InstagramFeedContext);
  if (!context) {
    throw new Error(
      'useInstagramFeedContext must be used within an InstagramFeed.Root component',
    );
  }
  return context;
}

/**
 * Context for sharing gallery items state between components
 */
export interface GalleryContextValue {
  hasItems: boolean;
  mediaItems: InstagramMediaItem[];
}

export const GalleryContext = React.createContext<GalleryContextValue | null>(
  null,
);

/**
 * Hook to access gallery context
 */
export function useGalleryContext(): GalleryContextValue {
  const context = React.useContext(GalleryContext);
  if (!context) {
    throw new Error(
      'useGalleryContext must be used within an InstagramFeed.Gallery component',
    );
  }
  return context;
}

/**
 * Context for individual gallery items
 */
export interface GalleryItemContextValue {
  mediaItem: InstagramMediaItem;
  index: number;
}

export const GalleryItemContext =
  React.createContext<GalleryItemContextValue | null>(null);

/**
 * Hook to access gallery item context
 */
export function useGalleryItemContext(): GalleryItemContextValue {
  const context = React.useContext(GalleryItemContext);
  if (!context) {
    throw new Error(
      'useGalleryItemContext must be used within an InstagramFeed.GalleryItem component',
    );
  }
  return context;
}
