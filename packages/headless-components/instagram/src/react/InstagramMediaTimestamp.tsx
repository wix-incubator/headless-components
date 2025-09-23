import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMediaTimestamp = 'instagram-media-timestamp',
}

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
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.Timestamp />
 *
 * // Custom styling
 * <InstagramMedia.Timestamp className="text-sm text-gray-500" />
 *
 * // AsChild pattern for custom rendering
 * <InstagramMedia.Timestamp asChild>
 *   {({ timestamp, formattedDate, ...props }) => (
 *     <time {...props} dateTime={timestamp} className="relative-time">
 *       {formattedDate}
 *     </time>
 *   )}
 * </InstagramMedia.Timestamp>
 * ```
 */
export const Timestamp = React.forwardRef<HTMLTimeElement, TimestampProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

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
