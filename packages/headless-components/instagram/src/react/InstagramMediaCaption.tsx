import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMediaCaption = 'instagram-media-caption',
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
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.Caption />
 *
 * // Custom styling
 * <InstagramMedia.Caption className="text-sm text-gray-600" />
 *
 * // AsChild pattern for custom rendering
 * <InstagramMedia.Caption asChild>
 *   {({ caption, ...props }) => (
 *     <p {...props} className="custom-caption">
 *       {caption}
 *     </p>
 *   )}
 * </InstagramMedia.Caption>
 * ```
 */
export const Caption = React.forwardRef<HTMLDivElement, CaptionProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

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
