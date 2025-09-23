import React from 'react';
import { AsChildSlot, type AsChildChildren } from '@wix/headless-utils/react';
import * as CoreInstagramFeed from './core/InstagramFeed.js';

/**
 * Props for InstagramFeed UserName component
 */
export interface UserNameProps {
  /** Whether to render as a child component */
  asChild?: boolean;
  /** Custom render function when using asChild */
  children?: AsChildChildren<{ username: string; displayName?: string }>;
  /** CSS classes to apply to the default element */
  className?: string;
}

/**
 * Displays the Instagram feed username.
 *
 * @component
 * @example
 * ```tsx
 * // Default usage
 * <InstagramFeed.UserName className="text-lg font-medium" />
 *
 * // Using AsChild pattern for custom elements
 * <InstagramFeed.UserName asChild>
 *   {({ username, displayName }) => (
 *     <a href={`https://instagram.com/${username}`} className="instagram-link">
 *       @{username}
 *       {displayName && <span className="display-name">({displayName})</span>}
 *     </a>
 *   )}
 * </InstagramFeed.UserName>
 * ```
 */
export const UserName = React.forwardRef<HTMLSpanElement, UserNameProps>(
  (props, ref) => {
    const { asChild, children, className, ...otherProps } = props;

    // Use render prop from core to get username data
    return (
      <CoreInstagramFeed.UserName>
        {({ username, displayName }) => {
          const data = { username, displayName };

          return (
            <AsChildSlot
              ref={ref}
              asChild={asChild}
              className={className}
              customElement={children}
              customElementProps={data}
              content={username ? `@${username}` : ''}
              data-testid="instagram-feed-username"
              {...otherProps}
            >
              <span>{username ? `@${username}` : ''}</span>
            </AsChildSlot>
          );
        }}
      </CoreInstagramFeed.UserName>
    );
  },
);
