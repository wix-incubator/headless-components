import React from 'react';
import { type InstagramMediaItem } from '../services/index.js';
import { AsChildSlot, TestIds, type AsChildChildren } from './types.js';
import { useGalleryItemContext } from './contexts.js';

/**
 * Props for InstagramFeed Media component
 */
export interface MediaProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    mediaItem: InstagramMediaItem;
    index: number;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the Instagram media (image/video) with proper accessibility support.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.Media className="w-full h-64 object-cover" />
 *
 * // asChild with custom rendering
 * <InstagramFeed.Media asChild>
 *   {React.forwardRef(({ mediaItem, index, ...props }, ref) => (
 *     <div ref={ref} {...props} className="relative group">
 *       <img
 *         src={mediaItem.mediaUrl}
 *         alt={mediaItem.altText || mediaItem.caption || `Instagram post ${index + 1}`}
 *         className="w-full h-64 object-cover"
 *       />
 *       <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-colors">
 *         <div className="absolute bottom-2 left-2 text-white opacity-0 group-hover:opacity-100 transition-opacity">
 *           <p className="text-sm">{mediaItem.caption}</p>
 *         </div>
 *       </div>
 *     </div>
 *   ))}
 * </InstagramFeed.Media>
 * ```
 */
export const Media = React.forwardRef<HTMLElement, MediaProps>((props, ref) => {
  const { asChild, children, className, ...otherProps } = props;
  const { mediaItem, index } = useGalleryItemContext();

  const altText =
    mediaItem.altText || mediaItem.caption || `Instagram post ${index + 1}`;

  if (asChild && children) {
    return (
      <AsChildSlot
        ref={ref}
        asChild={asChild}
        className={className}
        data-testid={TestIds.instagramFeedMedia}
        customElement={children}
        customElementProps={{ mediaItem, index }}
        {...otherProps}
      />
    );
  }

  // Default rendering
  if (mediaItem.type === 'video') {
    return (
      <video
        ref={ref as React.Ref<HTMLVideoElement>}
        className={className}
        data-testid={TestIds.instagramFeedMedia}
        data-type="video"
        controls
        poster={mediaItem.thumbnailUrl}
        aria-label={altText}
        {...otherProps}
      >
        <source src={mediaItem.mediaUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    );
  }

  return (
    <img
      ref={ref as React.Ref<HTMLImageElement>}
      src={mediaItem.mediaUrl}
      alt={altText}
      className={className}
      data-testid={TestIds.instagramFeedMedia}
      data-type="image"
      loading="lazy"
      {...otherProps}
    />
  );
});
