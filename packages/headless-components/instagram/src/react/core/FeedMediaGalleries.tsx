import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramFeedServiceDefinition } from '../../services/index.js';

export interface MediaGalleriesProps {
  /** Render prop function that receives media galleries data */
  children: (props: MediaGalleriesRenderProps) => React.ReactNode;
}

/**
 * Render props for MediaGalleries component
 */
export interface MediaGalleriesRenderProps {
  /** Whether there are media items to display */
  hasMedia: boolean;
  /** Array of media items formatted for MediaGallery */
  media: Array<{ image: string; altText?: string | null }>;
}

/**
 * Headless component for Instagram feed media galleries
 * Handles service logic and provides render props with transformed media data
 *
 * @component
 * @example
 * ```tsx
 * import { FeedMediaGalleries } from '@wix/instagram/core';
 *
 * function MediaGalleriesList() {
 *   return (
 *     <FeedMediaGalleries.MediaGalleries>
 *       {({ hasMedia, media }) => (
 *         <div>
 *           {hasMedia ? (
 *             <MediaGallery.Root mediaGalleryServiceConfig={{ media }}>
 *               <MediaGallery.Viewport />
 *               <MediaGallery.Previous />
 *               <MediaGallery.Next />
 *             </MediaGallery.Root>
 *           ) : (
 *             <p>No media found</p>
 *           )}
 *         </div>
 *       )}
 *     </FeedMediaGalleries.MediaGalleries>
 *   );
 * }
 * ```
 */
export function MediaGalleries(props: MediaGalleriesProps) {
  const feedService = useService(InstagramFeedServiceDefinition);
  const feed = feedService.feedData.get();

  const media = (feed.mediaItems || [])
    .map((item) => {
      // Mirror Stores: gallery renders images only. Use thumbnail for videos, full image for images.
      const image =
        item.type === 'video'
          ? item.thumbnailUrl || null
          : item.mediaUrl || item.thumbnailUrl || null;
      if (!image) return null;
      return {
        image,
        altText: item.altText,
      };
    })
    .filter(Boolean) as { image: string; altText?: string | null }[];

  const hasMedia = media.length > 0;

  return props.children({
    hasMedia,
    media,
  });
}
