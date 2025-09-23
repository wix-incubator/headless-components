import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import { useService } from '@wix/services-manager-react';
import { MediaGallery } from '@wix/headless-media/react';
import * as CoreInstagramMedia from './core/InstagramMedia.js';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';

/**
 * Context for sharing media gallery state between components
 */
interface MediaGalleriesContextValue {
  hasItems: boolean;
  mediaItems: any[];
}

const MediaGalleriesContext = React.createContext<MediaGalleriesContextValue | null>(null);

/**
 * Hook to access media galleries context
 */
export function useMediaGalleriesContext(): MediaGalleriesContextValue {
  const context = React.useContext(MediaGalleriesContext);
  if (!context) {
    throw new Error(
      'useMediaGalleriesContext must be used within an InstagramMedia.MediaGalleries component',
    );
  }
  return context;
}

enum TestIds {
  instagramMediaRoot = 'instagram-media-root',
  instagramMediaCaption = 'instagram-media-caption',
  instagramMediaType = 'instagram-media-type',
  instagramMediaUserName = 'instagram-media-username',
  instagramMediaTimestamp = 'instagram-media-timestamp',
  instagramMediaGalleries = 'instagram-media-galleries',
  instagramMediaGalleryItems = 'instagram-media-gallery-items',
  instagramMediaGalleryItem = 'instagram-media-gallery-item',
}

/**
 * Props for InstagramMedia Root component
 */
export interface InstagramMediaRootProps {
  children: React.ReactNode;
  asChild?: boolean;
  className?: string;
}

/**
 * Root component for an individual Instagram media item.
 * Uses the media item service context provided by InstagramMediaRepeater.
 *
 * @component
 */
export const Root = React.forwardRef<HTMLElement, InstagramMediaRootProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    const attributes = {
      className,
      'data-testid': TestIds.instagramMediaRoot,
      ...otherProps,
    };

    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        {...attributes}
      >
        <div>{children}</div>
      </AsChildSlot>
    );
  },
);

/**
 * Props for InstagramMedia Caption component
 */
export interface CaptionProps {
  asChild?: boolean;
  children?: AsChildChildren<{ caption: string | null }>;
  className?: string;
}

/**
 * Displays the Instagram media caption.
 *
 * @component
 */
export const Caption = React.forwardRef<HTMLElement, CaptionProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInstagramMedia.Caption>
      {({ caption, hasCaption }) => {
        // Don't render if no caption
        if (!hasCaption) return null;

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaCaption}
            customElement={children}
            customElementProps={{ caption }}
            content={caption}
            {...otherProps}
          >
            <p>{caption}</p>
          </AsChildSlot>
        );
      }}
    </CoreInstagramMedia.Caption>
  );
});

/**
 * Props for InstagramMedia MediaType component
 */
export interface MediaTypeProps {
  asChild?: boolean;
  children?: AsChildChildren<{ mediaType: string }>;
  className?: string;
}

/**
 * Displays the Instagram media type (image, video, carousel).
 *
 * @component
 */
export const MediaType = React.forwardRef<HTMLElement, MediaTypeProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInstagramMedia.MediaType>
      {({ type, isImage, isVideo, isCarousel }) => (
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.instagramMediaType}
          data-type={type}
          customElement={children}
          customElementProps={{ mediaType: type, isImage, isVideo, isCarousel }}
          content={type}
          {...otherProps}
        >
          <span>{type}</span>
        </AsChildSlot>
      )}
    </CoreInstagramMedia.MediaType>
  );
});

/**
 * Props for InstagramMedia UserName component
 */
export interface UserNameProps {
  asChild?: boolean;
  children?: AsChildChildren<{ username: string | null }>;
  className?: string;
}

/**
 * Displays the Instagram media username (if available).
 * Note: Username is typically not available at the media item level.
 *
 * @component
 */
export const UserName = React.forwardRef<HTMLElement, UserNameProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInstagramMedia.UserName>
      {({ username, hasUserName }) => {
        // Don't render if no username
        if (!hasUserName) return null;

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaUserName}
            customElement={children}
            customElementProps={{ username }}
            content={username}
            {...otherProps}
          >
            <span>@{username}</span>
          </AsChildSlot>
        );
      }}
    </CoreInstagramMedia.UserName>
  );
});

/**
 * Props for InstagramMedia Timestamp component
 */
