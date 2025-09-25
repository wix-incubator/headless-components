export { Root, type RootProps } from './Root.js';

// New core components
export {
  UserName as CoreUserName,
  type UserNameProps as CoreUserNameProps,
  type UserNameRenderProps,
} from './UserName.js';

export {
  InstagramMedias,
  type InstagramMediasProps,
  type InstagramMediasRenderProps,
} from './InstagramMedias.js';

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
