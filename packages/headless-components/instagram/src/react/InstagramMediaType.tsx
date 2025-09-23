import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMediaType = 'instagram-media-type',
}

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
 * Displays the Instagram media type (image, video, carousel)
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.MediaType />
 *
 * // Custom styling
 * <InstagramMedia.MediaType className="badge" />
 *
 * // AsChild pattern for custom rendering
 * <InstagramMedia.MediaType asChild>
 *   {({ mediaType, ...props }) => (
 *     <span {...props} className={`badge ${mediaType === 'video' ? 'badge-video' : 'badge-image'}`}>
 *       {mediaType === 'video' ? '📹' : '📷'} {mediaType}
 *     </span>
 *   )}
 * </InstagramMedia.MediaType>
 * ```
 */
export const MediaType = React.forwardRef<HTMLSpanElement, MediaTypeProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

    const mediaType = mediaItem.type || 'unknown';
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
        {...otherProps}
      >
        <span>{mediaType}</span>
      </AsChildSlot>
    );
  },
);
