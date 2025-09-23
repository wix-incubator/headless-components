import React from 'react';
import { useService } from '@wix/services-manager-react';
import { InstagramMediaItemServiceDefinition } from '../services/index.js';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';

enum TestIds {
  instagramMediaUserName = 'instagram-media-username',
}

/**
 * Props for InstagramMedia UserName component
 */
export interface UserNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ userName: string | null }>;
  className?: string;
}

/**
 * Displays the Instagram media user name
 *
 * @example
 * ```tsx
 * // Basic usage
 * <InstagramMedia.UserName />
 *
 * // Custom styling
 * <InstagramMedia.UserName className="font-semibold text-blue-600" />
 *
 * // AsChild pattern for custom rendering
 * <InstagramMedia.UserName asChild>
 *   {({ userName, ...props }) => (
 *     <a {...props} href={`https://instagram.com/${userName}`} className="text-blue-600 hover:underline">
 *       @{userName}
 *     </a>
 *   )}
 * </InstagramMedia.UserName>
 * ```
 */
export const UserName = React.forwardRef<HTMLSpanElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;
    const mediaItemService = useService(InstagramMediaItemServiceDefinition);
    const mediaItem = mediaItemService.mediaItem.get();

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
