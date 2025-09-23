import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { MediaGallery } from '@wix/headless-media/react';
import * as CoreInstagramMedia from './core/InstagramMedia.js';

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
 * @example
 * ```tsx
 * // Used internally by InstagramMediaRepeater
 * <InstagramMedia.Root>
 *   <InstagramMedia.Caption />
 *   <InstagramMedia.MediaType />
 *   <InstagramMedia.MediaGalleries>
 *     <InstagramMedia.MediaGalleryRepeater>
 *       <MediaGallery.Viewport />
 *     </InstagramMedia.MediaGalleryRepeater>
 *   </InstagramMedia.MediaGalleries>
 * </InstagramMedia.Root>
 * ```
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
  instagramMediaGalleries = 'instagram-media-galleries',
  instagramMediaGalleryRepeater = 'instagram-media-gallery-repeater',
}

/**
 * Props for InstagramMedia Caption component
 */
export interface CaptionProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ caption: string | null }>;
  className?: string;
}

/**
 * Displays the Instagram media caption
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.Caption />
 *
 * // AsChild pattern for custom element
 * <InstagramMedia.Caption asChild>
 *   {({ caption }) => (
 *     <p className="media-caption">{caption || 'No caption'}</p>
 *   )}
 * </InstagramMedia.Caption>
 * ```
 */
export const Caption = React.forwardRef<HTMLDivElement, CaptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const caption = mediaItem.caption || null;
    const data = { caption };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={data}
        content={caption || ''}
        data-testid={TestIds.instagramMediaCaption}
        {...otherProps}
      >
        <div>{caption || ''}</div>
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
  children?: AsChildChildren<{ mediaType: string }>;
  className?: string;
}

/**
 * Displays the Instagram media type (image or video)
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaType />
 *
 * // AsChild pattern for custom element
 * <InstagramMedia.MediaType asChild>
 *   {({ mediaType }) => (
 *     <span className={`media-type ${mediaType}`}>
 *       {mediaType.toUpperCase()}
 *     </span>
 *   )}
 * </InstagramMedia.MediaType>
 * ```
 */
export const MediaType = React.forwardRef<HTMLSpanElement, MediaTypeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const mediaType = mediaItem.type || 'image';
    const data = { mediaType };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={data}
        content={mediaType}
        data-testid={TestIds.instagramMediaType}
        data-type={mediaType}
        {...otherProps}
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
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.UserName />
 *
 * // AsChild pattern for custom element
 * <InstagramMedia.UserName asChild>
 *   {({ userName }) => (
 *     <a href={`https://instagram.com/${userName}`} className="username-link">
 *       @{userName}
 *     </a>
 *   )}
 * </InstagramMedia.UserName>
 * ```
 */
export const UserName = React.forwardRef<HTMLSpanElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const userName = mediaItem.userName || null;
    const data = { userName };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={data}
        content={userName || ''}
        data-testid={TestIds.instagramMediaUserName}
        {...otherProps}
      >
        <span>{userName || ''}</span>
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
  children?: AsChildChildren<{ timestamp: string; formattedDate: string }>;
  className?: string;
}

/**
 * Displays the Instagram media timestamp
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.Timestamp />
 *
 * // AsChild pattern for custom element
 * <InstagramMedia.Timestamp asChild>
 *   {({ timestamp, formattedDate }) => (
 *     <time dateTime={timestamp} className="timestamp">
 *       {formattedDate}
 *     </time>
 *   )}
 * </InstagramMedia.Timestamp>
 * ```
 */
export const Timestamp = React.forwardRef<HTMLTimeElement, TimestampProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

    const timestamp = mediaItem.timestamp || new Date().toISOString();
    const formattedDate = new Date(timestamp).toLocaleDateString();
    const data = { timestamp, formattedDate };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        customElement={children}
        customElementProps={data}
        content={formattedDate}
        data-testid={TestIds.instagramMediaTimestamp}
        {...otherProps}
      >
        <time dateTime={timestamp}>{formattedDate}</time>
      </AsChildSlot>
    );
  },
);

/**
 * Props for InstagramMedia MediaGalleries component
 */
