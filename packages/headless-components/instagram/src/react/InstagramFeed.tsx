// Instagram Feed compound component exports following 3-level List, Options, Repeater pattern
// This file creates the Instagram namespace with all components

export { Root } from './InstagramFeedRoot.js';
export { Title } from './Title.js';
export { UserName } from './UserName.js';
export { Hashtag } from './Hashtag.js';

// 3-Level List Pattern: Container → List Container → Repeater
export { InstagramMedias } from './InstagramMedias.js';
export { InstagramMediaItems } from './InstagramMediaItems.js';
export { InstagramMediaRepeater } from './InstagramMediaRepeater.js';

// Export component prop types
export type { RootProps } from './InstagramFeedRoot.js';
export type { TitleProps } from './Title.js';
export type { UserNameProps } from './UserName.js';
export type { HashtagProps } from './Hashtag.js';
export type { InstagramMediasProps } from './InstagramMedias.js';
export type { InstagramMediaItemsProps } from './InstagramMediaItems.js';
export type { InstagramMediaRepeaterProps } from './InstagramMediaRepeater.js';

// Export context hooks
export { useInstagramMediasContext } from './InstagramMedias.js';