export interface TimestampProps {
  asChild?: boolean;
  children?: AsChildChildren<{ timestamp: string; formattedDate: string }>;
  className?: string;
}

/**
 * Displays the Instagram media timestamp.
 *
 * @component
 */
export const Timestamp = React.forwardRef<HTMLElement, TimestampProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;

  return (
    <CoreInstagramMedia.Timestamp>
      {({ timestamp, formattedDate, hasTimestamp }) => {
        // Don't render if no timestamp
        if (!hasTimestamp) return null;

        return (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramMediaTimestamp}
            customElement={children}
            customElementProps={{ timestamp, formattedDate }}
            content={formattedDate}
            {...otherProps}
          >
            <time dateTime={timestamp}>{formattedDate}</time>
          </AsChildSlot>
        );
      }}
    </CoreInstagramMedia.Timestamp>
  );
});

/**
 * Props for InstagramMedia MediaGalleries component (Container Level)
 */
export interface MediaGalleriesProps {
  asChild?: boolean;
  children: React.ReactNode;
  className?: string;
}

/**
 * Container for media gallery items following the 3-level pattern.
 * Does not render when there are no media items for gallery.
 * This is a nested Container Level for media galleries within an InstagramMedia.
 *
 * @component
 */
export const MediaGalleries = React.forwardRef<HTMLElement, MediaGalleriesProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

    // For carousel type, we could have multiple media items
    // For now, we'll treat each media item as a single-item gallery
    const mediaItems = mediaItem ? [mediaItem] : [];
    const hasItems = mediaItems.length > 0;

    // Don't render if no items
    if (!hasItems) return null;

    const contextValue: MediaGalleriesContextValue = {
      hasItems,
      mediaItems,
    };

    return (
      <MediaGalleriesContext.Provider value={contextValue}>
        <AsChildSlot
          ref={ref}
          asChild={asChild}
          className={className}
          data-testid={TestIds.instagramMediaGalleries}
          customElement={children}
          {...otherProps}
        >
          <div>{React.isValidElement(children) ? children : null}</div>
        </AsChildSlot>
      </MediaGalleriesContext.Provider>
    );
  },
);

/**
 * Props for InstagramMedia MediaGalleryItems component (List Container Level)
 */
export interface MediaGalleryItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

/**
 * Container for media gallery items with empty state support.
 * This follows the List Container Level pattern.
 *
 * @component
 */
export const MediaGalleryItems = React.forwardRef<HTMLDivElement, MediaGalleryItemsProps>(
  (props, ref) => {
    const { children, emptyState } = props;
    const { hasItems } = useMediaGalleriesContext();

    if (!hasItems) {
      return emptyState || null;
    }

    const attributes = {
      'data-testid': TestIds.instagramMediaGalleryItems,
    };

    return (
      <div {...attributes} ref={ref}>
        {children}
      </div>
    );
  },
);

/**
 * Props for InstagramMedia MediaGalleryRepeater component (Repeater Level)
 */
export interface MediaGalleryRepeaterProps {
  children: React.ReactNode;
}

/**
 * Repeater component that renders children for each media gallery item.
 * This follows the Repeater Level pattern and renders MediaGallery.Root for each item.
 *
 * @component
 */
export const MediaGalleryRepeater = React.forwardRef<HTMLElement, MediaGalleryRepeaterProps>(
  (props, _ref) => {
    const { children } = props;
    const { hasItems, mediaItems } = useMediaGalleriesContext();

    if (!hasItems) return null;

    return (
      <>
        {mediaItems.map((mediaItem: any, index: number) => {
          // Convert Instagram media item to MediaGallery format
          const imageUrl = mediaItem.type === 'video'
            ? mediaItem.thumbnailUrl || mediaItem.mediaUrl
            : mediaItem.mediaUrl;

          const mediaGalleryItems = [{
            image: imageUrl,
            altText: mediaItem.altText || mediaItem.caption || `Instagram ${mediaItem.type}`,
          }];


        return (
          <MediaGallery.Root
            key={mediaItem.id || index}
            mediaGalleryServiceConfig={{ media: mediaGalleryItems }}
            data-testid={TestIds.instagramMediaGalleryItem}
          >
            {children}
          </MediaGallery.Root>
        );
        })}
      </>
    );
  },
);
