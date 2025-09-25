export { Root, type RootProps } from './Root.js';
export { MediaGalleries, type MediaGalleriesProps, type MediaGalleriesRenderProps } from './FeedMediaGalleries.js';

// New core components
export {
  UserName as CoreUserName,
  type UserNameProps as CoreUserNameProps,
  type UserNameRenderProps
} from './UserName.js';

export {
  GalleryItems,
  type GalleryItemsProps,
  type GalleryItemsRenderProps
} from './GalleryItems.js';

export {
  Caption as InstagramMediaCaption,
  MediaType as InstagramMediaType,
  UserName as InstagramMediaUserName,
  Timestamp as InstagramMediaTimestamp,
  MediaGalleryRepeater,
  type CaptionProps as InstagramMediaCaptionProps,
  type CaptionRenderProps,
  type MediaTypeProps as InstagramMediaTypeProps,
  type MediaTypeRenderProps,
  type UserNameProps as InstagramMediaUserNameProps,
  type UserNameRenderProps as InstagramMediaUserNameRenderProps,
  type TimestampProps as InstagramMediaTimestampProps,
  type TimestampRenderProps,
  type MediaGalleryRepeaterProps,
  type MediaGalleryRepeaterRenderProps,
} from './InstagramMedia.js';


