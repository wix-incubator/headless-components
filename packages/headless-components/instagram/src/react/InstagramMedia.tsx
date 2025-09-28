import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { MediaGallery as MediaGalleryComponent } from '@wix/headless-media/react';
import * as CoreInstagramMedia from './core/InstagramMedia.js';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';

// Import MediaGallery wrapper components
export {
  MediaGalleries,
  type MediaGalleriesProps,
} from './InstagramMediaMediaGalleries.js';
export {
  MediaGalleryRepeater,
  type MediaGalleryRepeaterProps,
} from './InstagramMediaMediaGalleryRepeater.js';

/**
 * Props for InstagramMedia MediaGallery wrapper component
 */
export interface MediaGalleryProps {
  children: React.ReactNode;
}

/**
 * MediaGallery wrapper for Instagram media carousel navigation.
 * Handles MediaGallery.Root internally, consumer only provides MediaGallery UI components.
 * Follows the same pattern as Product.MediaGallery in stores headless.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramMedia.MediaGallery>
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Previous />
 *   <MediaGallery.Next />
 *   <MediaGallery.Thumbnails>
 *     <MediaGallery.ThumbnailRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </MediaGallery.ThumbnailRepeater>
 *   </MediaGallery.Thumbnails>
 * </InstagramMedia.MediaGallery>
 * ```
 */
export const MediaGallery = React.forwardRef<HTMLDivElement, MediaGalleryProps>(
  (props, ref) => {
    const { children, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

    if (!mediaItem) return null;

    // Transform Instagram data to MediaGallery format automatically
    const mediaGalleryConfig =
      CoreInstagramMedia.transformToMediaGalleryFormat(mediaItem);

    return (
      <div {...otherProps} ref={ref} data-testid="instagram-media-gallery">
        <MediaGalleryComponent.Root
          mediaGalleryServiceConfig={mediaGalleryConfig}
        >
          {children}
        </MediaGalleryComponent.Root>
      </div>
    );
  },
);

MediaGallery.displayName = 'InstagramMedia.MediaGallery';

/**
 * Props for InstagramMedia Root component
 */
export interface RootProps {
  children: React.ReactNode;
  className?: string;
}

/**
 * Root component for individual Instagram media items.
 * This component provides the foundation for rendering a single media item
 * and integrates with the MediaGallery service.
 *
 * @order 1
 * @component
 */
export function Root(props: RootProps): React.ReactNode {
  const { children, className, ...attrs } = props;

  const attributes = {
    className,
    ...attrs,
  };

  return <div {...attributes}>{children}</div>;
}

// TestIds enum for data-testid attributes
enum TestIds {
  instagramMediaCaption = 'instagram-media-caption',
  instagramMediaType = 'instagram-media-type',
  instagramMediaUserName = 'instagram-media-username',
  instagramMediaTimestamp = 'instagram-media-timestamp',
}

/**
 * Props for InstagramMedia Caption component
 */
export interface CaptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ caption?: string }>;
  className?: string;
}

/**
 * Displays the Instagram media caption
 *
 * @component
 */
export const Caption = React.forwardRef<HTMLDivElement, CaptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const caption = mediaItem?.caption || '';
    const data = { caption };

    const attributes = {
      'data-testid': TestIds.instagramMediaCaption,
      className,
      ...otherProps,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={data}
        content={caption}
        {...attributes}
      >
        <div>{caption}</div>
      </AsChildSlot>
    );
  },
);

/**
 * Props for InstagramMedia MediaType component
 */
export interface MediaTypeProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ mediaType?: string }>;
  className?: string;
}

/**
 * Displays the Instagram media type
 *
 * @component
 */
export const MediaType = React.forwardRef<HTMLSpanElement, MediaTypeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const mediaType = mediaItem?.type || 'image';
    const data = { mediaType };

    const attributes = {
      'data-testid': TestIds.instagramMediaType,
      className,
      ...otherProps,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={data}
        content={mediaType}
        {...attributes}
      >
        <span>{mediaType}</span>
      </AsChildSlot>
    );
  },
);

/**
 * Props for InstagramMedia UserName component
 */
export interface UserNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ userName?: string }>;
  className?: string;
}

/**
 * Displays the Instagram media user name
 *
 * @component
 */
export const UserName = React.forwardRef<HTMLSpanElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const userName = mediaItem?.userName || '';
    const data = { userName };

    const attributes = {
      'data-testid': TestIds.instagramMediaUserName,
      className,
      ...otherProps,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={data}
        content={userName}
        {...attributes}
      >
        <span>{userName}</span>
      </AsChildSlot>
    );
  },
);

/**
 * Props for InstagramMedia Timestamp component
 */
export interface TimestampProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ timestamp?: string; formattedDate?: string }>;
  className?: string;
}

/**
 * Displays the Instagram media timestamp
 *
 * @component
 */
export const Timestamp = React.forwardRef<HTMLTimeElement, TimestampProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const timestamp = mediaItem?.timestamp || '';
    const formattedDate = timestamp
      ? new Date(timestamp).toLocaleDateString()
      : '';
    const data = { timestamp, formattedDate };

    const attributes = {
      'data-testid': TestIds.instagramMediaTimestamp,
      className,
      ...otherProps,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        customElement={children}
        customElementProps={data}
        content={formattedDate}
        {...attributes}
      >
        <time dateTime={timestamp}>{formattedDate}</time>
      </AsChildSlot>
    );
  },
);

// Note: No useMediaGalleryConfig hook needed
// Consumer handles integration with MediaGallery or any other components
// Instagram components only provide Instagram data