export interface MediaGalleriesProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    hasGalleryItems: boolean;
    galleryItems: Array<{ image: string; altText: string }>;
  }>;
  className?: string;
  /** Content to show when there are no gallery items */
  emptyState?: React.ReactNode;
}

/**
 * Container for Instagram media galleries, implementing the Container Level
 * of the 3-level pattern. Only renders if there are valid gallery items.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaGalleries>
 *   <InstagramMedia.MediaGalleryRepeater>
 *     <MediaGallery.Viewport />
 *   </InstagramMedia.MediaGalleryRepeater>
 * </InstagramMedia.MediaGalleries>
 *
 * // With empty state
 * <InstagramMedia.MediaGalleries emptyState={<div>No media</div>}>
 *   <InstagramMedia.MediaGalleryRepeater>
 *     <MediaGallery.Viewport />
 *   </InstagramMedia.MediaGalleryRepeater>
 * </InstagramMedia.MediaGalleries>
 *
 * // AsChild pattern for custom container
 * <InstagramMedia.MediaGalleries asChild>
 *   {({ hasGalleryItems, galleryItems, ...props }) => (
 *     <div {...props} className="media-gallery-container">
 *       {hasGalleryItems && (
 *         <span className="gallery-count">
 *           {galleryItems.length} items
 *         </span>
 *       )}
 *     </div>
 *   )}
 * </InstagramMedia.MediaGalleries>
 * ```
 */
export const MediaGalleries = React.forwardRef<
  HTMLDivElement,
  MediaGalleriesProps
>((props, ref) => {
  const { asChild, children, className, emptyState, ...otherProps } = props;
  const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

  // Convert Instagram media item to MediaGallery format using core logic
  const galleryItems =
    CoreInstagramMedia.transformToMediaGalleryFormat(mediaItem);
  const hasGalleryItems = CoreInstagramMedia.hasValidGalleryItems(galleryItems);

  // Don't render if no gallery items and using default rendering
  if (!hasGalleryItems && !asChild) {
    return emptyState || null;
  }

  const data = { hasGalleryItems, galleryItems };

  return (
    <AsChildSlot
      ref={ref}
      asChild={asChild}
      className={className}
      customElement={children}
      customElementProps={data}
      content={null}
      data-testid={TestIds.instagramMediaGalleries}
      {...otherProps}
    >
      <div>
        {hasGalleryItems
          ? typeof children === 'function' ||
            (typeof children === 'object' &&
              children !== null &&
              !React.isValidElement(children))
            ? null
            : children
          : emptyState}
      </div>
    </AsChildSlot>
  );
});

/**
 * Props for InstagramMedia MediaGalleryRepeater component
 */
export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component for Instagram media galleries, implementing the Repeater Level
 * of the 3-level pattern. Uses MediaGallery.Root from @wix/headless-media/react.
 *
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaGalleryRepeater>
 *   <MediaGallery.Viewport />
 * </InstagramMedia.MediaGalleryRepeater>
 *
 * // With custom MediaGallery components
 * <InstagramMedia.MediaGalleryRepeater>
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Thumbnails>
 *     <MediaGallery.ThumbnailRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </MediaGallery.ThumbnailRepeater>
 *   </MediaGallery.Thumbnails>
 * </InstagramMedia.MediaGalleryRepeater>
 * ```
 */
export const MediaGalleryRepeater = React.forwardRef<
  HTMLElement,
  MediaGalleryRepeaterProps
>((props, _ref) => {
  const { children } = props;
  const mediaItem = CoreInstagramMedia.useInstagramMediaItem();

  // Convert Instagram media item to MediaGallery format using core logic
  const galleryItems =
    CoreInstagramMedia.transformToMediaGalleryFormat(mediaItem);
  const hasGalleryItems = CoreInstagramMedia.hasValidGalleryItems(galleryItems);

  if (!hasGalleryItems) return null;

  return (
    <MediaGallery.Root
      mediaGalleryServiceConfig={{
        media: galleryItems,
      }}
    >
      <div data-testid={TestIds.instagramMediaGalleryRepeater}>{children}</div>
    </MediaGallery.Root>
  );
});
