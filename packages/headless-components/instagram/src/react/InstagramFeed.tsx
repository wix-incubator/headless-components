// Re-export individual components
export { Root, type RootProps } from './InstagramFeedRoot.js';
export { Title, type TitleProps } from './InstagramFeedTitle.js';
export { UserName, type UserNameProps } from './InstagramFeedUserName.js';
export { Hashtag, type HashtagProps } from './InstagramFeedHashtag.js';
export {
  InstagramMedias,
  type InstagramMediasProps,
} from './InstagramMedias.js';
// InstagramMediaItems component inline
import React from 'react';
import { useService } from '@wix/services-manager-react';
import { MediaGallery as MediaGalleryComponent } from '@wix/headless-media/react';
import { InstagramFeedServiceDefinition } from '../services/index.js';

export interface InstagramMediaItemsProps {
  children: React.ReactNode;
  emptyState?: React.ReactNode;
}

export const InstagramMediaItems = React.forwardRef<
  HTMLDivElement,
  InstagramMediaItemsProps
>((props, ref) => {
  const { children, emptyState, ...otherProps } = props;
  const feedService = useService(InstagramFeedServiceDefinition);
  const feedData = feedService.feedData.get();
  const hasMediaItems = (feedData?.mediaItems || []).length > 0;

  return (
    <div
      {...otherProps}
      ref={ref}
      data-testid="instagram-feed-instagram-media-items"
    >
      {hasMediaItems ? children : emptyState}
    </div>
  );
});
export {
  InstagramMediaRepeater,
  type InstagramMediaRepeaterProps,
} from './InstagramMediaRepeater.js';

/**
 * Props for InstagramFeed MediaGallery wrapper component
 */
export interface MediaGalleryProps {
  children: React.ReactNode;
}

/**
 * MediaGallery wrapper for Instagram post-level navigation.
 * Handles MediaGallery.Root internally, consumer only provides MediaGallery UI components.
 * Follows the same pattern as Product.MediaGallery in stores headless.
 *
 * @component
 * @example
 * ```tsx
 * <InstagramFeed.MediaGallery>
 *   <MediaGallery.Viewport />
 *   <MediaGallery.Previous />
 *   <MediaGallery.Next />
 *   <MediaGallery.Thumbnails>
 *     <MediaGallery.ThumbnailRepeater>
 *       <MediaGallery.ThumbnailItem />
 *     </MediaGallery.ThumbnailRepeater>
 *   </MediaGallery.Thumbnails>
 * </InstagramFeed.MediaGallery>
 * ```
 */
export const MediaGallery = React.forwardRef<HTMLDivElement, MediaGalleryProps>(
  (props, ref) => {
    const { children, ...otherProps } = props;
    const feedService = useService(InstagramFeedServiceDefinition);
    const feedData = feedService.feedData.get();

    const mediaItems = feedData?.mediaItems || [];
    if (mediaItems.length === 0) return null;

    // Transform Instagram posts for post-level navigation
    const postsMediaGalleryConfig = {
      media: mediaItems.map((post: any, index: number) => ({
        image:
          post.type === 'video'
            ? post.thumbnailUrl || post.mediaUrl
            : post.mediaUrl,
        altText: `Post ${index + 1}: ${post.caption}`,
      })),
    };

    return (
      <div {...otherProps} ref={ref} data-testid="instagram-feed-gallery">
        <MediaGalleryComponent.Root
          mediaGalleryServiceConfig={postsMediaGalleryConfig}
        >
          {children}
        </MediaGalleryComponent.Root>
      </div>
    );
  },
);

MediaGallery.displayName = 'InstagramFeed.MediaGallery';
