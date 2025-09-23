import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramFeed from './core/InstagramFeed.js';

enum TestIds {
  instagramFeedUserName = 'instagram-feed-username',
}

/**
 * Props for InstagramFeed UserName component
 */
export interface UserNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{
    username: string;
  }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the Instagram username.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.UserName className="text-lg font-medium" />
 *
 * // asChild with custom rendering
 * <InstagramFeed.UserName asChild>
 *   {React.forwardRef(({ username, ...props }, ref) => (
 *     <span ref={ref} {...props} className="text-lg font-medium">
 *       {username}
 *     </span>
 *   ))}
 * </InstagramFeed.UserName>
 * ```
 */
export const UserName = React.forwardRef<HTMLElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    return (
      <CoreInstagramFeed.UserName>
        {({ username }) => (
          <AsChildSlot
            ref={ref}
            asChild={asChild}
            className={className}
            data-testid={TestIds.instagramFeedUserName}
            customElement={children}
            customElementProps={{ username }}
            content={username}
            {...otherProps}
          >
            <span>{username}</span>
          </AsChildSlot>
        )}
      </CoreInstagramFeed.UserName>
    );
  },
);
