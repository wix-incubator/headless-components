import { useService, WixServices } from '@wix/services-manager-react';
import { createServicesMap } from '@wix/services-manager';
import {
  InstagramMediaItemService,
  InstagramMediaItemServiceDefinition,
  type InstagramMediaItemServiceConfig,
} from '../../services/instagram-media-item-service.js';
import type { InstagramMediaItem } from '../../services/instagram-feed-service.js';

export interface RootProps {
  /** Child components that will have access to the Instagram media item service */
  children: React.ReactNode;
  /** Instagram media item data */
  mediaItem: InstagramMediaItem;
  /** Index of this media item in the gallery */
  index: number;
}

/**
 * Instagram Media Root core component that provides media item service context.
 * This component sets up the necessary services for rendering and managing a single Instagram media item.
 *
 * @order 1
 * @component
 * @example
 * ```tsx
 * import { InstagramMedia } from '@wix/instagram/components';
 *
 * function MediaItemComponent({ mediaItem, index }) {
 *   return (
 *     <InstagramMedia.Root mediaItem={mediaItem} index={index}>
 *       <InstagramMedia.Caption>
 *         {({ caption }) => (
 *           <p className="text-sm text-gray-600">{caption}</p>
 *         )}
 *       </InstagramMedia.Caption>
 *     </InstagramMedia.Root>
 *   );
 * }
 * ```
 */
export function Root(props: RootProps): React.ReactNode {
  const { mediaItem, index, children } = props;

  const mediaItemServiceConfig: InstagramMediaItemServiceConfig = {
    mediaItem,
    index,
  };

  return (
    <WixServices
      servicesMap={createServicesMap().addService(
        InstagramMediaItemServiceDefinition,
        InstagramMediaItemService,
        mediaItemServiceConfig,
      )}
    >
      {children}
    </WixServices>
  );
}

export interface CaptionProps {
  /** Render prop function */
  children: (props: CaptionRenderProps) => React.ReactNode;
}

export interface CaptionRenderProps {
  /** Instagram media caption */
  caption: string;
  /** Whether the caption exists */
  hasCaption: boolean;
}

/**
 * Instagram Media Caption render prop component.
 * Provides access to the Instagram media caption through render props.
 *
 * @component
 */
export function Caption(props: CaptionProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = service.mediaItem.get();

  const caption = mediaItem?.caption || '';
  const hasCaption = !!caption;

  return children({
    caption,
    hasCaption,
  });
}

export interface MediaTypeProps {
  /** Render prop function */
  children: (props: MediaTypeRenderProps) => React.ReactNode;
}

export interface MediaTypeRenderProps {
  /** Type of the media item */
  type: 'image' | 'video' | 'carousel';
  /** Whether the media is an image */
  isImage: boolean;
  /** Whether the media is a video */
  isVideo: boolean;
  /** Whether the media is a carousel */
  isCarousel: boolean;
}

/**
 * Instagram Media MediaType render prop component.
 * Provides access to the Instagram media type through render props.
 *
 * @component
 */
export function MediaType(props: MediaTypeProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = service.mediaItem.get();

  const type = mediaItem?.type || 'image';
  const isImage = type === 'image';
  const isVideo = type === 'video';
  const isCarousel = type === 'carousel';

  return children({
    type,
    isImage,
    isVideo,
    isCarousel,
  });
}

export interface UserNameProps {
  /** Render prop function */
  children: (props: UserNameRenderProps) => React.ReactNode;
}

export interface UserNameRenderProps {
  /** Instagram username (typically not available at media item level) */
  username: string | null;
  /** Whether username is available */
  hasUserName: boolean;
}

/**
 * Instagram Media UserName render prop component.
 * Provides access to the Instagram username through render props.
 * Note: Username is typically not available at the individual media item level.
 *
 * @component
 */
export function UserName(props: UserNameProps): React.ReactNode {
  const { children } = props;

  // Username is not typically available at media item level
  const username = null;
  const hasUserName = false;

  return children({
    username,
    hasUserName,
  });
}

export interface TimestampProps {
  /** Render prop function */
  children: (props: TimestampRenderProps) => React.ReactNode;
}

export interface TimestampRenderProps {
  /** ISO timestamp of when the media was created */
  timestamp: string;
  /** Formatted date string */
  formattedDate: string;
  /** Whether timestamp exists */
  hasTimestamp: boolean;
}

/**
 * Instagram Media Timestamp render prop component.
 * Provides access to the Instagram media timestamp through render props.
 *
 * @component
 */
export function Timestamp(props: TimestampProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = service.mediaItem.get();

  const timestamp = mediaItem?.timestamp || '';
  const hasTimestamp = !!timestamp;

  // Format the timestamp to a readable date
  let formattedDate = '';
  if (hasTimestamp) {
    try {
      const date = new Date(timestamp);
      formattedDate = date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      });
    } catch {
      formattedDate = timestamp;
    }
  }

  return children({
    timestamp,
    formattedDate,
    hasTimestamp,
  });
}

export interface MediaUrlProps {
  /** Render prop function */
  children: (props: MediaUrlRenderProps) => React.ReactNode;
}

export interface MediaUrlRenderProps {
  /** URL to the media content */
  mediaUrl: string;
  /** Thumbnail URL for videos */
  thumbnailUrl?: string;
  /** Alt text for accessibility */
  altText: string;
  /** Whether media URL exists */
  hasMediaUrl: boolean;
  /** Whether thumbnail URL exists */
  hasThumbnailUrl: boolean;
}

/**
 * Instagram Media MediaUrl render prop component.
 * Provides access to the Instagram media URLs through render props.
 *
 * @component
 */
export function MediaUrl(props: MediaUrlProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = service.mediaItem.get();

  const mediaUrl = mediaItem?.mediaUrl || '';
  const thumbnailUrl = mediaItem?.thumbnailUrl;
  const altText = mediaItem?.altText || mediaItem?.caption || 'Instagram media';
  const hasMediaUrl = !!mediaUrl;
  const hasThumbnailUrl = !!thumbnailUrl;

  return children({
    mediaUrl,
    thumbnailUrl,
    altText,
    hasMediaUrl,
    hasThumbnailUrl,
  });
}

export interface PermalinkProps {
  /** Render prop function */
  children: (props: PermalinkRenderProps) => React.ReactNode;
}

export interface PermalinkRenderProps {
  /** Permalink to the Instagram post */
  permalink: string;
  /** Whether permalink exists */
  hasPermalink: boolean;
}

/**
 * Instagram Media Permalink render prop component.
 * Provides access to the Instagram post permalink through render props.
 *
 * @component
 */
export function Permalink(props: PermalinkProps): React.ReactNode {
  const { children } = props;
  const service = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = service.mediaItem.get();

  const permalink = mediaItem?.permalink || '';
  const hasPermalink = !!permalink;

  return children({
    permalink,
    hasPermalink,
  });
}
