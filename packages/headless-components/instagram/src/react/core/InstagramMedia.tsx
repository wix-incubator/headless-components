import React from 'react';
import { useService } from '@wix/services-manager-react';
import {
  InstagramMediaItemServiceDefinition,
  InstagramFeedServiceDefinition,
} from '../../services/index.js';
import type { MediaItem } from '@wix/headless-media/services';

export interface CaptionProps {
  /** Render prop function that receives caption data */
  children: (props: CaptionRenderProps) => React.ReactNode;
}

/**
 * Render props for Caption component
 */
export interface CaptionRenderProps {
  /** Media caption text */
  caption?: string;
}

/**
 * Headless component for Instagram media caption
 */
export function Caption(props: CaptionProps) {
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { caption } = mediaItemService.mediaItem.get();

  return props.children({
    caption,
  });
}

export interface MediaTypeProps {
  /** Render prop function that receives media type data */
  children: (props: MediaTypeRenderProps) => React.ReactNode;
}

/**
 * Render props for MediaType component
 */
export interface MediaTypeRenderProps {
  /** Type of media */
  mediaType: 'image' | 'video' | 'carousel';
  /** Raw type value */
  type: 'image' | 'video' | 'carousel';
}

/**
 * Headless component for Instagram media type
 */
export function MediaType(props: MediaTypeProps) {
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { type } = mediaItemService.mediaItem.get();

  return props.children({
    mediaType: type,
    type,
  });
}

export interface UserNameProps {
  /** Render prop function that receives username data */
  children: (props: UserNameRenderProps) => React.ReactNode;
}

/**
 * Render props for UserName component
 */
export interface UserNameRenderProps {
  /** Instagram username */
  userName?: string;
}

/**
 * Headless component for Instagram media username
 */
export function UserName(props: UserNameProps) {
  const feedService = useService(InstagramFeedServiceDefinition);
  const account = feedService.feedData.get().account as any;
  const userName = account?.instagramInfo?.instagramUsername as
    | string
    | undefined;

  return props.children({
    userName,
  });
}

export interface TimestampProps {
  /** Render prop function that receives timestamp data */
  children: (props: TimestampRenderProps) => React.ReactNode;
}

/**
 * Render props for Timestamp component
 */
export interface TimestampRenderProps {
  /** Media timestamp */
  timestamp: string;
}

/**
 * Headless component for Instagram media timestamp
 */
export function Timestamp(props: TimestampProps) {
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const { timestamp } = mediaItemService.mediaItem.get();

  return props.children({
    timestamp,
  });
}

export interface MediaGalleryRepeaterProps {
  /** Render prop function that receives media gallery repeater data */
  children: (props: MediaGalleryRepeaterRenderProps) => React.ReactNode;
}

/**
 * Render props for MediaGalleryRepeater component
 */
export interface MediaGalleryRepeaterRenderProps {
  /** Array of media items formatted for MediaGallery */
  media: MediaItem[];
  /** Whether there are media items */
  hasMedia: boolean;
}

/**
 * Headless component for Instagram media gallery repeater
 */
export function MediaGalleryRepeater(props: MediaGalleryRepeaterProps) {
  const mediaItemService = useService(InstagramMediaItemServiceDefinition);
  const mediaItem = mediaItemService.mediaItem.get();

  const media: MediaItem[] = (
    mediaItem?.type === 'video' ? mediaItem.thumbnailUrl : mediaItem?.mediaUrl
  )
    ? [
        {
          image: (mediaItem.type === 'video'
            ? mediaItem.thumbnailUrl!
            : mediaItem.mediaUrl) as string,
          altText: mediaItem.altText,
        },
      ]
    : [];

  const hasMedia = media.length > 0;

  return props.children({
    media,
    hasMedia,
  });
}
