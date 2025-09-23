// InstagramMedia entity component exports
// This file creates the InstagramMedia namespace with all entity components

export {
  Root,
  Caption,
  MediaType,
  UserName,
  Timestamp,
  MediaGalleries,
  MediaGalleryItems,
  MediaGalleryRepeater,
} from './InstagramMedia.js';

// Export component prop types
export type {
  InstagramMediaRootProps,
  CaptionProps,
  MediaTypeProps,
  UserNameProps,
  TimestampProps,
  MediaGalleriesProps,
  MediaGalleryItemsProps,
  MediaGalleryRepeaterProps,
} from './InstagramMedia.js';

// Export context hooks
export { useMediaGalleriesContext } from './InstagramMedia.js';
