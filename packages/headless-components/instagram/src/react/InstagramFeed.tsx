// Instagram Feed compound component exports
// This file provides individual exports while maintaining the compound component pattern

// Export all components individually for direct access and namespace construction
export { Root } from './InstagramFeedRoot.js';
export { Header } from './Header.js';
export { Title } from './Title.js';
export { UserName } from './UserName.js';
export { Hashtag } from './Hashtag.js';
export { Gallery } from './Gallery.js';
export { GalleryItems } from './GalleryItems.js';
export { GalleryRepeater } from './GalleryRepeater.js';
export { GalleryItem } from './GalleryItem.js';
export { Media } from './Media.js';

// Export contexts and hooks
export {
  useInstagramFeedContext,
  useGalleryContext,
  useGalleryItemContext,
} from './contexts.js';

// Export types
export type { AsChildChildren } from './types.js';

// Re-export service types
export type {
  InstagramFeedServiceConfig,
  InstagramFeedData,
  InstagramMediaItem,
  InstagramMediaType,
} from '../services/index.js';

// Export component prop types
export type { RootProps } from './InstagramFeedRoot.js';
export type { HeaderProps } from './Header.js';
export type { TitleProps } from './Title.js';
export type { UserNameProps } from './UserName.js';
export type { HashtagProps } from './Hashtag.js';
export type { GalleryProps } from './Gallery.js';
export type { GalleryItemsProps } from './GalleryItems.js';
export type { GalleryRepeaterProps } from './GalleryRepeater.js';
export type { GalleryItemProps } from './GalleryItem.js';
export type { MediaProps } from './Media.js';
